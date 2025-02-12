'use client'
import React from 'react'

import {CssString} from '@components/styles/cssString'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

export default function WorkRecordTable({widthProps, WorkSheetTableRecords}) {
  return (
    <TableWrapper
      {...{style: {margin: `auto`, ...widthProps}}}
      className={`mx-auto  w-fit border-none border-opacity-0  text-center  shadow-sm [&_td]:!min-w-[70px] ${CssString.table.paddingTd}`}
    >
      <TableBordered>
        {CsvTable({headerRecords: WorkSheetTableRecords.headerRecords, bodyRecords: WorkSheetTableRecords.bodyRecords}).ALL()}
      </TableBordered>
    </TableWrapper>
  )
}
