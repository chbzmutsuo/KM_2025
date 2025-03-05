// import {PayedLeaveClass} from '@app/(apps)/yoshinari/(models)/PaidLeave/PayedLeave'

import {getComponents} from '@app/(apps)/yoshinari/(models)/YoshinariUser/getComponents'
import {getMonthlySummaryRecordsOrigin} from '@app/(apps)/yoshinari/(models)/YoshinariUser/getmonthlySummaryRecords'

import {mapYsWorkRecordOrigin, workRecordsByDateType} from '@app/(apps)/yoshinari/(models)/YoshinariUser/mapYsWorkRecordOrigin'
import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'

import {ApRequestClass, MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'

import {TimeClass} from '@class/TimeClass'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {ApRequest, PaidLeaveGrant, Prisma, User, WorkType} from '@prisma/client'

import {P_ApSender, P_YsCalendarHoliday, P_YsWorkRecord} from 'scripts/generatedTypes'

import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import {userYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import {getKintaiTableRecordsOrigin} from '@app/(apps)/yoshinari/(models)/YoshinariUser/getKintaiTableRecordsOrigin'
import {userForSelect} from '@app/(apps)/yoshinari/constants/forSelectConfig'

export type workingType =
  | ``
  | `出勤中`
  | `休日出勤(法定)`
  | `休日出勤(法定外)`
  | `休日(法定)`
  | `休日(法定外)`
  | `出勤`
  | `振替休日`
  | `有給休暇（1日休）`
  | `有給（時間給）`
  | `特別休暇`
  | `慶弔休暇`
  | `欠勤`
  | `その他:`

type yukyuPropType = {
  DHM: {hour: number; day: number; mins: number}
  history: any[]
}
export type rules = {
  work: {startTime: string; endTime: string}
  lunchBreak: {startTime: string; endTime: string}
  workMins: number
  fixedOvertime: string
  breakMin: number
  workHours: number
  legalHoliday: string | null
}
export class YoshinariUserClass {
  user: YoshinariUser
  workRecordsByDate: workRecordsByDateType[]
  // yukyu: {gain?: yukyuPropType; adjustment?: yukyuPropType; consume?: yukyuPropType; remain?: yukyuPropType}
  yukyuAgg: userYukyuAgg
  currentWorkRule: rules

  constructor(user) {
    this.user = user

    if (!user?.UserWorkTimeHistoryMidTable) {
      console.error(`UserWorkTimeHistoryMidTable が指定されていません`, user?.id, user?.name)
    }

    this.currentWorkRule = YoshinariUserClass.getUserWorkRules({user: this.user, today: new Date()}).rules
  }

  static getUserWorkRules = ({user, today}) => {
    if (user?.UserWorkTimeHistoryMidTable === undefined) {
      throw new Error(`UserWorkTimeHistoryMidTable is not defined`)
    }

    const sortedUserWorkTimeHistoryMidTable = [...user.UserWorkTimeHistoryMidTable].sort((a, b) => {
      return a.from > b.from ? -1 : 1
    })

    const theWorkType = sortedUserWorkTimeHistoryMidTable.find(d => {
      return today >= d.from
    })?.WorkType

    const {work_startTime, work_endTime, lunchBreak_startTime, lunchBreak_endTime, workMins, fixedOvertime, legalHoliday} =
      theWorkType ?? Yoshinari.constants().rules

    const breakMin = TimeClass.getDiff(lunchBreak_startTime, lunchBreak_endTime)

    const rules: rules = {
      work: {startTime: work_startTime, endTime: work_endTime},
      lunchBreak: {startTime: lunchBreak_startTime, endTime: lunchBreak_endTime},
      breakMin,
      fixedOvertime,
      workMins,
      workHours: workMins / 60,
      legalHoliday,
    }

    return {rules, theWorkType}
  }

  takeInYukyuAgg = (props: {yukyuGroupedBy: userYukyuAgg[]}) => {
    const found = props.yukyuGroupedBy.find(d => d.userId === this.user.id)

    if (found) {
      this.yukyuAgg = found
    }
  }
  // // =====================初期化=============

  //==========休日カレンダーを取得==========
  getCalendarInDays = ({days}) => {
    const allCalendar = days.map(d => {
      const theCalendarOnDate = CalendarHolidayClass.getCalendarOnDate({user: this.user, today: d})

      const calendarClass = new CalendarHolidayClass(theCalendarOnDate)

      return {
        date: d,
        ...calendarClass,
      }
    })

    const holidays = allCalendar.filter(d => d?.attributes?.asHoliday)
    const workDays = allCalendar.filter(d => !d.attributes?.asHoliday)

    return {allCalendar, holidays, workDays}
  }

  mpaYsWorkRecord = ({days}) => {
    return mapYsWorkRecordOrigin({yoshinariUser: this, days})
  }

  //=============期間中の処理=============＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  getTableRecords = ({days}) => {
    this.mpaYsWorkRecord({days})

    const getMonthlySummaryRecords = ({rules}) => getMonthlySummaryRecordsOrigin({days, yoshinariUserCl: this, rules})

    const getKintaiTableRecords = () => getKintaiTableRecordsOrigin({yoshinariUser: this})

    return {getKintaiTableRecords, getMonthlySummaryRecords}
  }

  //=============1日単位の処理=============

  getComponents = ({date}) => getComponents({YoshinariUserClass: this, date})

  //=============static=========================================
  static getUserAndYukyuHistory = async (props: {userId; whereQuery?: any}) => {
    const getUser = async () => {
      const {whereQuery, userId} = props

      const {apRequest} = ApRequestClass.ApRequestGetInclude()

      const userFindUniquePayload: Prisma.UserFindManyArgs = {
        where: {id: userId, AND: [{...userForSelect.where}]},
        include: {
          UserWorkTimeHistoryMidTable: {
            include: {WorkType: {include: {YsCalendarHoliday: {where: {date: whereQuery}}}}},
          },
          PaidLeaveGrant: {},
          YsWorkRecord: {where: {...(whereQuery ? {date: whereQuery, userId} : undefined)}},
          ApSender: {
            include: {
              ApRequest: {
                where: {
                  OR: [
                    //有給以外は、whereQueryがある場合はその日付のみ取得
                    {
                      ApCustomFieldValue: {
                        some: {
                          ApCustomField: {OR: [{name: `日付`}]},
                          date: whereQuery,
                        },
                      },
                    },
                    // 有給ログは全て取得する
                    {
                      ApCustomFieldValue: {
                        some: {
                          string: {contains: `有給`},
                          ApCustomField: {name: `休暇区分`},
                        },
                      },
                    },
                  ],
                },
                include: apRequest.include,
              },
            },
          },
          // WorkType: {include: {YsCalendarHoliday: {}}},
        },
        orderBy: [{code: `asc`}],
      }

      const users: YoshinariUser[] = await (await fetchUniversalAPI(`user`, `findMany`, userFindUniquePayload)).result

      users.map(user => {
        user[`myApRequest`] = (user?.ApSender ?? [])
          ?.map(sender => {
            return sender.ApRequest.map(request => {
              return new ApRequestClass(request).ApRequest
            }).flat()
          })
          .flat()
      })

      return users
    }
    const YoshinariUsers = await getUser()

    return {
      YoshinariUsers,
    }
  }
}

export type YoshinariUser = User & {
  PaidLeaveGrant: PaidLeaveGrant[]
  WorkType: WorkType & {YsCalendarHoliday: P_YsCalendarHoliday[]}
  YsWorkRecord: P_YsWorkRecord[]
  ApSender: (P_ApSender & {ApRequest: ApRequest[]})[]
  myApRequest: MappeadApRequest[]
}
