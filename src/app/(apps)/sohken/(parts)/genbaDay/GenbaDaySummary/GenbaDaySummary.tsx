'use client'
import {C_Stack} from '@cm/components/styles/common-components/common-components'

import useGlobal from '@hooks/globalHooks/useGlobal'

import React from 'react'
import {jotai_GDS_DND, useJotai} from '@hooks/useJotai'
import {GENBA_DAY_STATUS} from 'src/non-common/(chains)/getGenbaScheduleStatus/GENBA_DAY_STATUS'
import {Wrapper} from '@components/styles/common-components/paper'
import Basics from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/Main'
import Sub from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/Sub'
import {Button} from '@components/styles/common-components/Button'
import {colorVariants} from '@components/styles/common-components/colorVariants'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Genba, GenbaDay, GenbaDayTaskMidTable} from '@prisma/client'

import {toast} from 'react-toastify'
import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
import {calcGenbaDayStatus} from 'src/non-common/(chains)/getGenbaScheduleStatus/calcGenbaDayStatus'

const GenbaDaySummary = (props: {
  GenbaDayBasicEditor_HK: ReturnType<typeof useGenbaDayBasicEditor>
  editable
  records?: any
  GenbaDay
  allShiftBetweenDays: any
}) => {
  const {GenbaDayBasicEditor_HK, editable = true, records, GenbaDay} = props
  const {accessScopes} = useGlobal()
  const admin = accessScopes()

  const {Genba, GenbaDayTaskMidTable, active} = GenbaDay as GenbaDay & {
    Genba: Genba
    GenbaDayTaskMidTable: GenbaDayTaskMidTable[]
  }

  const {toggleLoad, PC, pathname, query, session} = useGlobal()

  const [GDS_DND, setGDS_DND] = useJotai(jotai_GDS_DND)

  const commonProps = {GDS_DND, setGDS_DND, GenbaDay}

  const theStatus = GENBA_DAY_STATUS.find(d => d.label === (GenbaDay.status || '未完了'))

  const stuffAllocated = GenbaDay.GenbaDayShift.length > 0

  const isFinished = GENBA_DAY_STATUS.some(item => {
    return item.label === theStatus?.label && item.finishFlag
  })

  const confirmFinished = async ({GenbaDay}) => {
    const {GenbaDayTaskMidTable} = GenbaDay

    const genbadays = await calcGenbaDayStatus({genbaId: GenbaDay.genbaId})

    const finishDate = genbadays.find(item => {
      const {isLastFullfilledDay} = item
      const tasksMatch = GenbaDayTaskMidTable.every(mid => {
        return item.GenbaDayTaskMidTable.some(item => mid.genbaTaskId === item.genbaTaskId)
      })

      return tasksMatch && isLastFullfilledDay
    })

    if (finishDate?.id === undefined) {
      return alert('このタスクはまだ完了していません。')
    }

    const message = !isFinished
      ? '完了確定を実施すると、完了日以降のスタッフ・車両配置が削除されます。よろしいですか？'
      : '完了入力を取り消します。すでに自動削除されたスタッフ・車両配置は復元されません。よろしいですか？'

    toggleLoad(
      async () => {
        if (confirm(message)) {
          await fetchUniversalAPI(`genbaDay`, `update`, {where: {id: finishDate?.id}, data: {finished: !finishDate?.finished}})

          const allDeallocateGenbaDayShift = genbadays.filter(item => {
            const overAllocated = item.ninkuFullfilled && item.GenbaDayShift.length > 0
            return overAllocated && !item.isLastFullfilledDay
          })

          const genbaDayShiftDelete = await fetchUniversalAPI(`genbaDayShift`, `deleteMany`, {
            where: {genbaDayId: {in: allDeallocateGenbaDayShift.map(item => item.id)}},
          })

          if (genbaDayShiftDelete?.result?.count > 0) {
            toast.warn(`完了日の翌日以降の${genbaDayShiftDelete?.result?.count}件のスタッフ配置を削除しました。`)
          }

          const genbaDaySoukenCarDelete = await fetchUniversalAPI(`genbaDaySoukenCar`, `deleteMany`, {
            where: {genbaDayId: {in: allDeallocateGenbaDayShift.map(item => item.id)}},
          })
          if (genbaDaySoukenCarDelete?.result?.count > 0) {
            toast.warn(`完了日の翌日以降の${genbaDaySoukenCarDelete?.result?.count}件の車両配置を削除しました。`)
          }
        }
      },
      {refresh: true, mutate: true}
    )
  }

  const confirmFinishedByGenbaDay = async e => {
    e.preventDefault()

    confirmFinished({GenbaDay})
  }

  const ButtonDisplay = item => {
    if (isFinished) {
      return (
        <Button onClick={confirmFinishedByGenbaDay} color={theStatus?.color as colorVariants}>
          {theStatus?.label}
        </Button>
      )
    } else if (!active) {
      return (
        <Button onClick={confirmFinishedByGenbaDay} color={stuffAllocated ? 'red' : 'orange'}>
          {stuffAllocated ? '要確認(人員超過)' : '要確認'}
        </Button>
      )
    } else {
      if (GenbaDay.finished) {
        return (
          <Button onClick={confirmFinishedByGenbaDay} color={theStatus?.color as colorVariants}>
            {theStatus?.label}
          </Button>
        )
      }
      return null
      // return (
      //   <Button onClick={confirmFinished} color={`orange`}>
      //     要確定
      //   </Button>
      // )
    }
  }

  return (
    <div style={{width: 420, maxWidth: '90vw'}} className={`relative w-full `}>
      {editable && (
        <div className={`  absolute right-4 top-4  z-[10] w-fit rotate-6 text-lg font-bold `}>
          <ButtonDisplay />
        </div>
      )}

      <div className={`${active ? '' : 'opacity-30'}`}>
        <C_Stack className={`gap-0.5`}>
          <Wrapper className={` !bg-transparent `}>
            <Basics
              {...{
                GenbaDayBasicEditor_HK,
                pathname,
                GenbaDayTaskMidTable,
                GenbaDay,
                editable,
              }}
            />
          </Wrapper>

          <Wrapper className={` !bg-transparent`}>
            <Sub {...{records, GenbaDay, editable, commonProps, PC}} />
          </Wrapper>
        </C_Stack>
      </div>
    </div>
  )
}

export default GenbaDaySummary

export type genbaScheduleStatusString = '完了' | '不要' | '済' | '未完了'
