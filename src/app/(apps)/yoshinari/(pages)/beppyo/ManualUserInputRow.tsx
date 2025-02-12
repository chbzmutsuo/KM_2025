'use client'

import MnualUserInput from '@app/(apps)/yoshinari/(pages)/beppyo/MnualUserInput'
import {csvTableRow} from '@components/styles/common-components/CsvTable/CsvTable'
import {YsManualUserRow} from '@prisma/client'
import React from 'react'

export default function ManualUserInputRow(props: {data: YsManualUserRow; month; totalDayCount: number}) {
  const {data, month, totalDayCount} = props
  const row: csvTableRow = {
    csvTableRow: [
      {
        cellValueRaw: data[`code`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'code', type: 'string', data, month, style: {width: 120}}} />,
      },
      {
        cellValueRaw: data[`name`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'name', type: 'string', data, month, style: {width: 160}}} />,
      },
      {
        cellValueRaw: data[`prescribedWorkingDays`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'prescribedWorkingDays', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`workingDays`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'workingDays', type: 'number', data, month}} />,
      },

      {
        cellValueRaw: data[`furikyu`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'furikyu', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`absentDays`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'absentDays', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`prescribedHolidays`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'prescribedHolidays', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`Sum_payedLeaveUsed`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'Sum_payedLeaveUsed', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`totalRemainingMinutes`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'totalRemainingMinutes', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`holidayWorkDays_legal`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'holidayWorkDays_legal', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`holidayWorkDays_illegal`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'holidayWorkDays_illegal', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`privateCarUsageKm`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'privateCarUsageKm', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`overTime`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'overTime', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`chikoku`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'overTime', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`soutai`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'overTime', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: data[`gaishutsu`] ?? '-',
        cellValue: <MnualUserInput {...{id: 'overTime', type: 'number', data, month}} />,
      },
      {
        cellValueRaw: totalDayCount,
        cellValue: totalDayCount,
      },
    ],
  }

  return row
}
