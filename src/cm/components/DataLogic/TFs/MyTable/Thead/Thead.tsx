import {Kado, ThDisplayJSX} from 'src/cm/components/DataLogic/TFs/MyTable/Thead/thead-methods'

import {funcOrVar} from 'src/cm/lib/methods/common'
import React, {CSSProperties} from 'react'
import {colType, MyTableType} from '@cm/types/types'
import {TableConfigPropsType} from 'src/cm/components/DataLogic/TFs/MyTable/TableConfig'

import {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobalOrigin'

type TheadPropsType = {
  myTable: MyTableType
  columns: colType[][]
  useGlobalProps: useGlobalPropType
}

const Thead = React.memo((props: {ClientProps2; TableConfigProps: TableConfigPropsType; TheadProps: TheadPropsType}) => {
  const {TableConfigProps, TheadProps, ClientProps2} = props

  const {myTable, columns} = TheadProps
  const RowSpanForSingleData = columns?.length
  const tableColumns = columns?.filter(cols => {
    const hasTd = cols.reduce((prev, col) => prev || !col?.td?.hidden, false)
    return hasTd
  })

  const {useGlobalProps} = TheadProps
  const {width, addQuery} = useGlobalProps

  const headerCols = tableColumns.flat().filter(col => !col?.td?.withLabel)

  if (headerCols.length === 0) {
    return <></>
  }

  return (
    <>
      <thead>
        {tableColumns.map((cols, rowIdx) => {
          return (
            <tr key={rowIdx} {...{}}>
              {rowIdx === 0 && (
                <Kado
                  {...{
                    rowSpan: RowSpanForSingleData,
                    colSpan: 1,
                  }}
                >
                  <></>
                </Kado>
              )}

              {cols
                ?.filter(col => !col?.td?.hidden)
                .map((col, columnIdx: number) => {
                  const rowSpan = col?.td?.rowSpan
                  const colSpan = col?.td?.colSpan
                  const thStyle: CSSProperties = {
                    ...funcOrVar(col.td?.style),
                    ...funcOrVar(col?.th?.style),
                    ...{height: 'fit-content', verticalAlign: 'top'},
                  }

                  return (
                    <th
                      key={`${col?.id}_${columnIdx}`}
                      {...{
                        rowSpan,
                        colSpan,
                        style: thStyle,
                      }}
                    >
                      <ThDisplayJSX {...{width, col}} />
                    </th>
                  )
                })}
            </tr>
          )
        })}
      </thead>
    </>
  )
})

export default Thead
