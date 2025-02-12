// scripts/grantPaidLeave.js

import {PayedLeaveClass} from '@app/(apps)/yoshinari/(models)/PaidLeave/PayedLeave'
// import {rules, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

import {requestResultType} from '@cm/types/types'
import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import prisma from '@lib/prisma'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'
import {addMonths, addYears, isBefore, differenceInYears} from 'date-fns'
import {NextRequest, NextResponse} from 'next/server'
import {P_User} from 'scripts/generatedTypes'
import {isCron} from 'src/non-common/serverSideFunction'

export const GET = async (req: NextRequest) => {
  if ((await isCron({req})) === false) {
    const res = {success: false, message: `Unauthorized`, result: null}
    const status = {status: 401, statusText: `Unauthorized`}
    return NextResponse.json(res, status)
  }

  const res = await grantPaidLeave()
  return NextResponse.json(res)
}

async function grantPaidLeave() {
  let result: requestResultType = {
    success: false,
    result: null,
    message: '',
  }
  try {
    const args: Prisma.UserFindManyArgs = {
      where: {hiredAt: {not: null}},
      include: {
        UserWorkTimeHistoryMidTable: {include: {WorkType: {}}},
        UserPayedLeaveTypeMidTable: {
          include: {
            PayedLeaveType: {
              include: {
                PayedLeaveAssignmentCount: {},
              },
            },
          },
        },
      },
    }
    const users: P_User[] = await prisma.user.findMany(args)

    const currentDate = new Date()

    const updatedData: any = []

    const transactionQueryList: transactionQuery[] = []

    for (const user of users) {
      const total = {
        days: 0,
        mins: 0,
        user,
        PayedLeaveGrantList: [] as any[],
        // rules: YoshinariUserClass.getUserWorkRules({user, today}).rules,
      }
      console.info(`====${user.name} (ID:${user.id})====`)
      const {id: userId, hiredAt} = user

      // 勤続年数を計算
      const yearsSinceHire = differenceInYears(currentDate, hiredAt)

      // 初回付与の判定（雇用開始日から6ヶ月後）
      const firstGrantDate = addMonths(hiredAt, 6)

      //=============初回付与=============
      const firstGrantResult = await PayedLeaveClass.UpsertPayedLeave({user, grantDate: firstGrantDate, transactionQueryList})
      if (firstGrantResult) {
        total.days += firstGrantResult.count.days
        total.mins += firstGrantResult.count.mins
        total.PayedLeaveGrantList.push(firstGrantResult?.upsertedGrant)
      }

      //初回から今年に至るまでループ
      for (let i = 0; i < yearsSinceHire; i++) {
        //========初回付与の判定（雇用開始日から6ヶ月後）から1年ごとに=====
        const annualGrantDate = addYears(firstGrantDate, i + 1)
        if (isBefore(annualGrantDate, currentDate)) {
          const grantResult = await PayedLeaveClass.UpsertPayedLeave({user, grantDate: annualGrantDate, transactionQueryList})
          if (grantResult) {
            total.days += grantResult.count.days
            total.mins += grantResult.count.mins
            total.PayedLeaveGrantList.push(grantResult?.upsertedGrant)
          }
        }

        // ========================================================
      }
      updatedData.push(total)
    }

    const res = await fetchTransactionAPI({transactionQueryList})

    // ====================メッセージ作成====================
    const message = [
      ...updatedData.map((record: {days; mins; user; PayedLeaveGrantList}) => {
        const {days, mins, user, PayedLeaveGrantList} = record

        const totalMins = PayedLeaveGrantList.reduce((acc, grant) => (acc += grant.mins), 0)
        // const {day, hour} = TimeClass.convertMin({mins: totalMins, hourDivideNum: rules.workHours})
        // return [
        //   `==氏名:${user.name}  累計:${day}日(${hour}時間/${mins}分)==`,
        //   ...PayedLeaveGrantList.map((grant: PaidLeaveGrant) => {
        //     const {mins, grantedAt} = grant
        //     const {day, hour} = TimeClass.convertMin({mins, hourDivideNum: rules.workHours})

        //     return `${formatDate(grantedAt, 'YYYY/MM/DD(ddd)')} 付与: ${day}日(${hour}時間/${mins}分)`
        //   }),
        //   ``,
        // ].flat()

        return []
      }),
    ].join(`\n`)

    // ====================メッセージ作成====================

    result = {
      success: true,
      result: updatedData,
      message,
    }
  } catch (error) {
    console.error('有給付与のバッチ処理中にエラーが発生しました:', error)
    result = {
      success: false,
      result: null,
      message: '有給付与のバッチ処理中にエラーが発生しました。',
    }
  }

  return result
}

const seed = async () => {
  // 有給日数のテーブル
  const holidaysTable = {
    社員: [10, 11, 12, 14, 16, 18, 20],
    パート週4: [7, 8, 9, 10, 12, 13, 15],
    パート週3: [5, 6, 6, 8, 9, 10, 11],
    パート週2: [3, 4, 4, 5, 6, 6, 7],
    パート週1: [1, 2, 2, 2, 3, 3, 3],
  }
  // 勤続月数に応じた有給付与の段階
  const countForPastMonthList = [
    {months: 6, days: 6 * 30},
    {months: 18, days: 18 * 30},
    {months: 30, days: 30 * 30},
    {months: 42, days: 42 * 30},
    {months: 54, days: 54 * 30},
    {months: 66, days: 66 * 30},
    {months: 78, days: 78 * 30},
  ]
  await Promise.all(
    Object.keys(holidaysTable).map(async name => {
      const args: Prisma.PayedLeaveTypeCreateArgs = {
        data: {
          name,
          PayedLeaveAssignmentCount: {
            createMany: {
              data: countForPastMonthList.map(({months: monthsAfter}, i) => {
                const array = holidaysTable[name]
                const payedLeaveCount = array[i] || 0
                return {
                  monthsAfter,
                  payedLeaveCount,
                }
              }),
            },
          },
        },
      }
      const result = await prisma.payedLeaveType.create(args)
    })
  )
}
