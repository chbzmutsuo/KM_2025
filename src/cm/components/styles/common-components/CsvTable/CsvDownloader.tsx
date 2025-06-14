'use client'

import {R_Stack} from '@components/styles/common-components/common-components'
import {CsvTableProps} from '@components/styles/common-components/CsvTable/CsvTable'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {CSVLink} from 'react-csv'

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
  const linkRef = useRef<any>(null)
  const {headerRecords, bodyRecords, csvOutput} = props
  const [csvDataArr, setcsvDataArr] = useState<any[]>([])

  const initalData = async () => {
    const dataArrangeFunc = csvOutput?.dataArranger ?? defaultDataArranger
    const csvDataArr = await dataArrangeFunc(headerRecords, bodyRecords)
    setcsvDataArr(csvDataArr)
  }
  const linkId = useMemo(() => `csv-link-${Date.now()}`, [])

  const outputCsv = useCallback(() => {
    if (csvDataArr.length > 0 && linkRef.current) {
      const link = document.getElementById(linkId)
      if (link) {
        link.click()
        alert('CSVファイルをダウンロードしました')
      }
    }
  }, [csvDataArr, linkId])

  useEffect(() => {
    if (csvDataArr.length > 0) {
      outputCsv()
    }
  }, [csvDataArr])

  if (!bodyRecords || bodyRecords.length === 0) return null

  if (csvOutput) {
    return (
      <R_Stack>
        <button onClick={initalData} className={`t-link`} type="button">
          CSV
        </button>
        <CSVLink id={linkId} ref={linkRef} data={csvDataArr} filename={`${props.csvOutput?.fileTitle}.csv`} />
      </R_Stack>
    )
  } else {
    return null
  }
}
