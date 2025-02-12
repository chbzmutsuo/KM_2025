import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import {formatDate} from '@class/Days'
import {TimeClass} from '@class/TimeClass'

import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {addYears, differenceInMonths} from 'date-fns'

export class PayedLeaveClass {
  //=================バッチ処理===================
  // 勤続年数と週あたりの労働時間に基づく有給日数を取得

  static UpsertPayedLeave = async (props: {user; grantDate; transactionQueryList: transactionQuery[]}) => {
    const {user, grantDate, transactionQueryList} = props
    if (new Date(grantDate) < new Date(`2024-12-26`)) {
      console.warn(`2024年12月26日以前の日付は処理できません`, {grantDate: formatDate(grantDate)})
      return
    }

    if (new Date(grantDate) > new Date()) {
      console.warn(`未来の日付は処理できません`, {grantDate: formatDate(grantDate)})
      return
    }

    const {id: userId, hiredAt} = user

    // const countForPastMonthList = (UserPayedLeaveTypeMidTable?.PayedLeaveType?.UserPayedLeaveTypeMidTable ?? []).map(v => {
    //   return {months: v.months, days: v.days}
    // })

    const monthsSinceHire = differenceInMonths(grantDate, hiredAt)

    const getPaidLeaveDays = ({monthsSinceHire, grantDate}) => {
      const {rules} = YoshinariUserClass.getUserWorkRules({user, today: grantDate})
      const workHour = rules.workMins / 60

      const payedLeaveTypeOnTheDate = user.UserPayedLeaveTypeMidTable?.sort((a, b) => b.from - a.from)?.find(
        v => v.from <= grantDate
      )?.PayedLeaveType

      const PayedLeaveAssignmentCountList = payedLeaveTypeOnTheDate?.PayedLeaveAssignmentCount ?? []

      const PayedLeaveAssignmentCount = PayedLeaveAssignmentCountList.sort((a, b) => b.monthsAfter - a.monthsAfter).find(
        v => v.monthsAfter <= monthsSinceHire
      )

      const paidLeaveDays = PayedLeaveAssignmentCount?.payedLeaveCount ?? 0
      // 付与する有給の量を分単位で計算（1日は480分）
      const paidLeaveMins = paidLeaveDays * 60 * workHour
      if (payedLeaveTypeOnTheDate) {
        console.debug({
          user: user.name,
          date: formatDate(grantDate),
          name: payedLeaveTypeOnTheDate.name,
          paidLeaveDays,
          paidLeaveMins,
        })
      }

      return {paidLeaveDays, paidLeaveMins}
    }

    const {paidLeaveDays, paidLeaveMins} = getPaidLeaveDays({monthsSinceHire, grantDate})

    const data = {
      userId,
      grantedAt: grantDate,
      mins: paidLeaveMins, // 例: 10日分（480分 x 10）
      expiresAt: addYears(grantDate, 2), // 必要に応じて設定}
      remarks: `【自動付与】`,
    }

    const upsertedGrant = data
    transactionQueryList.push({
      model: 'paidLeaveGrant',
      method: `upsert`,
      queryObject: {
        where: {unique_grantedAt_userId: {grantedAt: grantDate, userId}},
        create: data,
        update: data,
      },
    })

    const result = {
      date: formatDate(grantDate),
      user: user.name,
      nMonthPassed: monthsSinceHire,
      count: {days: paidLeaveDays, mins: paidLeaveMins},
      upsertedGrant,
    }

    return result
  }

  // ================ 有給申請からの計算=====================
  static calcYukyuMins = (mappedApRequest: MappeadApRequest, rules) => {
    let result: {
      from: Date | undefined
      to: Date | undefined
      mins: number | undefined
    } = {
      from: undefined,
      to: undefined,
      mins: undefined,
    }
    const {日付, 休暇区分, 開始時刻, 終了時刻} = mappedApRequest?.cf
    const from = new Date(formatDate(日付.value) + ' ' + 開始時刻.value)
    const to = new Date(formatDate(日付.value) + ' ' + 終了時刻.value)

    if (休暇区分.value === `有給（時間給）` || 休暇区分.value === `有給休暇（1日休）`) {
      if (休暇区分.value === `有給（時間給）`) {
        // 有給がある日は、所定時間 - 有給時間とし、分単位で計算
        const mins = TimeClass.toMin(to.getTime() - from.getTime())

        result = {from, to, mins}
      } else if (休暇区分.value === `有給休暇（1日休）`) {
        const defaultWorkMins = rules.workMins

        const mins = defaultWorkMins

        result = {from, to, mins}
      }
    }

    return result
  }
}
