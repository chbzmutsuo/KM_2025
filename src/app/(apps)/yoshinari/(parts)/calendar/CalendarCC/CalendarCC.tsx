'use client'
import {calendarDataObject} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/page'
import {MonthlyCalendar} from '@app/(apps)/yoshinari/(parts)/calendar/CalendarCC/MonthlyCalendar'
import {formatDate} from '@class/Days'

import { R_Stack} from '@components/styles/common-components/common-components'

import useGlobal from '@hooks/globalHooks/useGlobal'
import {useParams} from 'next/navigation'

import React, {Fragment} from 'react'

export default function CalendarCC(props: {workType; monthsOnYear; calendarDataObject: calendarDataObject}) {
  const {workType, monthsOnYear, calendarDataObject} = props
  const {query, router} = useGlobal()
  const params = useParams()
  return (
    <div>
      <div>
        <R_Stack className={` items-stretch  justify-around  gap-x-0 gap-y-[30px]`}>
          {monthsOnYear.map((month, idx) => {
            // if (idx > 0) return <></>
            const calendarDataOnMonth = calendarDataObject[formatDate(month, `YYYY/MM`)]
            return (
              <Fragment key={idx}>
                <div className={`max-w-1/3 p-2`}>
                  <section>
                    <MonthlyCalendar {...{calendarDataOnMonth, dayInMonth: month, workType: workType}} />
                  </section>
                </div>
              </Fragment>
            )
          })}
        </R_Stack>
      </div>
    </div>
  )
}
