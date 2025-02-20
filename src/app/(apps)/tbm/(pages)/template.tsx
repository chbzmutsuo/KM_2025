'use client'

import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import React from 'react'
export default function Template({children}) {
  const HK_HaishaTableEditorGMF = useHaishaTableEditorGMF()
  return (
    <div>
      <HK_HaishaTableEditorGMF.Modal />
      {children}
    </div>
  )
}
