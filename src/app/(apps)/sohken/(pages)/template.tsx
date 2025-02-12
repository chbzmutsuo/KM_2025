'use client'

import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'

import React from 'react'

export default function template({children}) {
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const ShiftEditFormModal_HK = useShiftEditFormModal()
  return (
    <div>
      <GenbaDayCardEditModal_HK.Modal />
      <ShiftEditFormModal_HK.Modal />
      {children}
    </div>
  )
}
