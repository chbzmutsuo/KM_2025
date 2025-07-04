'use client'
import React, {useMemo} from 'react'
import {TableSkelton} from '@components/utils/loader/TableSkelton'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import {ClientPropsType2} from '@components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import {UseRecordsReturn} from '@components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

// 分割されたコンポーネントをインポート
import {MyTableInfiniteScroll} from './MyTableInfiniteScroll'
import {MyTableControls} from './components/MyTableControls/MyTableControls'
import {useMyTableLogic} from './hooks/useMyTableLogic'
import {MainTable} from './components/MainTable'
import useLogOnRender from '@hooks/useLogOnRender'

// 型定義
interface MyTableProps {
  ClientProps2: ClientPropsType2 & {
    UseRecordsReturn?: UseRecordsReturn
  }
}

const MyTable = React.memo<MyTableProps>(props => {
  // 🔧 ロジックを分離したカスタムフックを使用
  const {ClientProps2, infiniteScrollData, tableData, searchData, styleData, elementRef} = useMyTableLogic(props)

  const {records, recordCount, totalCount, emptyDataStyle} = tableData

  const {isInfiniteScrollMode, setInfiniteScrollMode, fetchNextPage, hasMore} = infiniteScrollData

  const {SearchingStatusMemo} = searchData

  const {sectionStyle, TableConfigProps, mainTableProps, paginationProps} = styleData
  const mainTable = useMemo(() => <MainTable {...mainTableProps} />, [mainTableProps])
  useLogOnRender('')

  // 🔧 条件分岐による表示切り替え
  const renderTableContent = () => {
    if (records === null) {
      return (
        <div className="max-w-[90%] w-[300px] h-fit overflow-hidden">
          <TableSkelton />
        </div>
      )
    }

    if (records.length === 0) {
      return (
        <div style={emptyDataStyle}>
          <PlaceHolder>データが見つかりません</PlaceHolder>
        </div>
      )
    }

    // 🔧 無限スクロールモードの条件分岐
    if (isInfiniteScrollMode) {
      return (
        <MyTableInfiniteScroll
          {...{
            tableStyle: mainTableProps.tableStyle,
            recordCount,
            fetchNextPage,
            hasMore,
            totalCount,
            mainTableProps,
            paginationProps,
            sectionStyle,
          }}
        >
          {mainTable}
        </MyTableInfiniteScroll>
      )
    }

    return mainTable
  }

  return (
    <div>
      <div>
        {renderTableContent()}

        <MyTableControls
          {...{
            SearchingStatusMemo,
            TableConfigProps,
            ClientProps2,
            isInfiniteScrollMode,
            setInfiniteScrollMode,
            recordCount,
            totalCount,
            hasMore,
            mainTableProps,
            paginationProps,
            sectionStyle,
            getPaginationProps: mainTableProps.getPaginationProps,
            myTable: ClientProps2.myTable,
          }}
        />
      </div>
    </div>
  )
})

MyTable.displayName = 'MyTable'

export default MyTable
