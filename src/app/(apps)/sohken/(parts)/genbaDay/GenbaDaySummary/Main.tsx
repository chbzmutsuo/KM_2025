'use client'

import {LabelValue} from '@components/styles/common-components/ParameterCard'

import {formatDate} from '@class/Days'

import React from 'react'

import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import GanbaName from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/GanbaName'
import {TaskWithNinku} from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/TaskWithNinku'
import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
export default function Main(props: {
  GenbaDayBasicEditor_HK: ReturnType<typeof useGenbaDayBasicEditor>
  pathname: string
  GenbaDayTaskMidTable: any
  GenbaDay: any
  editable: boolean
}) {
  const {GenbaDayBasicEditor_HK, pathname, GenbaDayTaskMidTable, GenbaDay, editable} = props
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const isDetailPage = pathname.includes(`/genba/`)

  const activateEditFrom = () => {
    if (editable) {
      GenbaDayBasicEditor_HK.setGMF_OPEN({
        GenbaDay,
      })
    }
  }
  return (
    <div className={` relative`}>
      <section>
        {isDetailPage && <LabelValue {...{label: `日付`}}>{formatDate(GenbaDay.date, `MM月DD日(ddd)`)}</LabelValue>}
        {!isDetailPage && (
          <div>
            <LabelValue {...{label: `現場`}}>
              <GanbaName {...{GenbaDay, editable}} />
            </LabelValue>
          </div>
        )}

        <div className={`onHover`} onClick={activateEditFrom}>
          <LabelValue {...{label: `連絡`}}>{GenbaDay.remarks}</LabelValue>
        </div>
        <div>
          <LabelValue {...{label: `タスク`}}>
            <TaskWithNinku
              {...{
                GenbaDay,
                editable,
                setGenbaDayCardEditModal: GenbaDayCardEditModal_HK.setGMF_OPEN,
                GenbaDayTaskMidTable,
              }}
            />
          </LabelValue>
        </div>

        <div className={`onHover`} onClick={activateEditFrom}>
          <LabelValue {...{label: `その他`}}>{GenbaDay.subTask}</LabelValue>
        </div>
      </section>
    </div>
  )
}
