'use client'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import useGlobal from '@hooks/globalHooks/useGlobal'
import React from 'react'

export default function UserMonthSummary(props: {widthProps; UserCl: YoshinariUserClass; days}) {
  const {SP} = useGlobal()
  const {UserCl, days} = props

  const startOfMonth = days[0]

  const {rules} = YoshinariUserClass.getUserWorkRules({user: UserCl.user, today: startOfMonth})
  const {headerRecords, bodyRecords} = UserCl.getTableRecords({days}).getMonthlySummaryRecords({rules})

  return (
    <TableWrapper className={` [&_td]:!p-1 [&_td]:!px-2.5`} {...{style: {...props.widthProps}}}>
      <TableBordered>
        {CsvTable({headerRecords: headerRecords, bodyRecords: bodyRecords, stylesInColumns: {}, SP}).ALL()}
      </TableBordered>
    </TableWrapper>
  )
}
