import {getMONTH_AGG} from '@app/(apps)/yoshinari/(models)/YoshinariUser/getMONTH_AGG'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

import {Calc} from '@class/Calc'
import {TimeClass} from '@class/TimeClass'
import {bodyRecordsType} from '@components/styles/common-components/CsvTable/CsvTable'

export const getMonthlySummaryRecordsOrigin = (props: {yoshinariUserCl: YoshinariUserClass; days; rules}) => {
  const {yoshinariUserCl, days, rules} = props
  const workMinsPerDay = rules.workMins

  const {MONTH_AGG} = getMONTH_AGG({workMinsPerDay, yoshinariUserCl, days})

  //時間で計算する必要のある項目
  // 有給がない日は、所定時間を分単位で計算
  // 有給がある日は、所定時間 - 有給時間とし、分単位で計算
  // 振休みがない場合は、 所定時間を分単位で計算
  // 振休がある場合は、所定時間 - 振休時間とし、分単位で計算
  // 振出がある場合は、振りで時間として分単位計算

  const headerGroup1 = [`所定労働\n(日)`, `所定休日\n(日)`, `合計\n(日)`]
  const headerGroup2 = [`出勤\n(日)`, `休日\n(日)`, `特別休暇\n(日)`, `欠勤日数\n(日)`]
  const headerGroup3 = [`有給消費\n（日）`, `有給消費\n（時間）`, `有給残\n（累計/日）`]
  const headerGroup4 = [`振休\n(時間)`, `休日出勤\n(法定)\n(時間)`, `休日出勤\n(法定外)\n(時間)`, `振休残\n(時間)`]
  const headerGroup5 = [`km`]

  const headerRecords: bodyRecordsType = [
    {
      csvTableRow: [
        //
        {cellValue: `基本情報`, colSpan: headerGroup1.length},
        {cellValue: `出勤情報`, colSpan: headerGroup2.length},
        {cellValue: `有給情報`, colSpan: headerGroup3.length},
        {cellValue: `振休情報`, colSpan: headerGroup4.length},
        {cellValue: `私有車`, colSpan: headerGroup5.length},
      ],
    },
    {
      csvTableRow: [
        ...headerGroup1.map(d => ({
          cellValue: d,
          style: {
            minWidth: 75,
            textAlign: `center`,
          },
        })),
        ...headerGroup2.map(d => ({
          cellValue: d,
          style: {
            minWidth: 75,
            textAlign: `center`,
          },
        })),
        ...headerGroup3.map(d => ({
          cellValue: d,
          style: {
            minWidth: 75,
            textAlign: `center`,
          },
        })),
        ...headerGroup4.map(d => ({
          cellValue: d,
          style: {
            minWidth: 75,
            textAlign: `center`,
          },
        })),
        ...headerGroup5.map(d => ({
          cellValue: d,
          style: {
            minWidth: 75,
            textAlign: `center`,
          },
        })),
      ].map((d: any) => ({...d, style: {...d?.style, fontSize: 14}})),
    },
  ]

  const workRecords = [
    //
    MONTH_AGG[`prescribedWorkingDays`].count,
    MONTH_AGG[`prescribedHolidays`].count,
    MONTH_AGG[`prescribedWorkingDays`].count + MONTH_AGG[`prescribedHolidays`].count,
    MONTH_AGG[`workingDays`].count,
    MONTH_AGG[`holidayDays`].count,
    MONTH_AGG[`specialLeave`].count,
    MONTH_AGG[`absentDays`].count,
  ].map(d => ({cellValue: Calc.round(d / workMinsPerDay)}))

  const dayYukyuMins = MONTH_AGG[`payedLeaveUsed_day`]?.count
  const hourYukyuMins = MONTH_AGG[`payedLeaveUsed_hour`]?.count

  const workHours = rules?.workMins / 60

  const yukyuRecords = [
    TimeClass.convertMin({mins: dayYukyuMins, hourDivideNum: workHours}).day,
    TimeClass.minutesToHourTimeString(hourYukyuMins),
    TimeClass.convertMin({mins: yoshinariUserCl?.yukyuAgg?.totalRemainingMinutes, hourDivideNum: workHours}).day,
  ].map(d => {
    const cellValue = typeof d === `number` ? Calc.round(d, 1) : d
    const style = typeof d === `number` && d < 0 ? {background: `red`, color: `white`} : {}

    return {
      style,
      cellValue,
      className: `text-end`,
      // cellValue: Calc.round(d, 1),
    }
  })

  // const furide = MONTH_AGG[`furide`]?.count

  const holidayWorkDays_legal = MONTH_AGG[`holidayWorkDays_legal`]?.count
  const holidayWorkDays_illegal = MONTH_AGG[`holidayWorkDays_illegal`]?.count
  const furikyu = MONTH_AGG[`furikyu`]?.count

  const furikyuRemain = holidayWorkDays_legal + holidayWorkDays_illegal - furikyu

  const furikyuRecords = [furikyu, holidayWorkDays_legal, holidayWorkDays_illegal, furikyuRemain].map(d => {
    const style = d < 0 ? {background: `red`, color: `white`} : {}
    return {
      style,
      cellValue: TimeClass.minutesToHourTimeString(d),
      className: `text-end`,
      // Calc.round(d, 1),
    }
  })

  const privateCarRecords = [
    //
    MONTH_AGG[`privateCarUsageKm`]?.count,
  ].map(d => ({cellValue: d}))

  const bodyRecords: bodyRecordsType = [
    {
      csvTableRow: [
        //
        ...workRecords,
        ...yukyuRecords,
        ...furikyuRecords,
        ...privateCarRecords,
      ],
    },
  ]

  return {MONTH_AGG, headerRecords, bodyRecords}
}
