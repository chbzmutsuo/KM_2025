'use client'

import {anyObject} from '@cm/types/types'
import {convertRecords, CsvTableProps} from '@components/styles/common-components/CsvTable/CsvTable'
import {CSVLink} from 'react-csv'

const defaultDataArranger = (headerRecords, bodyRecords) => {
  const header = headerRecords[headerRecords.length - 1].csvTableRow.map(d => d.cellValue)
  const csvDataArra: anyObject[] = bodyRecords.map((row, rowIdx) => {
    const colObj: anyObject = Object.fromEntries(
      row.csvTableRow.map((d, colIdx) => {
        const key = header[colIdx]
        return [key, d.cellValueRaw ?? d.cellValue]
      })
    )
    return colObj
  })

  return csvDataArra
}

export const Downloader = (props: CsvTableProps) => {
  props = convertRecords(props)
  const {headerRecords, bodyRecords, csvOutput} = props

  if (csvOutput) {
    const dataArrangeFunc = csvOutput.dataArranger ?? defaultDataArranger
    const csvDataArr = dataArrangeFunc(headerRecords, bodyRecords)

    return (
      <div className={`t-link py-1`}>
        <CSVLink data={csvDataArr} filename={`${props.csvOutput?.fileTitle}.csv`}>
          CSV
        </CSVLink>
      </div>
    )
  } else {
    return <></>
  }
}
