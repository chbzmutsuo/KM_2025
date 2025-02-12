import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

export type MonthlySummaryItemKey =
  | `prescribedWorkingDays`
  | `prescribedHolidays`
  | `paidLeave`
  | `workingDays`
  | `holidayDays`
  | `holidayWorkDays_legal`
  | `holidayWorkDays_illegal`
  | `specialLeave`
  | `absentDays`
  | `total`
  | `payedLeaveUsed_hour`
  | `payedLeaveUsed_day`
  | `Sum_payedLeaveUsed`
  | `furikyu`
  | `furide`
  | `substituteHoliday_legal`
  | `substituteHoliday_illegal`
  | `privateCarUsageKm`
  | 'chikoku'
  | 'soutai'
  | 'gaishutsu'
  | 'normalOverTime'
  | 'lateOverTime'

export const getMONTH_AGG = (props: {workMinsPerDay; yoshinariUserCl: YoshinariUserClass; days}) => {
  const {workMinsPerDay, yoshinariUserCl, days} = props

  const {holidays, workDays} = yoshinariUserCl.getCalendarInDays({days})

  const MONTH_AGG: {
    [key in MonthlySummaryItemKey]: {count: number; label: string}
  } = {
    prescribedWorkingDays: {label: `所定労働日`, count: workDays.length * workMinsPerDay},
    prescribedHolidays: {label: `所定休日`, count: holidays.length * workMinsPerDay},
    paidLeave: {label: `有休`, count: 0},
    //合計
    workingDays: {label: `出勤日`, count: 0},
    holidayDays: {label: `休日`, count: 0},
    holidayWorkDays_legal: {label: `休日出勤(法定)`, count: 0},
    holidayWorkDays_illegal: {label: `休日出勤(法定外)`, count: 0},
    specialLeave: {label: `特別休暇`, count: 0},
    absentDays: {label: `欠勤`, count: 0},
    total: {label: `合計`, count: 0},
    payedLeaveUsed_day: {label: `有給（日）消費`, count: 0},
    payedLeaveUsed_hour: {label: `有給（時間）消費`, count: 0},
    Sum_payedLeaveUsed: {label: `有給合計`, count: 0},
    furikyu: {label: `振休取得`, count: 0},
    furide: {label: `振出`, count: 0},
    substituteHoliday_legal: {label: `休日出勤残(法定)`, count: 0},
    substituteHoliday_illegal: {label: `休日出勤残(法定外)`, count: 0},

    privateCarUsageKm: {label: `私有車(km)`, count: 0},
    chikoku: {label: `遅刻`, count: 0},
    soutai: {label: `早退`, count: 0},
    gaishutsu: {label: `外出`, count: 0},
    normalOverTime: {label: `通常残業`, count: 0},
    lateOverTime: {label: `深夜残業`, count: 0},
  }

  //時間で計算する必要のある項目
  // 有給がない日は、所定時間を分単位で計算
  // 有給がある日は、所定時間 - 有給時間とし、分単位で計算
  // 振休みがない場合は、 所定時間を分単位で計算
  // 振休がある場合は、所定時間 - 振休時間とし、分単位で計算
  // 振出がある場合は、振りで時間として分単位計算

  //カウントアップ
  yoshinariUserCl.workRecordsByDate.forEach(day => {
    const {date, furikyu, isLegalHoliday, furide, yukyu, kyujitsuShukkin, shanaitairyuMins, OverTime} = day

    const {privateCarUsageRequestList} = day.ApprovedApRequests

    // 私有車使用
    privateCarUsageRequestList?.forEach(data => {
      const km = data.cf[`走行距離(km)`].value ?? 0
      MONTH_AGG[`privateCarUsageKm`].count += km
    })

    if (OverTime.normal.mins) {
      MONTH_AGG[`normalOverTime`].count += OverTime.normal.mins
    }
    if (OverTime.lateNight22To24.mins || OverTime.lateNight24To5.mins) {
      MONTH_AGG[`lateOverTime`].count += OverTime.lateNight22To24.mins + OverTime.lateNight24To5.mins
    }

    if (kyujitsuShukkin) {
      if (isLegalHoliday) {
        MONTH_AGG[`holidayWorkDays_legal`].count += 1 * shanaitairyuMins
      } else {
        MONTH_AGG[`holidayWorkDays_illegal`].count += 1 * shanaitairyuMins
      }
    }

    if (day.workingType == `休日(法定)` || day.workingType == `休日(法定外)`) {
      MONTH_AGG[`holidayDays`].count += 1 * workMinsPerDay
    } else {
      if ([`出勤`, `休日出勤(法定)`, `休日出勤(法定外)`].includes(day.workingType)) {
        MONTH_AGG[`workingDays`].count += 1 * workMinsPerDay
      }

      if (day.workingType === '有給休暇（1日休）') {
        MONTH_AGG[`payedLeaveUsed_day`].count += 1 * workMinsPerDay
        MONTH_AGG[`Sum_payedLeaveUsed`].count += 1 * workMinsPerDay
      }

      if (day.workingType === '有給（時間給）') {
        MONTH_AGG[`payedLeaveUsed_hour`].count += yukyu.mins
        MONTH_AGG[`Sum_payedLeaveUsed`].count += yukyu.mins
      }

      if (day.workingType === '特別休暇') {
        MONTH_AGG[`specialLeave`].count += 1 * workMinsPerDay
      }

      if (day.workingType === `欠勤`) {
        MONTH_AGG[`absentDays`].count += 1 * workMinsPerDay
      }
    }

    if (day.workingType === '振替休日') {
      MONTH_AGG[`furikyu`].count += furikyu.mins
    }

    if (day.chikoku) {
      MONTH_AGG[`chikoku`].count += day.chikoku.mins
    }
    if (day.soutai) {
      MONTH_AGG[`soutai`].count += day.soutai.mins
    }

    if (day.gaishutsu) {
      MONTH_AGG[`gaishutsu`].count += day.gaishutsu.mins
    }
  })

  return {MONTH_AGG}
}
