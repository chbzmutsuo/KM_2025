import {anyObject} from '@cm/types/types'

import {Downloader} from '@components/styles/common-components/CsvTable/CsvDownloader'
import {CsvTableBody} from '@components/styles/common-components/CsvTable/CsvTableBody'
import {CsvTableHead} from '@components/styles/common-components/CsvTable/CsvTableHead'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {props} from '@components/styles/common-components/type'

import React, {CSSProperties} from 'react'
export type recordsType = {
  headerRecords?: bodyRecordsType
  bodyRecords?: bodyRecordsType
  records?: bodyRecordsType
}
export type CsvTableProps = {
  stylesInColumns?: stylesInColumns

  SP?: boolean
  csvOutput?: {
    fileTitle: string
    dataArranger?: (props: recordsType) => anyObject[]
  }
} & recordsType

export const convertRecords = (props: recordsType) => {
  const {records} = props
  let {headerRecords, bodyRecords} = props
  if (records) {
    headerRecords = [records[0]].map(row => {
      return {
        ...row,
        csvTableRow: (row?.csvTableRow ?? []).map(d => {
          return {
            //
            ...d,
            cellValue: d.label,
          }
        }),
      }
    })
    bodyRecords = records.map(row => {
      return {
        ...row,
        csvTableRow: (row?.csvTableRow ?? []).map(d => {
          return {
            ...d,
            label: undefined,
          }
        }),
      }
    })
  }

  return {
    ...props,
    headerRecords,
    bodyRecords,
  }
}

export const CsvTable = (props: CsvTableProps) => {
  props = convertRecords(props)

  if (props.SP) {
    const {headerRecords = []} = props
    const {bodyRecords = []} = props

    const rowCount = Math.max(...headerRecords.map(d => d.csvTableRow.length))
    const bodyWithHeader = new Array(rowCount).fill(null).map((_, rowIdx) => {
      const headerCols = headerRecords
        .map((d, colIdx) => {
          const cols = d.csvTableRow

          const findTheCol = cols[rowIdx] ?? null

          if (findTheCol?.colSpan) {
            d.csvTableRow.splice(rowIdx + 1, 0, ...new Array(findTheCol.colSpan - 1).fill(null))
          }

          if (findTheCol) {
            return {...findTheCol, rowSpan: findTheCol?.colSpan, colSpan: 1}
          }
        })
        .filter(Boolean)

      const body = bodyRecords.map(d => d.csvTableRow[rowIdx])

      return {
        csvTableRow: [...headerCols, ...body],
      }
    }) as bodyRecordsType

    const ALL = () => {
      return (
        <>
          <CsvTableHead {...props} headerRecords={[]} />
          <CsvTableBody {...props} bodyRecords={bodyWithHeader} />
        </>
      )
    }
    //
    return {
      WithWrapper: (
        props?: props & {
          size?: `sm` | `base` | `lg` | `xl`
        }
      ) => {
        return (
          <TableWrapper {...props}>
            <TableBordered {...{size: props?.size}}>{ALL()}</TableBordered>
          </TableWrapper>
        )
      },
      ALL,
      Thead: () => <CsvTableHead {...props} headerRecords={[]} />,
      Tbody: () => <CsvTableBody {...props} bodyRecords={bodyWithHeader} />,
      Downloader: () => <Downloader {...props} />,
    }
  }

  const ALL = () => {
    return (
      <>
        <CsvTableHead {...props} />
        <CsvTableBody {...props} />
      </>
    )
  }

  return {
    WithWrapper: (
      props?: props & {
        size?: `sm` | `base` | `lg` | `xl`
      }
    ) => {
      return (
        <TableWrapper {...props}>
          <TableBordered {...{size: props?.size}}>{ALL()}</TableBordered>
        </TableWrapper>
      )
    },
    ALL,
    Thead: () => <CsvTableHead {...props} />,
    Tbody: () => <CsvTableBody {...props} />,
    Downloader: () => <Downloader {...props} />,
  }
}

export type trTdProps = {
  rowSpan?: number
  colSpan?: number
  className?: string
  style?: CSSProperties
  onClick?: any
}
export type csvTableCol = {cellValue: any; cellValueRaw?: any; label?: any} & trTdProps
export type csvTableRow = trTdProps & {csvTableRow: csvTableCol[]}
export type bodyRecordsType = csvTableRow[]
export type stylesInColumns = {
  [key: number]: {
    style?: CSSProperties
    className?: string
  }
}
