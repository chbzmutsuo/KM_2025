'use client'

import useGlobal from '@hooks/globalHooks/useGlobal'

import React from 'react'
export default function Template({children}) {
  const {pathname} = useGlobal()
  const HeaderTargetPathList = [`/apex`]

  return (
    <div>
      {HeaderTargetPathList.includes(pathname) && <></>}

      {children}
    </div>
  )
}
