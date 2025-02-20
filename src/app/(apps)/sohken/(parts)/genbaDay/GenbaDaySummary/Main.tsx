'use client'

import {LabelValue} from '@components/styles/common-components/ParameterCard'

import {formatDate} from '@class/Days'

import React from 'react'

import {Button} from '@components/styles/common-components/Button'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {colorVariants} from '@components/styles/common-components/colorVariants'

import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import GanbaName from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/GanbaName'
import {TaskWithNinku} from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/TaskWithNinku'

export default function Main({pathname, GenbaDayTaskMidTable, GenbaDay, editable, theStatus, toggleLoad}) {
  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const isDetailPage = pathname.includes(`/genba/`)

  return (
    <div className={` relative`}>
      <section>
        {isDetailPage && <LabelValue {...{label: `日付`}}>{formatDate(GenbaDay.date, `MM月DD日(ddd)`)}</LabelValue>}
        {!isDetailPage && (
          <LabelValue {...{label: `現場`}}>
            <GanbaName {...{GenbaDay, editable}} />
          </LabelValue>
        )}

        <LabelValue {...{label: `連絡`}}>{GenbaDay.remarks}</LabelValue>
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

        <LabelValue {...{label: `その他`}}>{GenbaDay.subTask}</LabelValue>
      </section>

      <section className={`  flex justify-end`}>
        <Button
          size="sm"
          color={theStatus?.color as colorVariants}
          onClick={async () => {
            //完了フラグの切り替え
            toggleLoad(
              async () => {
                await fetchUniversalAPI(`genbaDay`, `update`, {
                  where: {id: GenbaDay.id},
                  finished: !GenbaDay.finished,
                })
              },
              {refresh: true, mutate: true}
            )
          }}
        >
          {theStatus?.label}
        </Button>
      </section>
    </div>
  )
}
