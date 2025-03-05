'use client'

import useGasolineGMF from '@app/(apps)/tbm/(globalHooks)/useGasolineGMF'
import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import useOdometerInputGMF from '@app/(apps)/tbm/(globalHooks)/useOdometerInputGMF'
import useProductMidEditor from '@app/(apps)/tbm/(globalHooks)/useProductMidEditorGMF'
import React from 'react'
export default function Template({children}) {
  const HK_HaishaTableEditorGMF = useHaishaTableEditorGMF()
  const HK_OdometerInputGMF = useOdometerInputGMF()
  const HK_GasolineGMF = useGasolineGMF()
  const HK_ProductMidEditor = useProductMidEditor()
  return (
    <div>
      <HK_ProductMidEditor.Modal />
      <HK_GasolineGMF.Modal />
      <HK_HaishaTableEditorGMF.Modal />
      <HK_OdometerInputGMF.Modal />
      {children}
    </div>
  )
}
