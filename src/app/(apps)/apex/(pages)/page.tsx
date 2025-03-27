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
            <div className={` h-[120px]  overflow-y-auto  border text-sm`}>
              テストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージテストメッセージ
            </div>
          </div>
        </C_Stack>
      </div>
      <C_Stack className={` w-full items-center gap-8 md:text-xl`}>
        <Link className={` text-sm  font-bold md:text-xl`} href={`https://apex-cpa.co.jp/contact/`}>
          会員サイトTOPページへ
        </Link>
        <div className={` w-full bg-blue-500 p-2 text-center  text-sm text-white  md:text-xl `}>
          Copyright(c) 2025 アペックス会計株式会社 All Rights Reserved.
        </div>
      </C_Stack>
    </div>
  )
}
