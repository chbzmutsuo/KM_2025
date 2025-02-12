import {from_to_min} from '@app/(apps)/yoshinari/(models)/YoshinariUser/mapYsWorkRecordOrigin'
import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {Days, formatDate} from '@class/Days'
import {TimeClass} from '@class/TimeClass'

export default function initYsRecord({rules, yoshinariUser, date}) {
  const YsWorkRecord = yoshinariUser.user?.YsWorkRecord.find(YsWorkRecord => Days.isSameDate(YsWorkRecord.date, date))

  const CalendarOnDate = CalendarHolidayClass.getCalendarOnDate({user: yoshinariUser.user, today: date})
  const HolidayCl = new CalendarHolidayClass(CalendarOnDate)

  const isHoliday = HolidayCl?.attributes?.asHoliday
  const {breakTime} = YsWorkRecord ?? {}

  //各種時間の計算

  //業務時間の計算

  const from = YsWorkRecord?.from
    ? new Date(
        Math.max(
          //
          YsWorkRecord.from.getTime(),
          new Date(formatDate(date, 'YYYY-MM-DD') + ' ' + rules.work.startTime).getTime()
        )
      )
    : undefined

  const to = YsWorkRecord?.to
    ? new Date(
        Math.min(
          //
          YsWorkRecord.to.getTime(),
          new Date(formatDate(date, 'YYYY-MM-DD') + ' ' + rules.work.endTime).getTime()
        )
      )
    : undefined

  const mins = from && to ? TimeClass.toMin(to.getTime() - from.getTime()) : 0

  const work: from_to_min = {
    from,
    to,
    mins: mins - (breakTime ?? 0),
  }

  const kyujitsuShukkin = HolidayCl?.attributes?.asHoliday && to && from //休日出勤

  const Break: from_to_min = {
    from: new Date(formatDate(date, 'YYYY-MM-DD') + ' ' + rules.lunchBreak.startTime),
    to: new Date(formatDate(date, 'YYYY-MM-DD') + ' ' + rules.lunchBreak.endTime),
    mins: rules.breakMin,
  }

  return {
    isHoliday,
    from,
    to,
    Break,
    work,
    kyujitsuShukkin,
    YsWorkRecord,
    CalendarOnDate,
    HolidayCl,
  }
}
