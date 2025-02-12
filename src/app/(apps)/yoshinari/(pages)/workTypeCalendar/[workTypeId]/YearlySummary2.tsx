'use client'
import {Calc} from '@class/Calc'
import {TimeClass} from '@class/TimeClass'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {WorkType} from '@prisma/client'

import { getDaysInYear, getISOWeeksInYear} from 'date-fns'
import React from 'react'

export const YearlySummary2 = (props: {start; end; WorkType: WorkType; calendarDataObject; theDate}) => {
  const {WorkType, calendarDataObject, theDate, start, end} = props
  const {hour: workHourOnDate} = TimeClass.convertMin({mins: WorkType.workMins, hourDivideNum: 60})

  const {holidayList, selectedholidayList, recommendedPaidholidayList} = calendarDataObject.yearly
  const daysInYear = getDaysInYear(theDate)
  const holidayCount = holidayList.length + selectedholidayList.length
  const yearlyWorkDays = daysInYear - holidayCount
  const weeksOnYear = getISOWeeksInYear(theDate)
  const workHours = TimeClass.convertMin({mins: WorkType.workMins, hourDivideNum: 60}).hour
  const yearlyWorkHours = workHours * yearlyWorkDays
  const weeksInYear = getISOWeeksInYear(theDate)
  const weeklHorkHous = ((yearlyWorkDays * workHours) / 365) * 7

  return (
    <>
      <TableWrapper className={`w-fit`}>
        <TableBordered>
          {CsvTable({
            SP: true,
            headerRecords: [
              {
                csvTableRow: [
                  //
                  {cellValue: `所定労働時間`},
                  {cellValue: `年間労働日数`},
                  {cellValue: `年間労働時間`},
                  {cellValue: `月平均所定労働日数`},
                  {cellValue: `月平均労働時間`},
                  {cellValue: `週平均労働時間`},
                ],
              },
              {
                csvTableRow: [
                  //
                  {cellValue: workHours},
                  {cellValue: yearlyWorkDays},
                  {cellValue: yearlyWorkHours},
                  {cellValue: yearlyWorkDays / 12},
                  {cellValue: yearlyWorkHours / 12},
                  {cellValue: weeklHorkHous},
                ].map(d => {
                  return {
                    ...d,
                    cellValue: Calc.round(d.cellValue, 2),
                  }
                }),
              },
            ],
            bodyRecords: [],
          }).ALL()}
        </TableBordered>
      </TableWrapper>
    </>
  )
}
// return (
//   <>
//     <TableWrapper className={`w-fit`}>
//       <TableBordered>
//         {CsvTable({
//           SP: true,
//           headerRecords: [
//             {
//               csvTableRow: [
//                 //
//                 {cellValue: `平均所定労働時間`},
//                 {cellValue: `年間労働時間`},
//                 {cellValue: `週平均労働時間`},
//               ],
//             },
//             {csvTableRow: [{cellValue: workHourOnDate}, {cellValue: yearlyWorkHours}, {cellValue: weeklyWorkHours}]},
//           ],
//           bodyRecords: [],
//         }).ALL()}
//       </TableBordered>
//     </TableWrapper>
//   </>
// )
