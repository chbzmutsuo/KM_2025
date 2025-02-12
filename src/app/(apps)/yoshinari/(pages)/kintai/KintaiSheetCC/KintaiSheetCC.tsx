'use client'
import React, {CSSProperties} from 'react'

import {Days, toUtc} from '@class/Days'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import {YoshinariUser, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import UserMonthSummary from '@app/(apps)/yoshinari/(parts)/User/UserMonthSummary'
import {userYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'

import useGlobal from '@hooks/globalHooks/useGlobal'
import WorkRecordTable from '@app/(apps)/yoshinari/(pages)/kintai/KintaiSheetCC/WorkRecordTable'
import {WorkRules} from '@app/(apps)/yoshinari/(pages)/kintai/KintaiSheetCC/WorkRules'
import {monthDatumOptions} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'

export default function KintaiSheetCC(props: {
  yukyuGroupedBy: userYukyuAgg[]
  query
  YoshinariUser: YoshinariUser
  whereQuery: {gte: Date; lte: Date}
}) {
  const {width} = useGlobal()
  const {yukyuGroupedBy, query, YoshinariUser} = props

  const {firstDayOfMonth, lastDayOfMonth, days} = Days.getMonthDatum(toUtc(query.month), monthDatumOptions)

  const UserCl = new YoshinariUserClass(YoshinariUser)
  UserCl.takeInYukyuAgg({yukyuGroupedBy})

  const {rules} = YoshinariUserClass.getUserWorkRules({user: UserCl.user, today: days[0]})

  const WorkSheetTableRecords = UserCl.getTableRecords({days}).getKintaiTableRecords()

  const widthProps: CSSProperties = {width: 1200, maxWidth: width * 0.95}

  return (
    <div {...{style: {...widthProps}}}>
      <C_Stack className={`items-center gap-10 p-2 `}>
        <section>
          <h2>月、ユーザー切り替え</h2>
          <R_Stack className={`w-full max-w-[90vw] justify-between`}>
            <section className={`p-1 shadow-sm`}>
              <NewDateSwitcher {...{monthOnly: true, additionalCols: [{id: `g_userId`, label: `ユーザー`, forSelect: {}}]}} />
            </section>
            <section>
              <WorkRules {...{rules}} />
            </section>
          </R_Stack>
        </section>

        <section>
          <h2>月間サマリー</h2>
          <UserMonthSummary {...{widthProps, UserCl, days}} />
        </section>
        <section>
          <h2>月間明細</h2>
          <WorkRecordTable {...{widthProps, WorkSheetTableRecords}} />
        </section>
      </C_Stack>
    </div>
  )
}
