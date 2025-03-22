'use client'
import {Days, formatDate, getMidnight, toUtc} from '@class/Days'
import {Button} from '@components/styles/common-components/Button'

import {ColoredText} from '@components/styles/common-components/colors'
import {Absolute, C_Stack, FitMargin, Padding, R_Stack} from '@components/styles/common-components/common-components'

import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import {HOLIDAY_TYPE_LIST} from '@constants/holidayTypes'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {Calendar, Prisma} from '@prisma/client'
import React from 'react'

export default function CalendarCC() {
  const {query} = useGlobal()

  const month = toUtc(query.from ?? getMidnight())

  return (
    <Padding>
      <FitMargin className={`pt-4`}>
        <NewDateSwitcher {...{monthOnly: true}} />
      </FitMargin>
      <R_Stack>
        <MonthlyCalendar {...{dayInMonth: month}} />
      </R_Stack>
    </Padding>
  )
}

const MonthlyCalendar = ({dayInMonth}) => {
  const {toggleLoad} = useGlobal()
  const monthStr = formatDate(dayInMonth, 'YYYY/MM')
  const month = Days.getMonthDatum(dayInMonth)

  const weeks = month.getWeeks(`月`, {showPrevAndNextMonth: true})

  const {data: calendarRecordList, mutate} = usefetchUniversalAPI_SWR(`calendar`, `findMany`, {
    where: {
      date: {gte: month.firstDayOfMonth, lte: month.lastDayOfMonth},
    },
  })

  if (!calendarRecordList) return <PlaceHolder />

  const allDayFoundInDB = month.days.every(date => {
    const calendarRecord = calendarRecordList?.find(d => Days.isSameDate(d.date, date))
    if (calendarRecord) {
      return true
    }
    return false
  })

  if (!allDayFoundInDB) {
    return (
      <Absolute>
        <Button
          size="lg"
          onClick={async () => {
            toggleLoad(
              async () => {
                await fetchTransactionAPI({
                  transactionQueryList: month.days.map(date => {
                    const calendarRecord = calendarRecordList.find(d => Days.isSameDate(d.date, date))
                    return {
                      model: `calendar`,
                      method: `upsert`,
                      queryObject: {
                        where: {id: calendarRecord?.id ?? 0},
                        create: {date: date},
                        update: {date: date},
                      } as Prisma.CalendarUpsertArgs,
                    }
                  }),
                })
              },
              {refresh: false, mutate: true}
            )
          }}
        >
          カレンダーデータを作成
        </Button>
      </Absolute>
    )
  }

  return (
    <div className={`mx-auto w-fit`}>
      <strong>{monthStr}</strong>
      <hr />
      <TableWrapper>
        <TableBordered>
          <thead>
            <tr>
              {weeks[0].map((day, idx) => {
                const dayStr = formatDate(day, 'ddd')

                return (
                  <th key={idx} className={`text-center`}>
                    {dayStr}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIdx) => {
              return (
                <tr key={weekIdx}>
                  {week.map((date, dayIdx) => {
                    const dayStr = formatDate(date, 'D(ddd)')
                    const onThisMonth = formatDate(date, 'MM') === formatDate(dayInMonth, 'MM')
                    const calendarRecord = calendarRecordList.find(d => Days.isSameDate(d.date, date)) as Calendar

                    if (onThisMonth) {
                      const isToday = Days.isSameDate(date, new Date())
                      const tdStyle = isToday ? {background: `yellow`} : Days.isHoliday(date)?.style
                      return (
                        <td key={dayIdx} style={tdStyle}>
                          <div className={`h-[100px] w-[80px] text-sm `}>
                            <div className={`text-right font-bold`}>{dayStr}</div>
                            <HolidayConfigCheckbox {...{date, mutate, calendarRecord, daysInMonth: month.days}} />
                          </div>
                        </td>
                      )
                    } else {
                      return (
                        <td key={dayIdx} className={`text-gray-300`}>
                          <div className={`h-[100px] w-[80px] text-sm `}></div>
                        </td>
                      )
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </TableBordered>
      </TableWrapper>
    </div>
  )
}

const HolidayConfigCheckbox = (props: {daysInMonth: Days[]; calendarRecord?: Calendar; date: Date; mutate: any}) => {
  const {daysInMonth, calendarRecord, date, mutate} = props ?? {}

  return (
    <C_Stack className={` items-center gap-0.5`}>
      {HOLIDAY_TYPE_LIST.map((h, index) => {
        const {value, color} = h

        const active = calendarRecord?.[`holidayType`] === value

        return (
          <div key={index}>
            <ColoredText
              {...{
                onClick: async () => {
                  await fetchUniversalAPI(`calendar`, `update`, {
                    where: {id: calendarRecord?.id ?? 0},
                    data: {holidayType: value},
                  })
                  mutate()
                },
                className: `cursor-pointer !p-0.5 !text-xs !px-1.5`,
                bgColor: active ? color : '',
              }}
            >
              {h.value}
            </ColoredText>
          </div>
        )
      })}
    </C_Stack>
  )
}
