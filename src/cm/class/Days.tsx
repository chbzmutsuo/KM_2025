import {getColorStyles, isServer} from 'src/cm/lib/methods/common'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ja'
import {breakLines} from 'src/cm/lib/value-handler'
import {colTypeStr} from '@cm/types/types'
import {arrToLines} from 'src/cm/components/utils/texts/MarkdownDisplay'
import {addDays, addHours, differenceInDays, addMonths, isLastDayOfMonth, subDays} from 'date-fns'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')
dayjs.tz.setDefault('Asia/Tokyo')

const offset = new Date().getTimezoneOffset()

export type TimeFormatType =
  | string
  | 'YYYY'
  | 'MM'
  | 'YYYYMM'
  | 'YYYYMMDDHHmmss'
  | 'YYYY-MM'
  | 'YYYY-MM-DD(ddd)'
  | 'YYYY-MM-DD(ddd) HH:mm:ss'
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD(ddd) HH:mm'
  | 'HH:mm'
  | 'M/D(ddd)'
  | 'MM-DD(ddd)'
  | 'MM-DD HH:mm'
  | 'M-D'
  | 'D'
  | 'YYYY/MM/DD'
  | 'YY/MM/DD'
  | 'YY-MM-DD'
  | 'YY-MM-DD(ddd)'
  | 'YY-M-D(ddd)'
  | 'MM-DD'
  | 'YYYY-MM-DD'
  | 'ddd'
  | '(ddd)'
  | 'iso'
  | 'short'
  | 'japan'
  | 'japan-iso'
  | 'D(ddd)'
  | 'YY年M月'
  | 'YYYY年'
  | 'YYYY年MM月'
  | 'YYYY年mm月'
  | 'M月D日(ddd)'
  | 'MM月DD日(ddd)'
  | 'DD日(ddd)'
  | 'YYYY年M月D日(ddd)'
  | 'YY年M月D日'
  | 'YY年M月D日(ddd)'
  | 'YYYY年MM月DD日(ddd)'
  | 'M'
  | `YY/M/D(ddd)`

export const getMidnight = (date = new Date()) => {
  const dt = new Date(date)

  const year = Number(formatDate(dt, 'YYYY'))
  const month = Number(formatDate(dt, 'MM'))
  const day = Number(formatDate(dt, 'DD'))

  let midnightDate = new Date(year, month - 1, day, 0, 0, 0)
  if (isServer) {
    midnightDate = toUtc(midnightDate)
  }

  if (midnightDate?.toISOString().includes(`15:00`) === false) {
    console.error(`getMidnightError`, date, new Date(year, month - 1, day, 0, 0, 0), midnightDate.toISOString())
  }

  return midnightDate
}
export const toUtc = (...args) => {
  let dt = new Date(args[0])

  const isDate = Days.isDate(dt)
  if (!isDate) {
    console.warn(`toUtc: ${dt} is not a date object`)
  }

  if (args.length > 1) {
    const [year, month, date] = args
    dt = new Date(year, month, date)
  }

  const result = addHours(dt, -9) as Date

  return result
}

export const toJst = (...args) => {
  let dt = new Date(args[0])

  const isDate = Days.isDate(dt)
  if (!isDate) {
    console.warn(`toUtc: ${dt} is not a date object`)
  }

  if (args.length > 1) {
    const [year, month, date] = args

    dt = new Date(year, month, date)
  }

  return addHours(dt, 9)
}
// export const toJst = (date = new Date()) => {
//   return addHours(date, 9)
// }

export const getMaxDate = (dates: Date[]) => {
  if (dates.length === 0) return null
  return new Date(Math.max(...dates.map(date => date.getTime())))
}
export const getMinimumDate = (dates: Date[]) => {
  if (dates.length === 0) return null
  return new Date(Math.min(...dates.map(date => date.getTime())))
}

export const toIsoDateIfExist = value => {
  return value && Days.isDate(value) ? formatDate(value, `iso`) : undefined
}

export const formatDateTimeOrDate = (date: Date) => {
  if (!date) return ''
  const toMinutes = formatDate(date, `YYYY/MM/DD(ddd) HH:mm`)
  if (toMinutes.includes(`00:00`)) {
    return formatDate(date, `YYYY/MM/DD(ddd)`)
  } else {
    return toMinutes
  }
}

