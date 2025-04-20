import {Days, formatDate} from '@class/Days'

export const chechIsHoliday = ({holidays, date}) => {
  const isHoliday = holidays.find(h => {
    return Days.isSameDate(h.date, date)
  })
  return isHoliday || formatDate(date, 'ddd') === '日'
}
