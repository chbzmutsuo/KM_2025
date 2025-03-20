'use client'
import {toUtc} from '@class/Days'

import {Button} from '@components/styles/common-components/Button'
import {C_Stack, Center, Padding} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useFileUploadProps from '@hooks/useFileUpload/useFileUploadProps'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

import React from 'react'
import {toast} from 'react-toastify'

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1jr1BCd9gXaK6EYK0VCKWWLqjC66nDP_ws7HpAwN1XKU/edit?gid=0#gid=0'
export default function Page(props) {
  const header = [
    `注文ID`,
    `注文日時`,
    `氏_請求先`,
    `名_請求先`,
    `郵便番号_請求先`,
    `都道府県_請求先`,
    `住所_請求先`,
    `住所2_請求先`,
    `電話番号_請求先`,
    `メールアドレス_請求先`,
    `氏_配送先`,
    `名_配送先`,
    `郵便番号_配送先`,
    `都道府県_配送先`,
    `住所_配送先`,
    `住所2_配送先`,
    `電話番号_配送先`,
    `備考`,
    `商品名`,
    `バリエーション`,
    `価格`,
    `税率`,
    `数量`,
    `合計金額`,
    `送料`,
    `支払い方法`,
    `代引き手数料`,
    `発送状況`,
    `商品ID`,
    `種類ID`,
    `購入元`,
    `配送日`,
    `配送時間帯`,
    `注文メモ`,
    `調整金額`,
  ]
  const {toggleLoad} = useGlobal()

  const {
    fileArrState,
    fileErrorState,
    component: {FileUploaderMemo},
  } = useFileUploadProps({
    accept: {'text/csv': ['.csv']},
    readAs: 'readAsText',
  })

  const csvArray = fileArrState?.[0]?.fileContent
  return (
    <Center>
      <Padding>
        <C_Stack className={` items-center gap-[60px]`}>
          <span>最新のBASE売上データをインポートしてください。</span>
          {FileUploaderMemo}
          <div>
            {csvArray && (
              <div>
                <Button
                  onClick={async item => {
                    toggleLoad(async item => {
                      const array = csvArray as any[]
                      if (array) {
                        const values = array.slice(1).map((item, i) => {
                          return Object.fromEntries(header.map((key, i) => [key, item[i]]))
                        })

                        const OrderIdList = values.reduce((acc, item) => {
                          acc[item.注文ID] = [...(acc[item.注文ID] ?? []), item]
                          return acc
                        }, {})

                        await Promise.all(
                          Object.entries(OrderIdList).map(async ([orderId, rows]) => {
                            const cartData: Prisma.AqSaleCartUpsertArgs = {
                              where: {baseOrderId: orderId},
                              create: {
                                baseOrderId: orderId,
                                date: toUtc(rows[0].注文日時),
                                paymentMethod: rows[0].支払い方法,
                                aqCustomerId: 0,
                              },
                              update: {
                                baseOrderId: orderId,
                                date: toUtc(rows[0].注文日時),
                                paymentMethod: rows[0].支払い方法,
                                aqCustomerId: 0,
                              },
                            }

                            const payloadArray = await Promise.all(
                              rows.map(async row => {
                                const {
                                  注文ID,
                                  注文日時,
                                  氏_請求先,
                                  名_請求先,
                                  郵便番号_請求先,
                                  都道府県_請求先,
                                  住所_請求先,
                                  住所2_請求先,
                                  電話番号_請求先,
                                  メールアドレス_請求先,
                                  氏_配送先,
                                  名_配送先,
                                  郵便番号_配送先,
                                  都道府県_配送先,
                                  住所_配送先,
                                  住所2_配送先,
                                  電話番号_配送先,
                                  備考,
                                  商品名,
                                  バリエーション,
                                  価格,
                                  税率,
                                  数量,
                                  合計金額,
                                  送料,
                                  支払い方法,
                                  代引き手数料,
                                  発送状況,
                                  商品ID,
                                  種類ID,
                                  購入元,
                                  配送日,
                                  配送時間帯,
                                  注文メモ,
                                  調整金額,
                                } = row

                                const name = 氏_請求先 + ' ' + 名_請求先

                                const customerRes = await fetchUniversalAPI(`aqCustomer`, `upsert`, {
                                  where: {name},
                                  ...createUpdate({
                                    name,
                                    postal: 郵便番号_請求先,
                                    state: 都道府県_請求先,
                                    city: 住所_請求先,
                                    street: 住所2_請求先,
                                    tel: 電話番号_請求先,
                                    email: メールアドレス_請求先,
                                    fromBase: true,
                                  }),
                                })

                                const productRes = await fetchUniversalAPI(`aqProduct`, `upsert`, {
                                  where: {name: 商品名},
                                  ...createUpdate({name: 商品名, cost: 0, fromBase: true}),
                                })

                                cartData.create = {
                                  baseOrderId: 注文ID,
                                  date: toUtc(注文日時),
                                  paymentMethod: 'BASE',
                                  aqCustomerId: customerRes.result.id,
                                }
                                cartData.update = {
                                  baseOrderId: 注文ID,
                                  date: toUtc(注文日時),
                                  paymentMethod: 'BASE',
                                  aqCustomerId: customerRes.result.id,
                                }

                                const taxRate = 税率 === `標準税率` ? 1.1 : 税率 === `軽減税率` ? 1.08 : 1
                                const price = Math.round(Number(価格) / Number(taxRate))
                                const payload = {
                                  baseSaleRecordId: [注文ID, 商品ID, 種類ID].join(`_`),
                                  date: toUtc(注文日時),
                                  aqCustomerId: customerRes.result.id,
                                  quantity: Number(数量),
                                  price: price,
                                  taxRate: taxRate,
                                  taxedPrice: Number(合計金額),
                                  remarks: [`BASE売上`, 備考].join(`\n`),
                                  aqProductId: productRes.result.id,
                                }
                                return payload
                              })
                            )

                            const res = await fetchUniversalAPI(`aqSaleCart`, `upsert`, {
                              where: cartData.where,
                              create: {
                                ...cartData.create,
                                AqSaleRecord: {
                                  createMany: {
                                    data: payloadArray,
                                  },
                                },
                              },
                              update: {...cartData.update},
                            })
                          })
                        )
                      } else {
                        toast.error(`データ連携に失敗しました。`)
                      }
                    })
                  }}
                >
                  取り込み
                </Button>
              </div>
            )}
          </div>
        </C_Stack>
      </Padding>
    </Center>
  )
}
