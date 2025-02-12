'use client'

import {TsConstructionClass} from '@app/(apps)/tsukurunger/(models)/TsConstructionClass'
import {GenbaDetailInfoSection} from '@app/(apps)/tsukurunger/(pages)/daily/[tsConstructionId]/expense/ExpenseCC'

import {C_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import React, {useEffect, useState} from 'react'

export default function ProgressCC({TsConstruction}) {
  const TsConstructionCl = new TsConstructionClass(TsConstruction)

  const [tsConstructionDiscountList, settsConstructionDiscountList] = useState<any>()
  useEffect(() => {
    const init = async () => {
      const args = {where: {tsConstructionId: TsConstruction.id}}
      const {result} = await fetchUniversalAPI(`tsConstructionDiscount`, `findMany`, args)
      settsConstructionDiscountList(result)
    }
    init()
  }, [])

  if (!tsConstructionDiscountList) return <PlaceHolder />
  const {detailCsvTableProps, summaryCsvTableProps} = TsConstructionCl.getProgressSheetRecords({
    tsConstructionDiscountList,
    settsConstructionDiscountList,
  })

  return (
    <div className={`p-4`}>
      <C_Stack>
        <div>
          <h1>出来高内訳書</h1>
        </div>
        <GenbaDetailInfoSection {...{TsConstruction}} />

        <TableWrapper className={`border-sub-main    w-fit max-w-[90vw] `}>
          <TableBordered>
            {CsvTable({
              headerRecords: summaryCsvTableProps.headerRecords,
              bodyRecords: summaryCsvTableProps.bodyRecords,
              stylesInColumns: {},
            }).ALL()}

            {CsvTable({
              headerRecords: detailCsvTableProps.headerRecords,
              bodyRecords: detailCsvTableProps.bodyRecords,
              stylesInColumns: {},
            }).ALL()}
          </TableBordered>
        </TableWrapper>
      </C_Stack>
    </div>
  )
}
