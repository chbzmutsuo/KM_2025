'use client'

import {Page, View, Document, Text} from '@react-pdf/renderer'

import React from 'react'

import {ReactPdfStyles, Table, Td, Tr} from '@hooks/usePdfGenerator'
import {bodyRecordsType} from '@components/styles/common-components/CsvTable/CsvTable'

import {getHeaders, topBoldBorder} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Pdf/constants'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'

import {addColsStyle, initOptionData, separateNippo} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Pdf/lib'

export default function NippoFormPdfDocumentVer2({Genba}) {
  const tableStyle = {
    // height: 800,
    margin: `auto`,
    width: 560,
    border: `2px solid black`,
    borderRightWidth: `2px`,
    borderBottomWidth: `2px`,
    borderCollapse: `collapse`,
    fontSize: 7,
  }

  // [
  //   "totalCost",
  //   "date",
  //   "MidTsNippoUser",
  //   "MidTsNippoTsRegularSubcontractor",
  //   "MidTsNippoTsSubcontractor",
  //   "MidTsNippoTsMachinery",
  //   "MidTsNippoTsMaterial",
  //   "MidTsNippoTsWorkContent",
  //   "TsNippoRemarks"
  // ]

  const NippoOnDay = Genba?.TsNippo?.[0]
  const today = NippoOnDay?.date

  let {data: AccumulatedNippoToToday = []} = usefetchUniversalAPI_SWR(`tsNippo`, `findMany`, {
    where: {tsConstructionId: Genba.id, date: {lte: today}},
    include: QueryBuilder.getInclude({}).tsNippo.include,
  } as Prisma.TsNippoFindManyArgs)

  AccumulatedNippoToToday = AccumulatedNippoToToday.filter(d => new TsNippo(d).filterActiveNippo())
  const {NippoOnTheDate, PreviousNippo} = separateNippo({today, AccumulatedNippoToToday})
  const todayNippoData = initOptionData({
    NippoList: NippoOnTheDate ? [NippoOnTheDate] : [],
  })

  const {recordsByOption, rowCounts} = initOptionData({
    NippoList: AccumulatedNippoToToday,
  })

  const priceSumToday = NippoOnTheDate ? new TsNippo(NippoOnTheDate).getTotalPrice().sum : 0
  const PriceSumAccumulated = AccumulatedNippoToToday.reduce((acc, d) => {
    const price = new TsNippo(d).getTotalPrice().sum
    return acc + price
  }, 0)

  const headers = getHeaders({NippoOnDay, TsConstruction: Genba, priceSumToday, PriceSumAccumulated})

  const tsukurungerTotal = [0, 0, 0, 0, 0, 0]
  const tbodyRecords: bodyRecordsType = [
    {csvTableRow: headers.firstRow},
    {csvTableRow: headers.secondRow},
    {csvTableRow: headers.thirdRow_WorkContentAndPeople},
    {csvTableRow: headers.thirdRow_WorkContentAndPeople_2},

    ...new Array(rowCounts.workContentAndPeople).fill(``).map((_, rowIdx) => {
      const styles = headers.thirdRow_WorkContentAndPeople_2.map(d => d.style)
      const borderTopStyle = rowIdx === 0 ? topBoldBorder : {}
      const todayWorkContentRow = todayNippoData?.recordsByOption[`tsWorkContent`].find(
        d => d.master.id === recordsByOption[`tsWorkContent`][rowIdx]?.master?.id
      )
      const workContentRow = recordsByOption[`tsWorkContent`][rowIdx]



      const workContentCols = [
        //作業内容
        {cellValue: workContentRow?.master?.part, style: borderTopStyle}, //当日人数
        {cellValue: workContentRow?.master?.name, style: borderTopStyle}, //当日時間
        {cellValue: workContentRow?.master?.unit, style: borderTopStyle}, //単価
        {cellValue: todayWorkContentRow?.count, style: borderTopStyle}, //当日金額
        {cellValue: todayWorkContentRow?.sum, style: borderTopStyle}, //累計時間
        {cellValue: workContentRow?.count, style: borderTopStyle}, //累計金額
        {cellValue: workContentRow?.sum, style: borderTopStyle}, //常用業者名/名前
      ]

      let peopleCols: any[] = []

      if (rowIdx < Number(recordsByOption[`user`].length)) {
        //ツクルンジャー明細

        const todayUserWork = todayNippoData?.recordsByOption[`user`].find(
          d => d.master.id === recordsByOption[`user`][rowIdx]?.master?.id
        )
        const userRow = recordsByOption[`user`][rowIdx]
        peopleCols = [
          //作業員
          {cellValue: todayUserWork?.dataCount ?? '', style: borderTopStyle}, //当日人数
          {cellValue: todayUserWork?.count ?? '', style: borderTopStyle}, //当日時間
          {cellValue: todayUserWork?.count ? 25000 : '', style: borderTopStyle}, //単価
          {cellValue: todayUserWork?.sum ?? '', style: borderTopStyle}, //当日金額
          {cellValue: userRow?.count, style: borderTopStyle}, //累計時間
          {cellValue: userRow?.sum, style: borderTopStyle}, //累計金額
          {cellValue: userRow?.master?.name, style: borderTopStyle}, //常用,style:borderTopStyle業者名/名前
        ]

        peopleCols.forEach((d, idx) => {
          if (idx <= 5) {
            tsukurungerTotal[idx] += Number(d.cellValue)
          }
        })
      } else if (rowIdx === recordsByOption[`user`].length) {
        //ツクルンジャー合計
        peopleCols = [...tsukurungerTotal.map(d => ({cellValue: d})), {cellValue: `ツクルンジャー合計`}]
      } else {
        //常用下請け明細
        const index = rowIdx - recordsByOption[`user`].length - 1
        const borderTopStyle = index === 0 ? topBoldBorder : {}

        const userRow = recordsByOption[`tsRegularSubcontractor`][index]

        const todayUserWork = todayNippoData?.recordsByOption[`tsRegularSubcontractor`].find(
          d => d.master.id === userRow?.master?.id
        )

        peopleCols = [
          {cellValue: todayUserWork?.dataCount, style: borderTopStyle}, //当日人数
          {cellValue: todayUserWork?.count, style: borderTopStyle}, //当日時間
          {cellValue: todayUserWork?.master?.unitPrice, style: borderTopStyle}, //単価
          {cellValue: todayUserWork?.sum, style: borderTopStyle}, //当日金額
          {cellValue: userRow?.count, style: borderTopStyle}, //累計時間
          {cellValue: userRow?.sum, style: borderTopStyle}, //累計金額
          {cellValue: userRow?.master?.name, style: borderTopStyle}, //常用業者名/名前
        ]
      }

      const cols = addColsStyle({
        styles,
        rowIdx,
        cols: [...workContentCols, ...peopleCols],
        rowCount: rowCounts.workContentAndPeople,
      })
      return {csvTableRow: [...cols]}
    }),

    //材料
    {csvTableRow: headers.fourthRow_Material},
    ...new Array(rowCounts.material).fill(``).map((_, rowIdx) => {
      const styles = headers.fourthRow_Material.map(d => d.style)
      const Today_Material = todayNippoData?.recordsByOption[`tsMaterial`].find(
        d => d.master.id === recordsByOption[`tsMaterial`][rowIdx]?.master?.id
      )
      const theMaterial = recordsByOption[`tsMaterial`][rowIdx]
      const MaterialCols = [
        {cellValue: `材料`}, //材料
        {cellValue: theMaterial?.master?.name}, //品名
        {cellValue: theMaterial?.master?.remarks}, //摘要
        {cellValue: Today_Material?.count}, //数量
        {cellValue: Today_Material?.sum}, //金額
        {cellValue: theMaterial?.count}, //累計
        {cellValue: theMaterial?.sum}, //累計金額
        {cellValue: theMaterial?.master?.vendor}, //業者名
        {cellValue: ''}, //備考
      ]

      const cols = addColsStyle({
        styles,
        rowIdx,
        cols: MaterialCols,
        rowCount: rowCounts.material,
      })

      return {csvTableRow: cols}
    }),

    //機械
    {csvTableRow: headers.fifthRow_Machine},

    ...new Array(rowCounts.machine).fill(``).map((_, rowIdx) => {
      const styles = headers.fifthRow_Machine.map(d => d.style)

      const theMachine = recordsByOption[`tsMachinery`][rowIdx]
      const Today_Machine = todayNippoData?.recordsByOption[`tsMachinery`].find(d => d.master.id === theMachine?.master?.id)

      const tsNippoRemarks = recordsByOption[`tsNippoRemarks`][rowIdx]

      // const RemarksOnDate = NippoOnTheDate?.TsNippoRemarks
      // const remarks = RemarksOnDate?.[rowIdx]

      const MachineCols = [
        {cellValue: `機械`, style: {borderTopOpacity: `white`}},
        {cellValue: theMachine?.master?.name},
        {cellValue: theMachine?.master?.vendor},
        {cellValue: Today_Machine?.count},
        {cellValue: Today_Machine?.master?.unitPrice},
        {cellValue: Today_Machine?.sum},
        {cellValue: theMachine?.count},
        {cellValue: theMachine?.sum},
        {cellValue: theMachine?.remarks},
        {cellValue: tsNippoRemarks?.master?.name},
        {cellValue: tsNippoRemarks?.sum},
        // {
        //   cellValue: (
        //     <View>
        //       <Text>
        //         {tsNippoRemarks?.master?.name} {tsNippoRemarks ? `(${DH.toPrice(tsNippoRemarks?.sum)})` : ''}
        //       </Text>
        //     </View>
        //   ),
        // },
      ]

      const cols = addColsStyle({
        styles,
        rowIdx,
        cols: MachineCols,
        rowCount: rowCounts.machine,
      })

      return {csvTableRow: cols}
    }),

    {csvTableRow: headers.sixthRow_Comment},
    {csvTableRow: headers.seventhRow_Comment},
    {csvTableRow: []},
  ]

  return (
    <Document style={ReactPdfStyles.document}>
      <Page style={{padding: 10}} size="A4" orientation="portrait">
        <View>
          <Table {...{style: tableStyle}}>
            {tbodyRecords.map((record, rowIdx) => {
              const {csvTableRow} = record
              return (
                <Tr key={rowIdx}>
                  {csvTableRow.map((cell, rowIdx) => {
                    const {cellValue} = cell
                    const style = cell.style as any
                    const children = typeof cellValue === `object` ? cellValue : <Text>{cellValue}</Text>
                    return (
                      <Td
                        key={rowIdx}
                        style={{
                          ...style,
                        }}
                      >
                        {children}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Table>
        </View>
      </Page>
    </Document>
  )
}
