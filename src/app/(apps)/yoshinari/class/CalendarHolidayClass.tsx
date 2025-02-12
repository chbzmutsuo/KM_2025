import {YoshinariUser, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {Days} from '@class/Days'

type attributes = {
  id: string
  label: string
  color: string
  asHoliday?: boolean
}
export class CalendarHolidayClass {
  static holidayTypes = [
    {id: `holidayList`, label: `公休日`, color: `#ED7D31`, asHoliday: true},
    {id: `selectedholidayList`, label: `選択公休日`, color: `#00B0F0`, asHoliday: true},
    // {id: `recommendedPaidholidayList`, label: `有給推奨日`, color: `#70AD47`},
  ]

  calendarHoliday
  attributes: attributes

  constructor(calendarHoliday) {
    this.calendarHoliday
    const holiday = CalendarHolidayClass.holidayTypes.find(d => d.label === calendarHoliday?.type) as unknown as attributes

    if (holiday) {
      this.attributes = holiday
    }
  }

  static getCalendarOnDate = (props: {user: YoshinariUser; today: Date}) => {
    const {user, today} = props
    const theWorkType = YoshinariUserClass.getUserWorkRules({user, today}).theWorkType

    const theCalendarOnDate = (theWorkType?.YsCalendarHoliday ?? []).find(holiday => {
      return Days.isSameDate(holiday.date, today)
    })

    return theCalendarOnDate
  }
}