export const formatDate = (dateObject?: any, format?: TimeFormatType | TimeFormatType[]) => {
  const originalValue = dateObject

  format = format ?? 'YYYY-MM-DD'

  let result
  if (!Days.isDate(dateObject)) return originalValue ? originalValue : null
  dateObject = dateObject ? new Date(dateObject) : new Date() //日付オブジェクトへ変換

  /**サーバーかクライアントでタイムゾーンを切り替え */
  // const timezonedDate = isServer ? Days.main(dateObject) : Days.main(dateObject)

  const FORMATTER = (value, f) => {
    let dateObject = value

    // 2024/09/24変更
    if (isServer) {
      const doConvert = String(dateObject).includes('15:00:00')

      if (doConvert) {
        dateObject = toJst(dateObject)
      }
    }

    return dayjs(dateObject).format(f)
  }
  if (format === 'iso') {
    result = dayjs(dateObject).format()
  } else if (format === 'short') {
    result = dayjs(dateObject).format(`.YY/MM/DD(ddd)`)
  } else {
    if (Array.isArray(format)) {
      const toMarkDown = arrToLines(format.map(f => FORMATTER(dateObject, f)))
      const toElementsArr = breakLines(toMarkDown)
      result = toElementsArr
    } else {
      result = FORMATTER(dateObject, format)
    }
  }

  if (result === 'Invalid Date') return originalValue

  return result
}

export const displayDateInTwoLine = (value = '2023-01-01') => {
  const numberMatch = String(value).match(/\d*\d/g)

  const [year, month, day] = numberMatch ?? []
  const date = String(value).match(/\(.+\)/)?.[0]

  let displayValue = ``

  if (year && month && !day) {
    displayValue = `${year}年${month}月`
  } else if (!year && month && day) {
    displayValue = `${month}月${day}日`
  } else if (year && month && day) {
    displayValue = `${year}年\n${month}月${day}日`
  }

  if (date) {
    displayValue += `${date}`
  }

  return displayValue
}

export class Days {
  static main = (...args) => dayjs(...args)
  /**その日の午前0時にする */

  static isHoliday(date) {
    switch (formatDate(date, 'ddd')) {
      case '土':
        return {style: {...getColorStyles('#ffd7d7')}}
      case '日':
        return {style: {...getColorStyles('#c6eeff')}}
    }
  }

  static addBusinessDays(startDate, n, nonWorkingDays = []) {
    // 日付を操作するために基準日をDateオブジェクトに変換
    const currentDate = new Date(startDate)

    // 非稼働日をセットに変換して効率的に検索できるようにする
    const nonWorkingDaysSet = new Set(nonWorkingDays.map(day => formatDate(new Date(day))))
    let roopCount = 0

    // 進む方向を決定（n が正なら先の日付、負なら過去の日付へ）
    const step = n >= 0 ? 1 : -1

    while (n !== 0) {
      // 翌日または前日へ進める
      currentDate.setDate(currentDate.getDate() + step)
      const dateString = formatDate(currentDate)

      if (!nonWorkingDaysSet.has(dateString)) {
        // 稼働日ならnを減らす (nが負の場合も絶対値で減らす)
        n -= step
      }

      roopCount++
    }

    return currentDate
  }

  static calculateOverlappingTimeRange(props: {
    range1: {
      start: Date
      end: Date
    }
    range2: {
      start: Date
      end: Date
    }
  }) {
    const {range1, range2} = props
    // 入力値がDateオブジェクトであることを確認します。
    const range1Start = new Date(range1.start)
    const range1End = new Date(range1.end)
    const range2Start = new Date(range2.start)
    const range2End = new Date(range2.end)

    const latestStart = range1Start > range2Start ? range1Start : range2Start
    const earliestEnd = range1End < range2End ? range1End : range2End

    if (latestStart < earliestEnd) {
      return {
        start: latestStart,
        end: earliestEnd,
        mins: (earliestEnd.getTime() - latestStart.getTime()) / 1000 / 60,
      }
    } else {
      return null // 重複部分がない場合
    }
  }

