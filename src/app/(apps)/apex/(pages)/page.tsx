'use client'
import {SPREADSHEET_URLS} from '@app/(apps)/apex/(constants)/SPREADSHEET_CONST'
import {C_Stack, Center, R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function page() {
  const {query} = useGlobal()

  const list = SPREADSHEET_URLS.filter(item => {
    return true
    return item.def
  })
  return (
    <div className={`  mx-auto   `}>
      <Center>
        <Link href={`/apex`}>
          <Image src={'/apex/header.png'} width={3840} height={100} alt="" />
        </Link>
      </Center>
      <div className={`p-4`}>
        <C_Stack className={` justify-between gap-[60px] `}>
          <div className={` font-bold`}>
            「節税レスキュー」3種の神器シミュレーションサイトへようこそ。
            ここではあなたの手取りを各種規定導入後、いくら増やすことごできるか確認できます。
          </div>

          <C_Stack className={` gap-[50px]`}>
            {list.map(item => {
              return (
                <div key={item.simulationId}>
                  <div className={` border-b border-blue-500 font-bold text-blue-500 md:text-3xl`}>
                    <Link href={`/apex/${item.simulationId}`}>
                      <R_Stack className={`  w-[300px] flex-nowrap items-center justify-between gap-1 md:w-[500px] `}>
                        {item.subTitle && (
                          <div className={`w-[60px] md:w-[100px]`}>
                            <span>{item.subTitle}</span>
                          </div>
                        )}
                        <div className={`w-[240px] md:w-[400px]`}>{item.title}シミュレーション</div>
                      </R_Stack>
                    </Link>
                  </div>
                  <div className={``}>{item.description}</div>
                </div>
              )
            })}
          </C_Stack>

          <div>
            <div className={` text-sm text-gray-500 md:text-xl`}>免責事項(Disclaimr)</div>
            <C_Stack className={` h-[240px]  gap-4  overflow-y-auto border p-1 text-sm`}>
              <div>
                <h2>免責事項</h2>
                <p>
                  本計算機（以下、「本サービス」といいます。）は、利用者の税務・会計上の節税シミュレーションを支援するための参考ツールとして提供されるものです。本サービスの利用にあたり、以下の点にご留意ください。
                </p>
              </div>
              <div>
                <h3>1. 個人情報の取扱いについて</h3>
                <p>
                  本サービスは、利用者の個人情報を取得・保存・管理することはありません。そのため、本サービスの利用は個人情報保護法（個人情報の保護に関する法律）に違反するものではありません。利用者が入力する情報は、計算処理のためのみ使用され、当社または第三者へ提供・保存・共有されることはありません。
                </p>
              </div>

              <div>
                <h3>2. 情報の正確性について</h3>
                <p>
                  本サービスは、一般的な税務・会計のルールに基づいて計算を行いますが、その正確性・完全性・最新性を保証するものではありません。法令の改正や個別の状況により、結果が異なる場合があります。
                </p>
              </div>

              <div>
                <h3>3. 専門家のアドバイスの必要性</h3>
                <p>
                  本サービスの計算結果は、あくまで参考情報であり、実際の税務申告や財務戦略の決定に際しては、必ず税理士・公認会計士等の専門家にご相談ください。本サービスの利用によって生じた損害等について、当社および開発者は一切の責任を負いかねます。
                </p>
              </div>

              <div>
                <h3>4. 責任の制限</h3>
                <p>
                  本サービスの利用により発生した直接的・間接的損害、逸失利益、特別損害等に対し、当社および開発者は一切の責任を負いません。利用者は自己の責任において本サービスを利用するものとします。
                </p>
              </div>

              <div>
                <h3>5. 税制改正等による影響</h3>
                <p>
                  税制や会計基準は頻繁に改正されるため、本サービスの内容が最新の法令・規則に適合していない場合があります。最新の情報については、国税庁や公的機関の情報をご確認の上、適切に対応してください。
                </p>
              </div>

              <div>
                <h3>6. サービスの提供中止・変更について</h3>
                <p>
                  本サービスは、予告なく内容の変更、提供の中断・終了を行う場合があります。本サービスの提供停止等に起因する損害についても、当社および開発者は一切の責任を負いません。
                </p>
              </div>

              <div>
                <p>本サービスを利用された場合、上記免責事項に同意したものとみなされます。</p>
              </div>
            </C_Stack>
          </div>
        </C_Stack>
      </div>
      <C_Stack className={` w-full items-center gap-8 md:text-xl`}>
        <Link className={`t-link text-sm  font-bold md:text-xl`} href={`https://apex-cpa.co.jp/contact/`}>
          会員サイトTOPページへ
        </Link>
        <div className={` w-full bg-blue-500 p-2 text-center  text-sm text-white  md:text-xl `}>
          Copyright(c) {new Date().getFullYear()} アペックス会計株式会社 All Rights Reserved.
        </div>
      </C_Stack>
    </div>
  )
}
