'use client'

import {monthDatumOptions} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import {getMONTH_AGG} from '@app/(apps)/yoshinari/(models)/YoshinariUser/getMONTH_AGG'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import ManualUserInputRow from '@app/(apps)/yoshinari/(pages)/beppyo/ManualUserInputRow'
import {Calc} from '@class/Calc'
import {Days, formatDate, getNextMonthLastDate, toUtc} from '@class/Days'
import {Button} from '@components/styles/common-components/Button'
import {FitMargin, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable, csvTableRow} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

import React, {useState} from 'react'

export default function WorkRecordListCC({YoshinariUserList, yukyuGroupedBy, month, YsManualUserRow}) {
  const {days} = Days.getMonthDatum(month, monthDatumOptions)

  const totalDayCount = days.length
  const {query, toggleLoad} = useGlobal()
  const [newRow, setnewRow] = useState<any>(null)

  const getHeaderBody = YoshinariUser => {
    const getUserProps = () => {
      if (YoshinariUser) {
        const UserCl = new YoshinariUserClass(YoshinariUser)
        UserCl.mpaYsWorkRecord({days})
        UserCl.takeInYukyuAgg({yukyuGroupedBy})
        const startOfMonth = days[0]
        const {user} = UserCl ?? {}
        const {rules} = YoshinariUserClass.getUserWorkRules({user: UserCl.user, today: startOfMonth})
        const workMinsPerDay = rules.workMins
        const {MONTH_AGG} = getMONTH_AGG({workMinsPerDay, yoshinariUserCl: UserCl, days})

        return {
          user,
          workMinsPerDay,
          MONTH_AGG,
          UserCl,
        }
      } else {
        return {
          user: undefined,
          workMinsPerDay: undefined,
          MONTH_AGG: undefined,
          UserCl: undefined,
        }
      }
    }

    const {user, workMinsPerDay, MONTH_AGG, UserCl} = getUserProps()

    const show = YoshinariUser && MONTH_AGG
    const rounder = (value, mode?: string) => {
      if (mode === `hour`) {
        return show && Calc.round((value ?? 0) / 60)
      } else if (mode === `min`) {
        return show && Calc.round(((value ?? 0) / 60) * 60)
      } else {
        return show && Calc.round((value ?? 0) / (workMinsPerDay ?? 0))
      }
    }

    let totalFurikyu = MONTH_AGG?.furikyu?.count ?? 0

    const subtractMinutes = Math.min(MONTH_AGG?.holidayWorkDays_legal?.count ?? 0, totalFurikyu)
    const substituteHoliday_legal = (MONTH_AGG?.holidayWorkDays_legal?.count ?? 0) - subtractMinutes

    totalFurikyu -= subtractMinutes

    const substituteHoliday_illegal =
      (MONTH_AGG?.holidayWorkDays_illegal?.count ?? 0) - Math.min(MONTH_AGG?.holidayWorkDays_illegal?.count ?? 0, totalFurikyu)

    if (MONTH_AGG?.chikoku.count) {
      console.log(user.name, MONTH_AGG?.chikoku) //////logs
    }

    return [
      {h: `コード`, b: show && user?.code},
      {h: `氏名`, b: show && user?.name},
      {h: `労働\n日数`, b: rounder(MONTH_AGG?.prescribedWorkingDays?.count)},
      {h: `出勤\n日数`, b: rounder(MONTH_AGG?.workingDays?.count)},
      {h: `休日出勤\n[法定]\n（時間）`, b: rounder(MONTH_AGG?.holidayWorkDays_legal?.count, 'hour')},
      {h: `休日出勤\n[法定外]\n（時間）`, b: rounder(MONTH_AGG?.holidayWorkDays_illegal?.count, 'hour')},
      {h: `振休総数\n（時間）`, b: show && rounder(MONTH_AGG?.furikyu?.count, 'hour')},
      {
        h: `休日出勤残\n[法定] \n（時間）`,
        b: show && rounder(substituteHoliday_legal, 'hour'),
      },
      {
        h: `休日出勤残\n[法定外] \n（時間）`,
        b: show && rounder(substituteHoliday_illegal, 'hour'),
      },

      {h: `欠勤\n日数`, b: rounder(MONTH_AGG?.absentDays?.count)},
      {h: `公休\n日数`, b: rounder(MONTH_AGG?.prescribedHolidays?.count)},
      {h: `特休\n日数`, b: rounder(MONTH_AGG?.specialLeave?.count)},
      {
        h: `有給取得\n日数`,
        b: rounder((MONTH_AGG?.payedLeaveUsed_day?.count ?? 0) + (MONTH_AGG?.payedLeaveUsed_hour?.count ?? 0)),
      },
      {h: `有給\n残日数`, b: rounder(UserCl?.yukyuAgg?.totalRemainingMinutes)},
      {h: `私有車\n（km）`, b: rounder(MONTH_AGG?.privateCarUsageKm?.count)},
      {h: `通常残業\n(時間)`, b: rounder(MONTH_AGG?.normalOverTime?.count, 'hour')},
      {h: `深夜残業\n(時間)`, b: rounder(MONTH_AGG?.lateOverTime?.count, 'hour')},
      {h: `遅刻\n(時間)`, b: rounder(MONTH_AGG?.chikoku?.count, 'hour')},
      {h: `早退\n(時間)`, b: rounder(MONTH_AGG?.soutai?.count, 'hour')},
      {h: `外出\n(時間)`, b: rounder(MONTH_AGG?.gaishutsu?.count, 'hour')},
      {h: `総日数\n（日）`, b: show && totalDayCount},
    ]
  }

  const headerRecords: csvTableRow[] = [
    {csvTableRow: getHeaderBody(null).map(d => ({cellValue: d.h, className: `text-sm leading-4`, style: {textAlign: `center`}}))},
  ]
  const dbUserRows = YoshinariUserList.map(YoshinariUser => {
    return {
      csvTableRow: getHeaderBody(YoshinariUser).map(d => {
        // const minWidth = d.h.includes(`法定`) ? 130 : 60
        const minWidth = 90

        const isMinus = d.b < 0
        return {
          cellValue: d.b,
          style: {
            minWidth,
            ...(isMinus
              ? {
                  background: `crimson`,
                  color: `white`,
                }
              : {}),
          },
        }
      }),
    } as csvTableRow
  })

  const manualUserRows = YsManualUserRow.map(data => ManualUserInputRow({totalDayCount, data, month}))
  if (newRow) {
    manualUserRows.push(ManualUserInputRow({totalDayCount, data: newRow, month}))
  }

  const fetchManualUserRowFromLastMonth = async () => {
    const thisMonth = toUtc(query.month)
    const lastMonth = getNextMonthLastDate(thisMonth, -1)
    const monthDatum = Days.getMonthDatum(lastMonth)
    const {firstDayOfMonth, lastDayOfMonth} = monthDatum

    const monthWhere = {equals: firstDayOfMonth}

    const {result: YsManualUserRow} = await fetchUniversalAPI(`ysManualUserRow`, `findMany`, {
      where: {month: monthWhere},
      orderBy: [{code: `asc`}],
    })

    const transactionQueryList = YsManualUserRow.map(d => {
      const queryObject: Prisma.YsManualUserRowUpsertArgs = {
        where: {unique_month_code: {month, code: d.code}},
        create: {code: d.code, month: thisMonth},
        update: {code: d.code, month: thisMonth},
      }

      return {
        model: `ysManualUserRow`,
        method: `upsert`,
        queryObject,
      }
    })

    const res = await fetchTransactionAPI({transactionQueryList})

    return YsManualUserRow
  }

  const TABLE = CsvTable({
    headerRecords,
    bodyRecords: [...dbUserRows, ...manualUserRows],
    csvOutput: {fileTitle: `勤怠データ_${formatDate(month, 'YYYY_MM')}.csv`},
  })
  return (
    <FitMargin>
      <NewDateSwitcher {...{monthOnly: true}} />
      {TABLE.Downloader()}
      <TableWrapper {...{style: {width: `90vw`, margin: `auto`}}}>
        <TableBordered {...{}}>{TABLE.ALL()}</TableBordered>
      </TableWrapper>
      <R_Stack>
        <Button {...{onClick: () => setnewRow({})}}>フリー入力追加</Button>
        <Button
          {...{
            onClick: async () => {
              toggleLoad(async () => {
                const res = await fetchManualUserRowFromLastMonth()
              })
            },
          }}
        >
          先月からコピー
        </Button>
      </R_Stack>
    </FitMargin>
  )
}
