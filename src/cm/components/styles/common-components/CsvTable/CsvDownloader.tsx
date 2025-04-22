'use client'

import {R_Stack} from '@components/styles/common-components/common-components'
import {CsvTableProps} from '@components/styles/common-components/CsvTable/CsvTable'
import {useRef} from 'react'

const defaultDataArranger = (headerRecords, bodyRecords) => {
  const header = headerRecords[headerRecords.length - 1].csvTableRow.map(d => d.cellValue)
  const csvDataArra: any[] = bodyRecords.map((row, rowIdx) => {
    const colObj: any = Object.fromEntries(
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
  const linkRef = useRef<HTMLAnchorElement>(null)

  const {headerRecords, bodyRecords, csvOutput} = props
  const initalData = async () => {
    const dataArrangeFunc = csvOutput?.dataArranger ?? defaultDataArranger

    const csvDataArr = await dataArrangeFunc(headerRecords, bodyRecords)

    const header = headerRecords?.[headerRecords.length - 1].csvTableRow.map(d => d.cellValue)

    const toCsv = csvDataArr.map(row => {
      return Object.values(row).join(',')
    })

    const csvContent = [header, ...toCsv].join('\n')

    // BOMを追加してExcelで文字化けしないようにする
    const BOM = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([BOM, csvContent], {type: 'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    if (linkRef.current) {
      linkRef.current.href = url
      linkRef.current.download = `${props.csvOutput?.fileTitle}.csv`
      linkRef.current.click()
    }
  }

  if (bodyRecords?.length === 0) {
    return null
  }

  if (csvOutput) {
    return (
      <R_Stack>
        <div onClick={initalData}>CSV</div>
        <a ref={linkRef}></a>
        {/* {csvDataArr && (
          <CSVLink ref={linkRef} data={csvDataArr} filename={`${props.csvOutput?.fileTitle}.csv`}>
            ダウンロード
          </CSVLink>
        )} */}
      </R_Stack>
    )
  } else {
    return <></>
  }
}
