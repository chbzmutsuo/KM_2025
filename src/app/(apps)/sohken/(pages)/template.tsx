'use client'

import CalenderRefresher from '@app/(apps)/sohken/(pages)/genbaDay/CalenderRefresher'
import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import {useGenbaDetailModal} from '@app/(apps)/sohken/hooks/useGenbaDetailModal'
import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'
import useGlobal from '@hooks/globalHooks/useGlobal'

import React from 'react'

export default function template({children}) {
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const ShiftEditFormModal_HK = useShiftEditFormModal()
  const GenbaDayBasicEditor_HK = useGenbaDayBasicEditor()
  const GenbaDetailModal_HK = useGenbaDetailModal()

  const {accessScopes} = useGlobal()
  const {admin} = accessScopes()

  return (
    <div>
      <GenbaDayCardEditModal_HK.Modal />
      <ShiftEditFormModal_HK.Modal />
      <GenbaDayBasicEditor_HK.Modal />
      <GenbaDetailModal_HK.Modal />
      {children}
      {admin && (
        <div className={` sticky bottom-1 px-2`}>
          <CalenderRefresher />
        </div>
      )}
    </div>
  )
}
