'use client'

import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import {useGenbaDetailModal} from '@app/(apps)/sohken/hooks/useGenbaDetailModal'
import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'
import React from 'react'

export default function template({children}) {
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const ShiftEditFormModal_HK = useShiftEditFormModal()
  const GenbaDayBasicEditor_HK = useGenbaDayBasicEditor()
  const GenbaDetailModal_HK = useGenbaDetailModal()
  return (
    <div>
      <GenbaDayCardEditModal_HK.Modal />
      <ShiftEditFormModal_HK.Modal />
      <GenbaDayBasicEditor_HK.Modal />
      <GenbaDetailModal_HK.Modal />
      {children}
    </div>
  )
}