  /**8桁数値を日付オブジェクトに変換する */
  static getDateFromEightDigitNumber(eightDigitNumber) {
    const dateString = String(eightDigitNumber)
    const year = parseInt(dateString.slice(0, 4), 10)
    const month = parseInt(dateString.slice(4, 6), 10) - 1 // Subtract 1 since months are 0-based in JavaScript Date objects

    const day = parseInt(dateString.slice(6, 8), 10)

    return new Date(year, month, day)
  }

  static isSameDate = (dt1, dt2) => {
    const formattedDt1 = formatDate(getMidnight(dt1))
    const formattedDt2 = formatDate(getMidnight(dt2))

    return formattedDt1 === formattedDt2
  }
  static isSameMonth = (dt1, dt2) => {
    const formattedDt1 = formatDate(getMidnight(dt1), 'YYYY-MM')
    const formattedDt2 = formatDate(getMidnight(dt2), 'YYYY-MM')

    return formattedDt1 === formattedDt2
  }

  static isDate = value => {
    const isNumber = str => {
      return String(str)
        .split('')
        .every(char => !isNaN(Number(char)))
    }

    if (!value) return false

    const date = new Date(value)
    const isValidDate = !isNaN(date.getTime())
    const isNotNumber = !isNumber(value)

    const result = isValidDate && isNotNumber

    return result
  }

  static generate30MinuteIntervals() {
    const intervals: any[] = []
    const intervalInMinutes = 30
    const minutesInADay = 24 * 60

    for (let i = 0; i < minutesInADay; i += intervalInMinutes) {
      const hours = Math.floor(i / 60)
      const minutes = i % 60

      const hoursString = hours.toString().padStart(2, '0')
      const minutesString = minutes.toString().padStart(2, '0')

      intervals.push(`${hoursString}:${minutesString}`)
    }

    return intervals
  }

  static getIntervalDatum = (start: Date, end: Date) => {
    const daysInInterval = differenceInDays(new Date(end), new Date(start))

    /**今月日数 */
    const days: any[] = []
    for (let i = 0; i <= daysInInterval; i++) {
      const dt = new Date(start)
      const newDate = dt.setDate(dt.getDate() + i)
      days.push(new Date(newDate))
    }

    return {days}
  }

  static getMonthDatum(
    monthDt: Date,
    options?: {
      getFrom: (monthDt: Date) => Date
      getTo: (monthDt: Date) => Date
    }
  ) {
    const dateConverter = isServer ? toUtc : val => val
    const year = toJst(monthDt).getFullYear()
    const month = toJst(monthDt).getMonth() //月よりも-1
    const date = 1
    const logWhen = (...data) => (month === 1 ? console.debug(data) : '')

    const getFromTo = () => {
      if (options) {
        return {
          firstDayOfMonth: options.getFrom(monthDt),
          lastDayOfMonth: options.getTo(monthDt),
        }
      } else {
        return {
          firstDayOfMonth: dateConverter(new Date(year, month, 1)),
          lastDayOfMonth: dateConverter(new Date(year, month + 1, 0)),
        }
      }
    }

    const {firstDayOfMonth, lastDayOfMonth} = getFromTo()

    const days = Days.getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth)

    const getWeeks = (
      startDateString: '月' | '火' | '水' | '木' | '金' | '土' | '日',
      options?: {
        showPrevAndNextMonth?: boolean
      }
    ) => {
      const weekDayStart = startDateString
      const weekdayMaster = [`日`, '月', '火', '水', '木', '金', '土']
      const weekdays = weekdayMaster
        .slice(weekdayMaster.indexOf(weekDayStart), 7)
        .concat(weekdayMaster.slice(0, weekdayMaster.indexOf(weekDayStart)))

      let weeks: Date[][] = [[]]

      const firstWeekOffset = getDayIndexOfWeek(firstDayOfMonth, weekdays)
      const prevMonthDays = new Array(firstWeekOffset).fill(0).map((_, i) => subDays(firstDayOfMonth, firstWeekOffset - i))

      const lastWeekOffset = 6 - getDayIndexOfWeek(lastDayOfMonth, weekdays)
      const nextMonthDays = new Array(lastWeekOffset).fill(0).map((_, i) => addDays(lastDayOfMonth, i + 1))

      const daysShownOnCalendar = [...prevMonthDays, ...days, ...nextMonthDays]

      for (let i = 0; i < daysShownOnCalendar.length; i += 7) {
        weeks.push(daysShownOnCalendar.slice(i, i + 7))
      }
      const remainingDayCount = 7 - weeks[weeks.length - 1].length

      for (let i = 0; i < remainingDayCount; i++) {
        weeks[weeks.length - 1].push(nextMonthDays[i])
      }

      weeks = weeks.filter(week => week.length === 7)

      return weeks
    }

