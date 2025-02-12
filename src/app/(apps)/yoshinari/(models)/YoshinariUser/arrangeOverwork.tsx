import {TimeClass} from '@class/TimeClass'

export default function arrangeOverwork({
  work, // 所定勤務時間のmins
  overWorkRequestList, // 残業リクエストデータ
}: {
  work: {mins: number}
  overWorkRequestList: Array<{from: string; to: string; cf: any; rules: any}>
}) {
  const normalMinutes: Date[] = []
  const lateNight22To24Minutes: Date[] = []
  const lateNight24To5Minutes: Date[] = []

  // let normalOverTimeSum = 0
  // let lateNightOvertimeSum22To24 = 0 // 深夜割増残業（22:00〜24:00）
  // let lateNightOvertimeSum24To5 = 0 // 深夜割増残業（24:00〜05:00）

  if (overWorkRequestList.length) {
    overWorkRequestList
      .filter(d => d.from && d.to)
      .forEach(d => {
        const {from, to} = d

        // 跨ぎ判定：終了時刻が翌日の場合、24:00分を足して計算

        // let lateNightOvertime22To24 = 0
        // let lateNightOvertime24To5 = 0

        const minuteIntervals = TimeClass.generateMinuteIntervals(from, to, 1)
        minuteIntervals.splice(minuteIntervals.length - 1, 1)

        minuteIntervals.forEach(date => {
          const isAfter22 = date.getHours() >= 22
          const isBefore24 = date.getHours() <= 24
          const isAfter0 = date.getHours() > 0
          const isBefore5 = date.getHours() <= 5
          if (isAfter22 && isBefore24) {
            lateNight22To24Minutes.push(date)
          } else if (isAfter0 && isBefore5) {
            lateNight24To5Minutes.push(date)
          } else {
            normalMinutes.push(date)
          }
        })

        // // 通常残業時間（所定勤務時間外）
        // const totalOverTime = (new Date(to).getTime() - new Date(from).getTime()) / 1000 / 60
        // const normalOverTime = totalOverTime - lateNightOvertime22To24 - lateNightOvertime24To5

        // 加算
        // normalOverTimeSum += normalOverTime
        // lateNightOvertimeSum22To24 += lateNightOvertime22To24
        // lateNightOvertimeSum24To5 += lateNightOvertime24To5
      })
  }

  const OverTime = {
    normal: {
      from: normalMinutes[0],
      to: normalMinutes[normalMinutes.length - 1],
      mins: normalMinutes.length,
    }, // 通常残業時間
    lateNight22To24: {
      from: lateNight22To24Minutes[0],
      to: lateNight22To24Minutes[lateNight22To24Minutes.length - 1],
      mins: lateNight22To24Minutes.length,
    }, // 深夜割増残業（22:00〜24:00）
    lateNight24To5: {
      from: lateNight24To5Minutes[0],
      to: lateNight24To5Minutes[lateNight24To5Minutes.length - 1],
      mins: lateNight24To5Minutes.length,
    }, // 深夜割増残業（24:00〜05:00）
  }

  return {
    OverTime,
    overWorkRequestList,
  }
}
