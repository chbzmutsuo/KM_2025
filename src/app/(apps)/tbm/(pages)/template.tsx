'use client'

import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import useOdometerInputGMF from '@app/(apps)/tbm/(globalHooks)/useOdometerInputGMF'
import React from 'react'
export default function Template({children}) {
  const HK_HaishaTableEditorGMF = useHaishaTableEditorGMF()
  const HK_OdometerInputGMF = useOdometerInputGMF()
  return (
    <div>
      <HK_HaishaTableEditorGMF.Modal />
      <HK_OdometerInputGMF.Modal />
      {children}
    </div>
  )
}