    // 曜日のインデックスを取得するヘルパー関数 (0: 日, 1: 月, ..., 6: 土)
    function getDayIndexOfWeek(date: Date, weekdays): number {
      const currentWeekdayIndex = weekdays.indexOf(date.toLocaleDateString('ja', {weekday: 'short'}).slice(0, 1))

      // offsetを常に正の値にする
      return currentWeekdayIndex
    }
    const BASICS = {
      year,
      month: month + 1,
      date,
      firstDayOfMonth,
      lastDayOfMonth,
    }

    return {
      ...BASICS,
      getWeeks,
      days,
    }
  }

  static getYearDatum(year: number) {
    const firstDateOfYear = toUtc(year, 0, 1)
    const lastDateOfYear = toUtc(year, 11, 31)

    const getSpecifiedMonthOnThisYear = month => {
      return {first: toUtc(year, month - 1, 1), last: addDays(toUtc(year, month, 1), -1)}
    }

    return {firstDateOfYear, lastDateOfYear, getSpecifiedMonthOnThisYear}
  }

  /**
   *
   * @param {小数点までの左の桁数} decimalPointFromLeft
   * @returns
   */
  static getTimeId = (startDecimal = 0, endDecimal = 14) => {
    const str = formatDate(new Date(), 'YYYYMMDDHHmmss')
    const timeId = str.slice(startDecimal, endDecimal)
    return Number(timeId)
  }

  static getTimeFormt = (type: colTypeStr) => {
    let timeFormat = ''

    switch (type) {
      case 'date':
      case 'datetime':
        timeFormat = `yyyy-MM-dd`
        break
      case 'month':
        timeFormat = 'yyyy-MM'
        break
      case 'year':
        timeFormat = `yyyy`
      // case 'datetime':
      //   timeFormat = 'yyyy-MM-dd HH:mm'
      //   break
    }

    const timeFormatForDaysJs = timeFormat.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD')
    const timeFormatForDateFns = timeFormat.replace(/yyyy/g, 'yyyy').replace(/dd/g, 'dd')

    return {timeFormatForDaysJs, timeFormatForDateFns}
  }

  static calcAge = birthday => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  static getDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 時間部分をリセットして、日付単位での比較にする
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const days: Date[] = []

    let convertToUtc = false
    while (start <= end) {
      let nextDate = new Date(start.getTime())
      if (nextDate.toISOString().includes('15:00:00') === false) {
        convertToUtc = true
        nextDate = addHours(nextDate, 15)
      }

      days.push(nextDate) // 新しいDateオブジェクトを作成して追加
      start.setDate(start.getDate() + 1)
    }

    if (days.some(d => !d.toISOString().includes('15:00:00'))) {
      throw new Error(`getDaysBetweenDates: UTC ではありません。`)
    }
    if (convertToUtc) {
      console.warn(`getDaysBetweenDates: convert to UTC`)
    }

    return days
  }

  static getMonthsBetweenDates(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const firstDate = start
    const lastDate = end

    let theDate = firstDate

    const months: Date[] = []
    let roop = 0

    while (theDate <= lastDate) {
      months.push(theDate)

      theDate = getNextMonthLastDate(theDate, 1)

      roop++
      if (roop > 50) {
        console.error(`getMonthsBetweenDates: roop over`)
        break
      }
    }

    return months
  }
}

export const localeDateOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
}

export const getNextMonthLastDate = (date: Date, add: number) => {
  date = addMonths(date, add ?? 1)
  if (isLastDayOfMonth(date) === false) {
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
  }

  return date
}
