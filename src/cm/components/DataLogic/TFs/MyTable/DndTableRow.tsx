import React, {useCallback} from 'react'

import {CSS} from '@dnd-kit/utilities'
import {useSortable} from '@dnd-kit/sortable'

import {tbodyParamsType} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/Tbody'

import {createRowColor, createTrClassName} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/Tbody-methods'

import {cl} from 'src/cm/lib/methods/common'
import {BodyLeftTh} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/BodyLeftTh'
import TableCell from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/TableCell/TableCell'
import {MyTableType} from '@cm/types/types'

export type DnDTableRowPropsType = {
  record: any
  ColumnsOnTheRow: any
  rowIdx: any
  recIdx: any
  showHeader?: boolean
}

const DnDTableRow = React.memo(
  (props: {
    myTable: MyTableType
    useGlobalProps
    formData
    dataModelName
    mutateRecords
    rows: any
    tbodyRowParams: tbodyParamsType
    DnDTableRowProps: DnDTableRowPropsType
    totalCount: number
  }) => {
    const {myTable, formData, DnDTableRowProps, tbodyRowParams, dataModelName, mutateRecords, rows, totalCount} = props
    const {SP} = props.useGlobalProps

    const {RowActionButtonComponent, getPaginationProps} = tbodyRowParams
    const {ColumnsOnTheRow, rowIdx, recIdx, record, showHeader} = DnDTableRowProps

    const {from} = getPaginationProps({totalCount})

    const rowColor = createRowColor({myTable, recIdx, record, rows})

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
      id: myTable?.['drag'] === false ? '' : record.id,
    })
    const dndStyle = {
      transform: CSS.Transform.toString(transform),
      transition,
      background: isDragging ? '#c2c2c2' : rowColor,
    }

    const allowDnd = myTable?.['drag']
    const dndProps = allowDnd ? {ref: setNodeRef, ...attributes, ...listeners, style: dndStyle} : undefined

    const recordIndex = record?.recordIndex || from + recIdx
    const recordId = record.id

    const TableCellCallBackProps = {
      dataModelName,
      mutateRecords,
      tbodyRowParams,
      DnDTableRowProps,
      dndStyle,
      rowColor,
    }
    const TableCellCallBack = useCallback(
      ({columnIdx, col}) => {
        return <TableCell {...TableCellCallBackProps} {...{TableCellProps: {columnIdx, col}}} />
      },
      [dndStyle]
    )

    return (
      <>
        <tr id={`tr-${recordId}`} className={cl(createTrClassName({myTable, record, formData}))}>
          {rowIdx === 0 && (
            <BodyLeftTh
              {...{
                showHeader,
                rowColor,
                rowIdx,
                rowSpan: rowIdx === 0 ? rows.length : undefined,
                colSpan: 1,
                dndProps,
                recordIndex,
              }}
            >
              <RowActionButtonComponent {...{record, myTable, rowColor, SP}} />
            </BodyLeftTh>
          )}

          {ColumnsOnTheRow?.filter(col => col?.td?.hidden !== true)?.map((col, columnIdx) => {
            return <TableCellCallBack key={columnIdx} {...{columnIdx, col, showHeader: myTable?.showHeader}} />
          })}
        </tr>
      </>
    )
  }
)

export default DnDTableRow
