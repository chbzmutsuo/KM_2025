import {Days, formatDate, getNextMonthLastDate, toUtc} from '@class/Days'
import {Padding} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'

import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import React from 'react'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {userForSelect} from '@app/(apps)/yoshinari/constants/forSelectConfig'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {CsvTable, csvTableRow} from '@components/styles/common-components/CsvTable/CsvTable'
import {TimeClass} from '@class/TimeClass'
import {Calc} from '@class/Calc'
import {differenceInMonths} from 'date-fns'
import {getUserYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import BasicModal from '@components/utils/modal/BasicModal'
import {getYoshinariRedirectPath, get_gte_lt_from_month} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import {isDev} from '@lib/methods/common'
import {T_LINK} from '@components/styles/common-components/links'
import {HREF} from '@lib/methods/urls'

export default async function Page(props) {
  const query = await props.searchParams
  const {whereQuery, redirectPath} = await getYoshinariRedirectPath({query})
  if (redirectPath) {
    return <Redirector {...{redirectPath}} />
  }

  const where = userForSelect.where
  const {result: users} = await fetchUniversalAPI(`user`, `findMany`, {orderBy: [{code: `asc`}], where})

  const thisJanuary = toUtc(new Date(query.month).getFullYear(), 0, 1)

  const months = Days.getMonthsBetweenDates(thisJanuary, getNextMonthLastDate(thisJanuary, 11))

  const {yukyuGroupedBy} = await getUserYukyuAgg()

  const YoshinariUserClList = (await Promise.all(
    users.map(async user => {
      const {YoshinariUsers} = await YoshinariUserClass.getUserAndYukyuHistory({userId: user.id, whereQuery})
      const YoshinariUser = YoshinariUsers[0]

      const UserCl = new YoshinariUserClass(YoshinariUser)
      UserCl.takeInYukyuAgg({yukyuGroupedBy})

      return UserCl
    })
  )) as YoshinariUserClass[]

  const headerRecords: csvTableRow[] = [
    {
      csvTableRow: [
        `コード`,
        `従業員名`,
        `入社年月日`,
        `勤続年数`,
        `付与履歴`,
        `取得履歴`,
        ...[...months.map(d => formatDate(d, `M月`)), `合計`],
        `有給残日数`,
      ].map(d => ({
        cellValue: d,
      })),
    },
  ]

  const bodyRecords: csvTableRow[] = YoshinariUserClList.map(UserCl => {
    const {user, yukyuAgg, currentWorkRule} = UserCl

    const {code, name, hiredAt, WorkType} = user as any

    let usageHistoryTdList = months.map(month => {
      const usageHistory =
        yukyuAgg?.consumeList?.filter(d => {
          const whereQuery = get_gte_lt_from_month(month)

          return whereQuery.gte <= d.consumedDate && d.consumedDate <= whereQuery.lte
        }) ?? []

      const totalMins = usageHistory?.reduce((acc, d) => acc + d.totalConsumedMinutes, 0)
      const {rules} = YoshinariUserClass.getUserWorkRules({user: user, today: month})
      const {workHours} = rules
      return TimeClass.convertMin({mins: totalMins, hourDivideNum: workHours}).day
    })
    usageHistoryTdList = [...usageHistoryTdList, usageHistoryTdList.reduce((acc, d) => acc + d, 0)]

    const workMonth = differenceInMonths(new Date(), hiredAt)

    const workYear = Math.floor(workMonth / 12)
    const restMonth = Math.round(workMonth % 12)

    const remainYukyuInDays = TimeClass.convertMin({
      mins: yukyuAgg?.totalRemainingMinutes ?? 0,
      hourDivideNum: currentWorkRule.workHours,
    }).day

    const {grantList = [], consumeList = []} = yukyuAgg ?? {}

    return {
      csvTableRow: [
        {cellValue: code},
        {
          cellValue: isDev ? (
            <T_LINK {...{href: HREF(`/yoshinari/user/${user?.id}?g_userId=4`, {}, query)}}>{user?.name}</T_LINK>
          ) : (
            name
          ),
        },
        {cellValue: hiredAt ? formatDate(hiredAt) : '-'},
        {cellValue: hiredAt ? `${workYear}年${restMonth}ヶ月` : '-'},
        {
          cellValue: (
            <section>
              <BasicModal {...{btnComponent: <div className={`t-link`}>履歴</div>}}>
                <small>付与履歴</small>
                <HisotryTable
                  {...{
                    user,
                    hisotryList: grantList.map(d => {
                      return {date: d.grantedAt, mins: d.mins}
                    }),
                  }}
                />
              </BasicModal>
            </section>
          ),
        },
        {
          cellValue: (
            <section>
              <BasicModal {...{btnComponent: <div className={`t-link`}>履歴</div>}}>
                <small>取得履歴</small>
                <HisotryTable
                  {...{
                    user,
                    hisotryList: consumeList.map(d => {
                      return {date: d.consumedDate, mins: d.totalConsumedMinutes}
                    }),
                  }}
                />
              </BasicModal>
              {/* <small>取得履歴</small> */}
            </section>
          ),
        },
        ...usageHistoryTdList.map(d => {
          const isZero = d === 0

          return {cellValue: isZero ? 0 : Calc.round(d, 4, `ceil`).toFixed(4), style: {textAlign: `right`}}
        }),
        {cellValue: Calc.round(remainYukyuInDays, 4, `ceil`).toFixed(4), style: {textAlign: `right`}},
      ],
    } as csvTableRow
  })

  return (
    <Padding>
      <NewDateSwitcher {...{monthOnly: true}} />
      <TableWrapper className={`mx-auto max-h-[70vh] max-w-[95vw] text-center  shadow-sm`}>
        <TableBordered {...{size: `lg`}}>
          {CsvTable({
            headerRecords,
            bodyRecords,
            stylesInColumns: {},
          }).ALL()}
        </TableBordered>
      </TableWrapper>
    </Padding>
  )
}

const HisotryTable = ({user, hisotryList}) => {
  return (
    <div>
      <TableWrapper className={`   border-black `}>
        <TableBordered {...{size: `lg`}}>
          <thead>
            <tr>
              <th>日付</th>
              <th>日数</th>
            </tr>
          </thead>
          <tbody>
            {hisotryList.map((d, rowIdx) => {
              const {rules} = YoshinariUserClass.getUserWorkRules({user: user, today: d.date})
              const {workHours} = rules
              return (
                <tr key={rowIdx} className={`text-sm leading-4 text-gray-600`}>
                  <td className={`w-[100px]`}>{formatDate(d.date, 'YYYY-MM-DD')}</td>
                  <td className={`w-[80px]`}>
                    {Calc.round(TimeClass.convertMin({mins: d.mins, hourDivideNum: workHours}).day, 4, `ceil`).toFixed(4)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TableBordered>
      </TableWrapper>
    </div>
  )
}
