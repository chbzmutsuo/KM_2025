'use client'

import {TsConstructionClass} from '@app/(apps)/tsukurunger/(models)/TsConstructionClass'

import {DH} from '@class/DH'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {LabelValue} from '@components/styles/common-components/ParameterCard'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'

import React from 'react'
import {P_TsConstruction} from 'scripts/generatedTypes'

export default function ExpenseCC({TsConstruction}) {
  const TsConstructionCl = new TsConstructionClass(TsConstruction)
  const {headerRecords, bodyRecords} = TsConstructionCl.getExpenseSheetRecords()
  return (
    <div className={`p-4 `}>
      <C_Stack>
        <h1>原価計算書</h1>
        <GenbaDetailInfoSection {...{TsConstruction}} />

        <TableWrapper className={`border-sub-main  w-fit max-w-[90vw]  !text-start`}>
          <TableBordered>{CsvTable({headerRecords, bodyRecords, stylesInColumns: {}}).ALL()}</TableBordered>
        </TableWrapper>
      </C_Stack>
    </div>
  )
}

export const GenbaDetailInfoSection = ({TsConstruction}) => {
  const {TsMainContractor} = TsConstruction as P_TsConstruction
  return (
    <section>
      <C_Stack>
        <R_Stack>
          <div className={` border-b`}>
            <LabelValue {...{label: `お客様名`}}>
              <div>{TsMainContractor.name}</div>
            </LabelValue>
          </div>
          <div className={` border-b`}>
            <LabelValue {...{label: `現場名`}}>
              <div>{TsConstruction.name}</div>
            </LabelValue>
          </div>
        </R_Stack>
        <R_Stack>
          <div className={` border-b`}>
            <LabelValue {...{label: `住所`, styling: {styles: {wrapper: {width: `100%`}}}}}>
              <div>{`${TsConstruction.address1 ?? ''} ${TsConstruction.address2 ?? ''}`}</div>
            </LabelValue>
          </div>
        </R_Stack>
        <R_Stack>
          <div className={` border-b`}>
            <LabelValue {...{label: `請負金額`}}>
              <div>{DH.toPrice(TsConstruction.contractAmount) ?? 0}</div>
            </LabelValue>
          </div>
          <div className={` border-b`}>
            <LabelValue {...{label: `実行予算`}}>
              <div>{DH.toPrice(TsConstruction.budget) ?? 0}</div>
            </LabelValue>
          </div>
        </R_Stack>
      </C_Stack>
    </section>
  )
}
