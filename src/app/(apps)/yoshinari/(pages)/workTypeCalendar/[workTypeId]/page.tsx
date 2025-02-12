import {Days, getNextMonthLastDate, toUtc} from '@class/Days'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {YsCalendarHoliday} from '@prisma/client'

import React from 'react'

import WorkTypeCalendarCC from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/WorkTypeCalendarCC'

export type calendarDataOnMonth = {
  allHolidayList: YsCalendarHoliday[]
  holidayList: YsCalendarHoliday[]
  selectedholidayList: YsCalendarHoliday[]
  // recommendedPaidholidayList: YsCalendarHoliday[]
}
export type calendarDataObject = {
  [key: string]: calendarDataOnMonth
}

export async function generateMetadata(props) {
  const query = await props.searchParams;
  const params = await props.params;
  const theDate = query.from ? toUtc(query.from) : toUtc(new Date())
  const start = getNextMonthLastDate(theDate, 0)
  const end = getNextMonthLastDate(start, 12)
  const whereQuery = {
    gte: new Date(start.getFullYear(), start.getMonth() - 1, 26),
    lt: end,
  }

  const {result: WorkType} = await fetchUniversalAPI(`workType`, `findUnique`, {
    where: {id: Number(params.workTypeId)},
    include: {YsCalendarHoliday: {where: {date: whereQuery}}},
  })

  return {
    title: `休日カレンダー/${WorkType?.name}/${theDate.getFullYear()}年`,
  }
}

export default async function Page(props) {
  const query = await props.searchParams;
  const params = await props.params;
  const theDate = query.from ? toUtc(query.from) : toUtc(new Date())
  const start = getNextMonthLastDate(theDate, 0)
  const end = getNextMonthLastDate(start, 12)
  const redirectPath = query.from ? undefined : `?from=${new Date().getFullYear()}`

  if (redirectPath) {
    return <Redirector {...{redirectPath}} />
  }

  const whereQuery = {
    gte: new Date(start.getFullYear(), start.getMonth() - 1, 26),
    lt: end,
  }

  const monthsOnYear = Days.getMonthsBetweenDates(start, getNextMonthLastDate(start, 11))
  const {result: WorkType} = await fetchUniversalAPI(`workType`, `findUnique`, {
    where: {id: Number(params.workTypeId)},
    include: {YsCalendarHoliday: {where: {date: whereQuery}}},
  })

  const {YsCalendarHoliday} = WorkType

  return (
    <>
      <WorkTypeCalendarCC {...{WorkType, YsCalendarHoliday, monthsOnYear, theDate, start, end}} />
    </>
  )
}
