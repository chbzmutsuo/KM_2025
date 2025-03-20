'use client'
import {SPREADSHEET_URLS} from '@app/(apps)/apex/(constants)/SPREADSHEET_CONST'
import {Absolute, C_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import Link from 'next/link'
import React from 'react'

export default function page() {
  const {query} = useGlobal()

  const list = SPREADSHEET_URLS.filter(item => {
    return item.def
  })
  return (
    <Absolute className={` w-full  p-1`}>
      <C_Stack className={` items-center gap-[60px]`}>
        {list.map(item => {
          return (
            <div key={item.simulationId}>
              <Link className={` t-link text-xl`} href={`/apex/${item.simulationId}`}>
                {item.title}シミュレーション
              </Link>
            </div>
          )
        })}
      </C_Stack>
    </Absolute>
  )
}
