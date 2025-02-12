'use client'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'

import {formatDate} from '@class/Days'
import {TimeClass} from '@class/TimeClass'

import {bodyRecordsType} from '@components/styles/common-components/CsvTable/CsvTable'
import {getColorStyles} from '@lib/methods/common'

export const getKintaiTableRecordsOrigin = (props: {yoshinariUser: YoshinariUserClass}) => {
  const {yoshinariUser} = props
  if (yoshinariUser === undefined) {
    throw new Error(`workRecordsByDate がありません。mpaYsWorkRecordを実行してください。`)
  }
  const headerRecords: bodyRecordsType = [
    {
      csvTableRow: [
        {
          cellValue: `日付`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `区分`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `出社`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `退社`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `休憩`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `社内滞留\n(始業~退社)\n(除休憩)`,
          style: {minWidth: 100, textAlign: `center`},
        },
        {
          cellValue: `時間外\n（通常）`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `時間外\n（深夜）`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `振出・振休時間`,
          style: {textAlign: `center`},
        },
        {
          cellValue: `備考`,
          style: {textAlign: `center`},
        },
      ],
    },
  ]

  const {workRecordsByDate} = yoshinariUser

  const bodyRecords: bodyRecordsType = workRecordsByDate.map((d, i) => {
    const {date, workingType, furikyu, CalendarOnDate, shanaitairyuMins} = d

    const {YsWorkRecord, work, OverTime} = d

    const HolidayCl = new CalendarHolidayClass(CalendarOnDate)

    const dateDt = {
      cellValue: (
        <div>
          <span>{formatDate(date, 'MM/D(ddd)')}</span>
          <span>{CalendarOnDate?.remarks}</span>
        </div>
      ),
    }

    const fromDisplayValue = formatDate(YsWorkRecord?.from, 'HH:mm')

    let toDisplayValue = formatDate(YsWorkRecord?.to, 'HH:mm')
    if (YsWorkRecord?.from && YsWorkRecord?.to && YsWorkRecord?.to > YsWorkRecord?.from && toDisplayValue <= fromDisplayValue) {
      toDisplayValue = '翌' + toDisplayValue
    }

    const {overwork, holiday, chikoku, soutai, gaishutsu} = yoshinariUser.getComponents({date})

    const furikaeDisplayHours = furikyu.mins ? TimeClass.minutesToHourTimeString(furikyu.mins) : undefined

    return {
      style: {...getColorStyles(HolidayCl?.attributes?.color ? HolidayCl?.attributes?.color + '50' : '')},
      csvTableRow: [
        dateDt,
        {cellValue: workingType},
        {cellValue: fromDisplayValue},
        {cellValue: toDisplayValue},
        {cellValue: TimeClass.minutesToHourTimeString(YsWorkRecord?.breakTime)},
        {cellValue: shanaitairyuMins && TimeClass.minutesToHourTimeString(shanaitairyuMins)},
        {cellValue: TimeClass.minutesToHourTimeString(OverTime.normal.mins)},
        {cellValue: TimeClass.minutesToHourTimeString(OverTime.lateNight22To24.mins + OverTime.lateNight24To5.mins)},

        {
          cellValue: furikaeDisplayHours,
        },
        {
          cellValue: (
            <>
              {overwork()}
              {holiday()}
              {chikoku()}
              {soutai()}
              {gaishutsu()}
            </>
          ),
        },
      ],
    }
  })
  return {
    headerRecords,
    bodyRecords,
  }
}
