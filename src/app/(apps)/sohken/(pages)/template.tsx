'use client'

import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import {useGenbaDetailModal} from '@app/(apps)/sohken/hooks/useGenbaDetailModal'
import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'
import {GoogleCalendar_Get} from '@app/api/google/actions/calendarAPI'
import {Button} from '@components/styles/common-components/Button'
import {isDev} from '@lib/methods/common'
import {addDays} from 'date-fns'
import React from 'react'

export default function template({children}) {
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const ShiftEditFormModal_HK = useShiftEditFormModal()
  const GenbaDayBasicEditor_HK = useGenbaDayBasicEditor()
  const GenbaDetailModal_HK = useGenbaDetailModal()
  return (
    <div>
      <Button
        onClick={async () => {
          // GoogleCalendar_Get({calendarId: 'ja.japanese#holiday@group.v.calendar.google.com'})
          // const res = await GoogleCalendar_Get({calendarId: 'skikuc03@gmail.com'})
          const res = await GoogleCalendar_Get({calendarId: '411.mutsuo@gmail.com', from: addDays(new Date(), -1)})
          const items = res.events.items
          console.log(items) //logs
        }}
      >
        カレンダAPI
      </Button>
      <GenbaDayCardEditModal_HK.Modal />
      <ShiftEditFormModal_HK.Modal />
      <GenbaDayBasicEditor_HK.Modal />
      <GenbaDetailModal_HK.Modal />
      {children}
    </div>
  )
}
