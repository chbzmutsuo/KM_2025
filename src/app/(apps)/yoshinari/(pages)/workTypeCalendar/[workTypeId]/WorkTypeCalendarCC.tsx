'use client'
import CalendarCC from '@app/(apps)/yoshinari/(parts)/calendar/CalendarCC/CalendarCC'

import {YearlySummary} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/YearlySummary'
import {HolidaysByMonth} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/HolidaysByMonth'
import {YearlySummary2} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/YearlySummary2'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import {Paper} from '@components/styles/common-components/paper'

import React from 'react'
import {monthDatumOptions} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import {calendarDataObject} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/page'
import {Days, formatDate, toUtc} from '@class/Days'
import {YsCalendarHoliday} from '@prisma/client'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {HREF} from '@lib/methods/urls'
import {Fields} from '@class/Fields/Fields'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {useParams} from 'next/navigation'

export default function WorkTypeCalendarCC({WorkType, YsCalendarHoliday, monthsOnYear, theDate, start, end}) {
  const calendarDataObject: calendarDataObject = {
    yearly: {
      allHolidayList: YsCalendarHoliday,
      holidayList: YsCalendarHoliday.filter(d => d.type === `公休日`),
      selectedholidayList: YsCalendarHoliday.filter(d => d.type === `選択公休日`),
      // recommendedPaidholidayList: YsCalendarHoliday.filter(d => d.type === `有給推奨日`),
    },
    ...Object.fromEntries(
      monthsOnYear.map(month => {
        const {firstDayOfMonth, lastDayOfMonth} = Days.getMonthDatum(month, monthDatumOptions)
        const key = formatDate(month, `YYYY/MM`)

        const theDataOnMonth: YsCalendarHoliday[] = WorkType.YsCalendarHoliday.filter(d => {
          return d.date >= firstDayOfMonth && d.date <= lastDayOfMonth
        })

        const data = {
          allHolidayList: theDataOnMonth,
          holidayList: theDataOnMonth.filter(d => d.type === `公休日`),
          selectedholidayList: theDataOnMonth.filter(d => d.type === `選択公休日`),
          // recommendedPaidholidayList: theDataOnMonth.filter(d => d.type === `有給推奨日`),
        }

        return [key, data]
      })
    ),
  }
  // const {data} = usefetchUniversalAPI_SWR(`ysCalendarHoliday`, `findMany`, {})

  return (
    <div className={`print-target `}>
      <div className={`mx-auto p-4`}>
        <C_Stack className={` gap-6`}>
          <section>{/* <strong>{WorkType.name}</strong> */}</section>

          <section>
            <R_Stack className={` items-start justify-center gap-10`}>
              <Paper>
                <Selector {...{workType: WorkType}} />
              </Paper>
              <R_Stack className={` items-stretch justify-center`}>
                <Paper>
                  <HolidaysByMonth {...{calendarDataObject, monthsOnYear}} />
                </Paper>
                <Paper>
                  <YearlySummary {...{calendarDataObject, theDate}} />
                </Paper>
                <Paper>
                  <YearlySummary2 {...{WorkType, calendarDataObject, theDate, start, end}} />
                </Paper>
              </R_Stack>
            </R_Stack>
          </section>

          <section>
            <CalendarCC
              {...{
                start,
                end,
                monthsOnYear,
                calendarDataObject,
                workType: WorkType,
              }}
            />
          </section>
        </C_Stack>
      </div>
    </div>
  )
}

const Selector = ({workType}) => {
  const {query, router} = useGlobal()
  const params = useParams()
  const formData = {
    year: query.from ? toUtc(query.from) : toUtc(new Date()),
    workTypeId: Number(params && params.workTypeId),
  }
  const {BasicForm} = useBasicFormProps({
    onFormItemBlur: props => {
      const {year, workTypeId} = props.newlatestFormData

      const yearStr = new Date(year).getFullYear()

      const newHref = HREF(`/yoshinari/workTypeCalendar/${workTypeId}`, {from: yearStr}, query)

      router.push(newHref)
    },
    formData,
    columns: new Fields([
      {
        id: `workTypeId`,
        label: `勤務タイプ`,
        forSelect: {},
        form: {
          style: {width: 400, fontSize: 20, fontWeight: `bold`},
          defaultValue: workType.id,
        },
      },
      {
        id: `year`,
        label: `年`,
        type: `year`,
        form: {
          style: {width: 400, fontSize: 20, fontWeight: `bold`},
        },
      },
    ]).transposeColumns(),
  })

  return (
    <>
      <BasicForm {...{alignMode: `col`}} />
    </>
  )
}
