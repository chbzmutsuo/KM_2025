'use client'
import dynamic from 'next/dynamic'
import React, {useRef} from 'react'
const Thead = dynamic(() => import('src/cm/components/DataLogic/TFs/MyTable/Thead/Thead'))

import useMyTableParams from 'src/cm/components/DataLogic/TFs/MyTable/useMyTableParams'

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {DndContext, closestCenter} from '@dnd-kit/core'

import {myTableDefault} from 'src/cm/constants/defaults'

import {cl} from 'src/cm/lib/methods/common'
import {Padding, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import useTrActions from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/useTrActions'

import TableConfig, {TableConfigPropsType} from 'src/cm/components/DataLogic/TFs/MyTable/TableConfig'

import {ClientPropsType2} from 'src/cm/components/DataLogic/TFs/PropAdjustor/PropAdjustor'

import MyPagination from '@components/DataLogic/TFs/MyTable/TableHandler/Pagination/MyPagination'
import {Z_INDEX} from '@lib/constants/constants'
import {TableWrapper} from '@components/styles/common-components/Table'
import {useElementScrollPosition} from '@hooks/scrollPosition/useElementScrollPosition'
import Tbody from '@components/DataLogic/TFs/MyTable/TableHandler/Tbody/Tbody'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

const MyTable = React.memo((props: {ClientProps2: ClientPropsType2}) => {
  let ClientProps2 = props.ClientProps2

  ClientProps2 = {
    ...ClientProps2,
    myTable: {...myTableDefault, ...ClientProps2.myTable},
    useGlobalProps: ClientProps2?.useGlobalProps,
  }

  const {editType} = ClientProps2

  const {columns, dataModelName, setformData, myTable, formData, useGlobalProps, records, setrecords, deleteRecord} = ClientProps2

  const {
    columnCount,
    tableStyleRef,
    tableStyle,
    methods: {getPaginationProps, handleDragEndMemo},
    dndProps: {items, sensors},
  } = useMyTableParams({columns, dataModelName, useGlobalProps, myTable, records, setrecords})

  const {RowActionButtonComponent} = useTrActions({
    ...{records, setrecords, deleteRecord, setformData},
    ...{columns, editType, myTable, dataModelName, useGlobalProps},
  })
  const recordCount = records.length

  const {configPosition = `top`} = myTable ?? {}

  const TableConfigProps: TableConfigPropsType = {
    ...{columns, myTable, dataModelName, useGlobalProps},
    ...{records, setformData},
    ...{configPosition, getPaginationProps, columnCount},
  }

  const {showHeader} = myTable ?? {}
  //columnsからrowを取得
  const rows = ClientProps2.columns
    .filter(cols => {
      return cols.reduce((prev, col) => prev || !col?.td?.hidden, false)
    })
    .map(row => {
      return row.map(col => {
        const withLabel = showHeader ? false : true

        return {...col, td: {...col.td, withLabel}}
      })
    })

  const tableId = ['table', dataModelName, myTable?.tableId].join(`_`)
  const elementRef = useRef<HTMLDivElement>(null)

  // テーブルのスクロール位置を保存
  useElementScrollPosition({
    elementRef,
    scrollKey: tableId,
  })

  return (
    <div>
      {records.length === 0 ? (
        <Padding {...{style: myTable?.style}}>
          <PlaceHolder>データが見つかりません</PlaceHolder>
        </Padding>
      ) : (
        <>
          <MainTable
            {...{
              myTable,
              columns,
              elementRef,
              tableStyleRef,
              tableStyle,
              sensors,
              handleDragEndMemo,
              items,
              showHeader,
              TableConfigProps,
              useGlobalProps,
              ClientProps2,
              rows,
              getPaginationProps,
              RowActionButtonComponent,
            }}
          />
        </>
      )}

      <section
        className={`sticky bottom-2 mx-auto mt-4   px-1 pb-2   md:scale-[1.25]`}
        style={{
          maxWidth: `80%`,
          zIndex: Z_INDEX.thead,
        }}
      >
        <div className={cl(`rounded bg-white/70`, ` mx-auto  w-fit   px-1  py-0.5  `)}>
          <R_Stack className={`  w-fit  justify-center gap-y-0`}>
            <TableConfig {...{TableConfigProps, ClientProps2}} />
            <MyPagination
              {...{
                totalCount: ClientProps2.totalCount,
                recordCount,
                myTable,
                getPaginationProps,
                useGlobalProps,
                records,
              }}
            />
          </R_Stack>
        </div>
      </section>
    </div>
  )
})

export default MyTable

const MainTable = ({
  myTable,
  columns,
  elementRef,
  tableStyleRef,
  tableStyle,
  sensors,
  handleDragEndMemo,
  items,
  showHeader,
  TableConfigProps,
  useGlobalProps,
  ClientProps2,
  rows,
  getPaginationProps,
  RowActionButtonComponent,
}) => {
  return (
    <>
      {typeof myTable?.header === 'function' && myTable?.header()}
      <section className={` bg-error-man  bg-inherit  `}>
        <div className={` t-paper  ${myTable?.showHeader ? '!p-0' : `!p-3`} relative  `}>
          <TableWrapper ref={elementRef} style={{...tableStyle}}>
            {myTable?.caption && <div>{myTable?.caption}</div>}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndMemo}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div>
                  <table
                    style={showHeader ? {} : {borderCollapse: `separate`, borderSpacing: `0px  6px`}}
                    ref={tableStyleRef}
                    className={cl(myTable?.className)}
                  >
                    {myTable?.showHeader && (
                      <Thead {...{TableConfigProps, TheadProps: {myTable, columns, useGlobalProps}, ClientProps2}} />
                    )}

                    <Tbody
                      {...{
                        ClientProps2,
                        rows,
                        tbodyRowParams: {getPaginationProps, RowActionButtonComponent},
                      }}
                    />
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          </TableWrapper>
        </div>
      </section>
    </>
  )
}
