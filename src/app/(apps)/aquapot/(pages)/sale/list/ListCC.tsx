'use client'
import useGlobalSaleEditor from '@app/(apps)/aquapot/(pages)/(template)/useGlobalSaleEditor'
import Filter from '@app/(apps)/aquapot/(pages)/sale/list/Filter'
import {formatDate} from '@class/Days'
import {DH} from '@class/DH'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {CircledIcon} from '@components/styles/common-components/IconBtn'
import {Paper} from '@components/styles/common-components/paper'
import {PencilSquareIcon, TrashIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import Link from 'next/link'
import React from 'react'

export default function ListCC({records}) {
  const {toggleLoad, session} = useGlobal()

  const {HK_SaleEditor} = useGlobalSaleEditor()

  const cachTotal = records.filter(rec => rec.paymentMethod === `現金`).reduce((acc, rec) => acc + rec.taxedPrice, 0)

  let nextColor = 'bg-gray-100'
  const TABLE = CsvTable({
    csvOutput: {fileTitle: `売上リスト`},
    headerRecords: [
      //
      {
        csvTableRow: [
          {cellValue: `購入日`},
          {cellValue: [`会社名`, `役職`, `顧客名`].filter(Boolean).join(` / `)},
          {cellValue: `担当者`},
          // {cellValue: `会社名`},
          // {cellValue: `役職`},
          // {cellValue: `担当者`},
          {cellValue: `商品名`},
          {cellValue: `価格オプション`},
          {cellValue: `数量`},
          {cellValue: `価格`},
          {cellValue: `消費税率`},
          {cellValue: `税込価格`},
          {cellValue: `支払方法`},
          {cellValue: `但し書き`},
          {cellValue: `その他`},
        ],
      },
    ],
    bodyRecords: records.map((rec, i) => {
      const prev = records[i - 1]
      const isDifferentCartId = rec.sale_cart_id !== prev?.sale_cart_id

      if (isDifferentCartId) {
        nextColor = nextColor === `bg-blue-100` ? `bg-gray-100 border-y-[2px] border-y-black ` : `bg-blue-100`
      }
      const rowColor = nextColor

      return {
        className: rowColor,
        csvTableRow: [
          {cellValue: formatDate(rec.date, `YYYY/MM/DD(ddd)`)},
          {
            cellValue: (
              <Link href={`/aquapot/aqCustomer/${rec.aqCustomerId}`}>
                {[rec.companyName, rec.jobTitle, rec.name].filter(Boolean).join(` / `)}
              </Link>
            ),
          },
          {cellValue: rec.userName},
          // {cellValue: rec.companyName},
          // {cellValue: rec.jobTitle},
          // {cellValue: rec.userName},
          {cellValue: rec.productName},
          {
            cellValue: [
              //
              rec.priceOption_Name,
              rec.priceOption_Price && `(${DH.toPrice(rec.priceOption_Price)}円)`,
            ]
              .filter(Boolean)
              .join(``),
          },
          {cellValue: rec.quantity},
          {cellValue: rec.price},
          {cellValue: rec.taxRate},
          {cellValue: rec.taxedPrice},
          {cellValue: rec.paymentMethod},
          {cellValue: rec.remarks},

          {
            cellValue: (
              <R_Stack {...{className: `justify-around`}}>
                <CircledIcon
                  {...{
                    onClick: () =>
                      HK_SaleEditor.setGMF_OPEN({
                        saleRecordId: rec.sale_record_id,
                      }),
                    icon: <PencilSquareIcon />,
                  }}
                />
                <CircledIcon
                  {...{
                    onClick: async () => {
                      if (confirm(`この購入を削除しますか？`)) {
                        await toggleLoad(async () => {
                          const saleRecord = await fetchUniversalAPI(`aqSaleRecord`, `delete`, {
                            where: {id: rec.sale_record_id ?? 0},
                          })
                        })
                      }
                    },
                    icon: <TrashIcon />,
                  }}
                />
              </R_Stack>
            ),
            cellValueRaw: '',
          },
        ],
      }
    }),
  })
  return (
    <C_Stack>
      <Filter />
      <R_Stack className={` justify-between`}>
        {TABLE.Downloader()}
        <R_Stack>
          <span>現金合計: </span>
          <strong>{DH.toPrice(cachTotal)}</strong>
          <span>円</span>
        </R_Stack>
      </R_Stack>
      <Paper {...{className: `rounded-lg`}}>{TABLE.WithWrapper({size: `lg`})}</Paper>
    </C_Stack>
  )
}
