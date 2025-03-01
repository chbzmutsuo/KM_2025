import arrangeApprovedApRequests from '@app/(apps)/yoshinari/(models)/YoshinariUser/arrangeApprovedApRequests'
import arrangeFurikyu from '@app/(apps)/yoshinari/(models)/YoshinariUser/arrangeFurikyu'
import arrangeHoliydayRequest from '@app/(apps)/yoshinari/(models)/YoshinariUser/arrangeHoliydayRequest'
import arrangeOverwork from '@app/(apps)/yoshinari/(models)/YoshinariUser/arrangeOverwork'
import {filterAndMapApRequest} from '@app/(apps)/yoshinari/(models)/YoshinariUser/filterAndMapApRequest'
import initYsRecord from '@app/(apps)/yoshinari/(models)/YoshinariUser/initYsRecord'
import {workingType, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {CHIKOKU_SOUTAI_GAISHUTSU_FIELDS} from '@app/(apps)/yoshinari/constants/chikoku-soutai-gaishutsu'
import {ApRequestClass, MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import {formatDate} from '@class/Days'
import {YsCalendarHoliday} from '@prisma/client'
import {P_YsWorkRecord} from 'scripts/generatedTypes'

export type from_to_min = {
  from?: Date
  to?: Date
  mins: number
}
export type workRecordsByDateType = {
  date: Date
  isLegalHoliday: boolean
  workingType: workingType
  HolidayCl: CalendarHolidayClass
  YsWorkRecord: P_YsWorkRecord
  CalendarOnDate: YsCalendarHoliday
  shanaitairyuMins: number
  ApprovedApRequests: {
    holidayRequest: MappeadApRequest & {name: string; from: Date; to: Date}
    overWorkRequestList: (MappeadApRequest & {from: Date; to: Date})[]
    privateCarUsageRequestList: (MappeadApRequest & {from: Date; to: Date})[]
    tikokuRequestList: (MappeadApRequest & {from: Date; to: Date})[]
    sotaiRequestList: (MappeadApRequest & {from: Date; to: Date})[]
    gaishutsuRequestList: (MappeadApRequest & {from: Date; to: Date})[]
  }

  work: from_to_min
  Break: from_to_min
  OverTime: {
    normal: from_to_min
    lateNight22To24: from_to_min
    lateNight24To5: from_to_min
  }
  chikoku: from_to_min
  soutai: from_to_min
  gaishutsu: from_to_min
  yukyu: from_to_min
  furide: from_to_min
  furikyu: from_to_min

  kyujitsuShukkin: boolean
}

export const mapYsWorkRecordOrigin = (props: {yoshinariUser: YoshinariUserClass; days: Date[]}) => {
  const {yoshinariUser, days} = props
  const logWhen = (...args) => {
    if (yoshinariUser.user.name.includes(`test`)) {
      console.debug(...args)
    }
  }

  if (yoshinariUser.user?.YsWorkRecord === undefined) {
    throw new Error(`YsWorkRecord is not defined`)
  }
  if (yoshinariUser.user?.ApSender === undefined) {
    throw new Error(`ApSender is not defined`)
  }

  //init 承認済みの稟議

  const apRequest = ApRequestClass.filterOnlyApproved(yoshinariUser.user.myApRequest)

  const ApprovedRequestListByGroup = {
    holidayRequest: filterAndMapApRequest({apRequest, yoshinariUser, label: '休暇申請'}),
    overWorkRequestList: filterAndMapApRequest({apRequest, yoshinariUser, label: '時間外勤務'}),
    privateCarUsageRequestList: filterAndMapApRequest({apRequest, yoshinariUser, label: '私有車'}),
    tikokuRequestList: filterAndMapApRequest({apRequest, yoshinariUser, label: '遅刻'}),
    sotaiRequestList: filterAndMapApRequest({apRequest, yoshinariUser, label: '早退'}),
    gaishutsuRequestList: filterAndMapApRequest({apRequest, yoshinariUser, label: '外出'}),
  }

  ///日付ごとにループ
  const workRecordsByDate = days.map(date => {
    const {rules} = YoshinariUserClass.getUserWorkRules({user: yoshinariUser.user, today: date})
    const {isHoliday, from, to, work, Break, kyujitsuShukkin, YsWorkRecord, CalendarOnDate, HolidayCl} = initYsRecord({
      rules,
      yoshinariUser,
      date,
    })

    //======承認済みの稟議を取得======
    const {ApprovedApRequests, chikoku, soutai, gaishutsu} = arrangeApprovedApRequests({
      ApprovedRequestListByGroup,
      CHIKOKU_SOUTAI_GAISHUTSU_FIELDS,
      date,
    })

    const shanaitairyuMins =
      from && to && (work?.mins ?? 0) - ((chikoku?.mins ?? 0) + (soutai?.mins ?? 0) + (gaishutsu?.mins ?? 0))
    // if (formatDate(date) === `2025-02-20`) {
    //   console.debug(work?.mins, shanaitairyuMins, chikoku?.mins, soutai?.mins, gaishutsu?.mins)
    // }
    // 遅刻が210分（08:30~12:00の3.5時間時間）
    // 勤務時間が70分（12:50~17:35.50（定時））

    // 「遅刻があった場合、遅刻時間を社内滞留から差し引く」

    const isLegalHoliday = formatDate(date, 'ddd') === rules.legalHoliday
    //=============休暇申請があった場合の処理=============
    const workStatus: workingType =
      from && !to
        ? '出勤中'
        : !from && !to
        ? ''
        : from && to
        ? kyujitsuShukkin
          ? isLegalHoliday
            ? '休日出勤(法定)'
            : '休日出勤(法定外)'
          : '出勤'
        : ''

    //休暇リクエスト
    const {holidayRequest, workingType, yukyu} = arrangeHoliydayRequest({
      isLegalHoliday,
      date,
      Break,
      workStatus,
      isHoliday,
      HolidayCl,
      rules,
      holidayRequest: ApprovedApRequests.holidayRequest,
    })

    //======振替関連の計算===============
    const {furide, furikyu} = arrangeFurikyu({holidayRequest, kyujitsuShukkin, work, Break})

    //=====残業リクエスト==========================
    const {OverTime} = arrangeOverwork({
      overWorkRequestList: ApprovedApRequests.overWorkRequestList,
      work,
    })

    //=====私有車リクエスト==========================

    const result = {
      isLegalHoliday,
      shanaitairyuMins,
      kyujitsuShukkin,
      date,
      workingType,
      furikyu,
      HolidayCl,
      YsWorkRecord,
      ApprovedApRequests,
      CalendarOnDate,
      work,
      OverTime,
      chikoku,
      soutai,
      gaishutsu,
      yukyu,
      furide,
    }
    return result
  })

  yoshinariUser.workRecordsByDate = workRecordsByDate as workRecordsByDateType[]
}
