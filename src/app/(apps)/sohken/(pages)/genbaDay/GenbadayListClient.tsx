'use client'
//classを切り替える

import {formatDate} from '@class/Days'
import GenbaDaySummary from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/GenbaDaySummary'
import {C_Stack, Circle, FitMargin, Padding, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'

import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import {useGenbaDayBasicEditor} from '@app/(apps)/sohken/hooks/useGenbaDayBasicEditor'
import React from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function GenbadayListClient({today, tomorrow, todayRecords, tomorrowRecords, isMyPage, allShiftBetweenDays}) {
  const GenbaDayBasicEditor_HK = useGenbaDayBasicEditor()
  const {session} = useGlobal()

  const Today = () => {
    return (
      <C_Stack className={` min-w-[500px] max-w-[95vw]   items-center`}>
        <strong>{formatDate(today)}</strong>
        <C_Stack className={` gap-8    p-2`}>
          {todayRecords.map((GenbaDay, i) => {
            const shift = GenbaDay.GenbaDayShift
            const isMyShift = isMyPage && shift?.some(s => s.userId === session?.id)
            const bgColor = isMyShift ? 'rgba(244, 232, 190, 0.664)' : ''

            return (
              <div key={GenbaDay.id}>
                <Paper className={` p-2.5`} {...{style: {background: bgColor, color: 'black'}}}>
                  <R_Stack>
                    <Circle {...{width: 24}}>{i + 1}</Circle>
                    <GenbaDaySummary
                      {...{
                        GenbaDayBasicEditor_HK,
                        allShiftBetweenDays,
                        records: todayRecords,
                        GenbaDay,
                        editable: !isMyPage,
                      }}
                    />
                  </R_Stack>
                </Paper>
              </div>
            )
          })}
        </C_Stack>
      </C_Stack>
    )
  }

  const Tomorrow = () => {
    return (
      <C_Stack className={` min-w-[500px] max-w-[95vw]   items-center`}>
        <strong>{formatDate(tomorrow)}</strong>
        <C_Stack className={` gap-8 p-2`}>
          {tomorrowRecords.map((GenbaDay, i) => {
            return (
              <div key={GenbaDay.id}>
                <Paper className={` p-2.5`}>
                  <R_Stack>
                    <Circle {...{width: 24}}>{i + 1}</Circle>
                    <GenbaDaySummary
                      {...{
                        GenbaDayBasicEditor_HK,
                        allShiftBetweenDays,
                        records: tomorrowRecords,
                        GenbaDay,
                        editable: !isMyPage,
                      }}
                    />
                  </R_Stack>
                </Paper>
              </div>
            )
          })}
        </C_Stack>
      </C_Stack>
    )
  }

  if (isMyPage) {
    return (
      <Padding>
        <FitMargin>
          <C_Stack>
            <NewDateSwitcher {...{}} />
            <Today />
          </C_Stack>
        </FitMargin>
      </Padding>
    )
  }
  return (
    <Padding>
      <C_Stack>
        <NewDateSwitcher {...{}} />

        <R_Stack className={` mx-auto w-full  max-w-[1500px]  items-start  justify-center   gap-10   lg:justify-end`}>
          <Today />
          <Tomorrow />
        </R_Stack>
      </C_Stack>
    </Padding>
  )
}
