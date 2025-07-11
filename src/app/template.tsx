'use client'

import {Paper} from '@components/styles/common-components/paper'
import {R_Stack} from '@components/styles/common-components/common-components'
import {T_LINK} from '@components/styles/common-components/links'

import GlobalTemplate from '@components/layout/GlobalTemplate'

import React from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {isDev} from '@lib/methods/common'

export default function template({children}) {
  const {session} = useGlobal()

  const Menu = () => {
    if (session?.scopes?.admin && process.env.NEXT_PUBLIC_ROOTPATH === 'KM' && !isDev) {
      return (
        <Paper className={`mt-auto sticky bottom-0 p-2  py-4 w-full  z-[1000]`}>
          <R_Stack className={` gap-8 justify-around`}>
            <T_LINK href={`/KM`}>KM</T_LINK>
            <T_LINK href={`/stock`}>Stock</T_LINK>
            <T_LINK href={`/keihi`}>Keihi</T_LINK>
          </R_Stack>
        </Paper>
      )
    }
  }

  return (
    <GlobalTemplate>
      {children}
      <Menu />
    </GlobalTemplate>
  )
}

//
