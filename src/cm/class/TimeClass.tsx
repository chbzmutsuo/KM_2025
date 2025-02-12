import {Days} from '@class/Days'

export class TimeClass {
  static addMinues = (props: {time: string; mins: number}) => {
    const {time, mins} = props

    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes + mins, 0)

    const newHours = String(date.getHours()).padStart(2, '0')
    const newMinutes = String(date.getMinutes()).padStart(2, '0')

    return `${newHours}:${newMinutes}`
  }

  static getDiff = (start: string, end: string) => {
    const startDt = new Date()
    const endDt = new Date()

    const [startHours, startMinutes] = start.split(':').map(Number)
    const [endHours, endMinutes] = end.split(':').map(Number)

    startDt.setHours(startHours, startMinutes, 0)
    endDt.setHours(endHours, endMinutes, 0)

    const diff = endDt.getTime() - startDt.getTime()

    const diffMinutes = diff / 1000 / 60

    return diffMinutes
  }
  static getTimeSlots = (startTimeStr = '8:00', endTimeStr = '17:00', step = 30) => {
    const arr: string[] = []

    while (TimeClass.getDiff(startTimeStr, endTimeStr) > 0) {
      arr.push(String(startTimeStr))
      startTimeStr = TimeClass.addMinues({time: startTimeStr, mins: step})
    }
    return arr
  }

  static generateMinuteIntervals(startDate, endDate, step = 1) {
    // 不正な日付のチェック
    if (Days.isDate(startDate) === false || Days.isDate(endDate) === false) {
      throw new Error('正しい日付を入力してください')
    }
    // 日付をDateオブジェクトに変換
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 開始日が終了日より後の場合のエラー
    if (start >= end) {
      console.error('開始日は終了日より前にしてください', {start, end})
    }

    const intervals: Date[] = []
    const current = start

    while (current <= end) {
      intervals.push(new Date(current)) // 現在のタイムスタンプを配列に追加
      current.setMinutes(current.getMinutes() + step) // 1分追加
    }

    return intervals
  }

  static minutesToHourTimeString = (minutes: number) => {
    if (!minutes) {
      return null
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    const isMinus = hours < 0

    if (isMinus) {
      return `-${String(Math.abs(hours)).padStart(2, '0')}:${String(Math.abs(mins)).padStart(2, '0')}`
    } else {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    }
  }
  static HourTimeStringToMinutes = (minutes: string) => {
    const [hours, mins] = minutes.split(':').map(Number)
    return (hours + mins / 60) * 60
  }

  static toMin = dateValue => dateValue / 1000 / 60

  static convertMin = ({mins, hourDivideNum}) => {
    const hour = mins / 60
    const day = (hour * (24 / hourDivideNum)) / 24
    return {hour, day, mins}
  }

  static getMinutesWithinNoonToOne(from: Date, to: Date): number {
    // 判定対象の時間範囲（12:00〜13:00）
    const noonStart = new Date(from)
    noonStart.setHours(12, 0, 0, 0)

    const noonEnd = new Date(from)
    noonEnd.setHours(13, 0, 0, 0)

    // もし from が 13:00 より後、または to が 12:00 より前なら、かかっている分数は 0
    if (to <= noonStart || from >= noonEnd) {
      return 0
    }

    // 実際に判定する開始時刻と終了時刻を決定
    const actualStart = from < noonStart ? noonStart : from
    const actualEnd = to > noonEnd ? noonEnd : to

    // ミリ秒で差分を取得して、分単位に変換
    const diffMilliseconds = actualEnd.getTime() - actualStart.getTime()
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60))

    return diffMinutes
  }

  static convertTimeAsNumber = (
    min: number,
    mode: 'min-to-hour' | 'min-to-day' | 'hour-to-day' | 'day-to-hour' | 'day-to-min' | 'hour-to-min'
  ) => {
    if (mode === 'min-to-hour') {
      return Math.round(min / 60)
    }

    if (mode === 'min-to-day') {
      return Math.round(min / 60 / 24)
    }

    if (mode === 'hour-to-day') {
      return Math.round(min / 24)
    }

    if (mode === 'day-to-hour') {
      return Math.round(min * 24)
    }

    if (mode === 'day-to-min') {
      return Math.round(min * 24 * 60)
    }

    if (mode === 'hour-to-min') {
      return Math.round(min * 60)
    }

    return min
  }
  static minTo
}
