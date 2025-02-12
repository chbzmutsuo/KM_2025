'use client'

import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {ColoredText} from '@components/styles/common-components/colors'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'

import {getDaysInYear} from 'date-fns'
import React from 'react'
export const YearlySummary = ({calendarDataObject, theDate}) => {
  const {holidayList, selectedholidayList, recommendedPaidholidayList} = calendarDataObject.yearly

  const holidayCount = holidayList.length + selectedholidayList.length
  const daysInYear = getDaysInYear(theDate)

  return (
    <>
      <TableWrapper className={`w-fit`}>
        <TableBordered>
          {CsvTable({
            SP: true,
            headerRecords: [
              {
                csvTableRow: [
                  {cellValue: getColoredTextByString(`公休日`, `公休日`)},
                  {cellValue: getColoredTextByString(`選択公休日`, `選択公休日`)},
                  {cellValue: `年間休日日数`},
                  // {cellValue: getColoredTextByString(`有給推奨日`, `有給推奨日`)},
                  {cellValue: `総歴日数`},
                  {cellValue: `年間労働日数`},
                ],
              },
            ],
            bodyRecords: [
              {
                csvTableRow: [
                  {cellValue: holidayList.length},
                  {cellValue: selectedholidayList.length},
                  {cellValue: holidayCount},
                  // {cellValue: recommendedPaidholidayList.length},
                  {cellValue: daysInYear},
                  {cellValue: daysInYear - holidayCount},
                ],
              },
            ],
          }).ALL()}
        </TableBordered>
      </TableWrapper>
    </>
  )
}

export const getColoredTextByString = (str = `公休日`, value) => {
  const master = CalendarHolidayClass.holidayTypes.find(d => d.label === str)
  if (master) {
    return <ColoredText bgColor={master.color}>{value}</ColoredText>
  }
}
