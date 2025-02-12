'use client'

import {formatDate} from '@class/Days'
import {bodyRecordsType, CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {LoadingLink} from '@components/styles/common-components/links'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {HREF} from '@lib/methods/urls'
import {TsNippo} from '@prisma/client'

import React from 'react'

export type nippo = TsNippo & {sum: number}
export default function nippoHistoryCC({GenbaWithNippoInPeriodList}) {
  const {query} = useGlobal()
  const headerRecords: bodyRecordsType = [
    {
      csvTableRow: [
        //
        {cellValue: `現場名`},
        {cellValue: `工事名`},
        {cellValue: `日付`},
        // {cellValue: `金額`},
      ],
    },
  ]

  const bodyRecords: bodyRecordsType = GenbaWithNippoInPeriodList.map(genba => {
    const constructionRows = genba.TsNippo.map((nippo: nippo) => {
      const NippoLink = () => {
        const dateStr = formatDate(nippo.date)
        const href = HREF(`/tsukurunger/daily/${genba.id}/input?from=${dateStr}`, {}, query)
        return (
          <LoadingLink className={`t-link`} href={href}>
            {dateStr}
          </LoadingLink>
        )
      }
      return {
        csvTableRow: [
          //
          {cellValue: genba.TsMainContractor?.name},
          {cellValue: genba.name},
          {cellValue: <NippoLink />},
          // {cellValue: nippo.sum},
        ],
      }
    })

    return constructionRows
  }).flat()

  return (
    <div>
      <TableWrapper>
        <TableBordered>{CsvTable({headerRecords, bodyRecords, stylesInColumns: {}}).ALL()}</TableBordered>
      </TableWrapper>
    </div>
  )
}
