'use client'
import {calendarDataObject} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/page'

import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {Arr} from '@class/Arr'
import {formatDate} from '@class/Days'
import {R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'

import React, {Fragment} from 'react'

export const HolidaysByMonth = ({
  calendarDataObject,
  monthsOnYear,
}: {
  calendarDataObject: calendarDataObject
  monthsOnYear: Date[]
}) => {
  const months = [...monthsOnYear]

  const groups = Arr.SplitInto_N_Group(months, 6)

  const holidayTypeMasters = CalendarHolidayClass.holidayTypes.filter(type => type.asHoliday)
  return (
    <R_Stack className={` items-start`}>
      {groups.map((months, idx) => {
        return (
          <Fragment key={idx}>
            <TableWrapper>
              <TableBordered>
                {CsvTable({
                  SP: true,
                  headerRecords: [
                    {
                      csvTableRow: [
                        {cellValue: `月`, className: `text-sm text-center`},
                        ...months.map((month, idx) => {
                          const str = formatDate(month, `YYYY/MM`)
                          return {cellValue: str}
                        }),
                      ],
                    },
                    {
                      csvTableRow: [
                        {cellValue: `公休`, className: `text-sm text-center`},
                        ...months.map((month, idx) => {
                          const str = formatDate(month, `YYYY/MM`)
                          const theDataOnMonth = calendarDataObject[str]
                          const {id, label, color} = holidayTypeMasters[0]
                          const value = theDataOnMonth?.[id]?.length

                          return {cellValue: value, style: {color: color, fontWeight: 900}}
                        }),
                      ],
                    },
                    {
                      csvTableRow: [
                        {cellValue: `選択公休`, className: `text-sm text-center`},
                        ...months.map((month, idx) => {
                          const str = formatDate(month, `YYYY/MM`)
                          const theDataOnMonth = calendarDataObject[str]
                          const {id, label, color} = holidayTypeMasters[1]
                          const value = theDataOnMonth?.[id]?.length

                          return {cellValue: value, style: {color: color, fontWeight: 900}}
                        }),
                      ],
                    },
                  ].map(d => {
                    return {
                      ...d,

                      csvTableRow: d.csvTableRow.map(d => {
                        return {
                          ...d,
                          style: {
                            ...d.style,
                            width: 60,
                          },
                        }
                      }),
                    }
                  }),
                  bodyRecords: [],
                }).ALL()}
              </TableBordered>
            </TableWrapper>
          </Fragment>
        )
      })}
    </R_Stack>
  )
}
