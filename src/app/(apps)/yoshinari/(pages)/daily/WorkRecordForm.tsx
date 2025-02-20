'use client'

import React, {useEffect} from 'react'

import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {ColBuilder} from '@app/(apps)/yoshinari/class/ColBuilder'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Button} from '@components/styles/common-components/Button'
import {formatDate, getMidnight} from '@class/Days'
import {Prisma} from '@prisma/client'
import useGPS from '@hooks/useGPS'

export const WorkRecordForm = ({selectedRow}) => {
  const {theWorkLog} = selectedRow
  const useGlobalProps = useGlobal()
  const {toggleLoad} = useGlobalProps
  const now = new Date(selectedRow.date)
  now.setHours(new Date().getHours())
  now.setMinutes(new Date().getMinutes())

  const defaultFrom = theWorkLog?.from ?? now
  const defaultTo = theWorkLog?.to ? theWorkLog?.to : theWorkLog?.from ? now : undefined
  const formData = {
    breakTime: theWorkLog?.breakTime,
    date: selectedRow.date,
    from: defaultFrom && formatDate(defaultFrom, 'HH:mm'),
    to: defaultTo && formatDate(defaultTo, 'HH:mm'),
  }

  const {BasicForm, latestFormData} = useBasicFormProps({
    columns: ColBuilder.ysWorkRecord({useGlobalProps}),
    formData,
  })

  const {error, getLocation, location} = useGPS()
  useEffect(() => {
    getLocation()
  }, [])

  return (
    <>
      <BasicForm
        latestFormData={latestFormData}
        onSubmit={async data => {
          const {date, from, to, userId, breakTime} = data

          const workRecord = {
            from: from ? new Date(`${formatDate(date)} ${from}`) : null,
            to: to ? new Date(`${formatDate(date)} ${to}`) : null,
            breakTime,
            date: getMidnight(selectedRow.date),
          }

          // メインデータ
          const ysWorkRecordPayload = {userId, ...workRecord}

          // 編集履歴
          const historyPayload = {...workRecord, lat: location.lat, lng: location.lng}

          toggleLoad(async () => {
            const res = await fetchUniversalAPI(`ysWorkRecord`, `upsert`, {
              where: {
                unique_date_userId: {date: workRecord.date, userId: useGlobalProps.session.id},
              },
              create: {
                ...ysWorkRecordPayload,
                TimeCardHistory: {create: historyPayload},
              },
              update: {
                ...ysWorkRecordPayload,
                TimeCardHistory: {create: historyPayload},
              },
              include: {
                TimeCardHistory: true,
              },
            } as Prisma.YsWorkRecordUpsertArgs)

            toastByResult(res)
          })
        }}
      >
        <Button>登録</Button>
      </BasicForm>
    </>
  )
}
