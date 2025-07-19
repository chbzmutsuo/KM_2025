import {Downloader} from '@cm/components/styles/common-components/CsvTable/CsvDownloader'
import {CsvTableBody} from '@cm/components/styles/common-components/CsvTable/CsvTableBody'
import {CsvTableHead} from '@cm/components/styles/common-components/CsvTable/CsvTableHead'
import {TableBordered, TableWrapper} from '@cm/components/styles/common-components/Table'
import {htmlProps} from '@cm/components/styles/common-components/type'

import React, {CSSProperties} from 'react'
import {twMerge} from 'tailwind-merge'

export type ChunkedOptions = {
  enabled: boolean
  chunkSize?: number
  delay?: number
  autoStart?: boolean
  showProgress?: boolean
  showControls?: boolean
}

export type VirtualizedOptions = {
  enabled: boolean
  height?: string | number
  width?: string | number
  overscan?: number
}

export type trTdProps = {
  rowSpan?: number
  colSpan?: number
  className?: string
  style?: CSSProperties
  thStyle?: CSSProperties
  onClick?: any
}

export type csvTableCol = {
  cellValue: any
  cellValueRaw?: any
  label?: any
} & trTdProps

export type csvTableRow = trTdProps & {
  csvTableRow: csvTableCol[]
}

export type bodyRecordsType = csvTableRow[]

export type stylesInColumns = {
  [key: number]: {
    style?: CSSProperties
    className?: string
  }
}

export type CsvTableProps = {
  records: bodyRecordsType
  stylesInColumns?: stylesInColumns
  csvOutput?: {
    fileTitle: string
    dataArranger?: (records: bodyRecordsType) => Promise<any[]>
  }
  // 🔥 チャンク処理オプション（クライアント専用）
  chunked?: ChunkedOptions
  // 🔥 仮想化オプション（クライアント専用）
  virtualized?: VirtualizedOptions
}

/**
 * recordsからheaderとbodyを分離
 */
export const separateHeaderAndBody = (records: bodyRecordsType) => {
  if (!records || records.length === 0) {
    return {headerRecords: [], bodyRecords: []}
  }

  const headerRow = records[0]
  const bodyRows = records

  // ヘッダー用の変換：labelをcellValueに
  const headerRecords = [
    {
      ...headerRow,
      csvTableRow: headerRow.csvTableRow.map(col => ({
        ...col,
        cellValue: col.label || col.cellValue,
      })),
    },
  ]

  // ボディ用の変換：labelを除去
  const bodyRecords = bodyRows.map(row => ({
    ...row,
    csvTableRow: row.csvTableRow.map(col => ({
      ...col,
      label: undefined,
    })),
  }))

  return {headerRecords, bodyRecords}
}

/**
 * Server Component対応のCsvTable
 * チャンク処理・仮想化が不要な場合はそのまま使用可能
 *
 * @note チャンク処理が必要な場合は、CsvTableChunkedを直接使用してください
 * @note 仮想化が必要な場合は、CsvTableVirtualizedを直接使用してください
 */
export const CsvTable = (props: CsvTableProps) => {
  // 🔥 Server Componentではチャンク処理・仮想化をサポートしない
  if (props.chunked?.enabled) {
    console.warn('CsvTable: チャンク処理はServer Componentでは利用できません。CsvTableChunkedを使用してください。')
  }

  if (props.virtualized?.enabled) {
    console.warn('CsvTable: 仮想化はServer Componentでは利用できません。CsvTableVirtualizedを使用してください。')
  }

  // 🔥 通常のServer Component版
  return createCsvTableCore(props)
}

/**
 * Core CsvTable functionality (Server Component compatible)
 */
export const createCsvTableCore = (props: CsvTableProps) => {
  const {headerRecords, bodyRecords} = separateHeaderAndBody(props.records)

  const WithWrapper = (wrapperProps: htmlProps & {size?: `sm` | `base` | `lg` | `xl`}) => {
    return (
      <TableWrapper {...wrapperProps} {...{className: twMerge('max-h-[80vh] max-w-[90vw] mx-auto', wrapperProps.className)}}>
        <TableBordered {...{size: wrapperProps?.size}}>
          <CsvTableHead headerRecords={headerRecords} stylesInColumns={props.stylesInColumns} />
          <CsvTableBody bodyRecords={bodyRecords} stylesInColumns={props.stylesInColumns} />
        </TableBordered>
      </TableWrapper>
    )
  }

  return {
    WithWrapper,

    Thead: () => <CsvTableHead headerRecords={headerRecords} stylesInColumns={props.stylesInColumns} />,
    Tbody: () => <CsvTableBody bodyRecords={bodyRecords} stylesInColumns={props.stylesInColumns} />,
    Downloader: () => <Downloader records={props.records} csvOutput={props.csvOutput} />,
  }
}
