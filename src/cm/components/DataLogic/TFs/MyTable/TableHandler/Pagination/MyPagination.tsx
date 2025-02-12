import {getPaginationPropsType} from 'src/cm/components/DataLogic/TFs/MyTable/useMyTableParams'

import {R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {useEffect} from 'react'
import {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobalOrigin'
import DataCountViewer from '@components/DataLogic/TFs/MyTable/TableHandler/Pagination/DataCountViewer'
import PaginationButtons from '@components/DataLogic/TFs/MyTable/TableHandler/Pagination/PaginationButtons'

export type PaginationPropType = {
  useGlobalProps: useGlobalPropType
  getPaginationProps: getPaginationPropsType
  recordCount
  myTable
  records
}

const MyPagination = (props: PaginationPropType) => {
  const {useGlobalProps, records, recordCount, myTable} = props

  const showPagination = myTable?.['pagination'] !== false && recordCount > 0

  if (showPagination) {
    return (
      <div className={`mx-auto w-fit  px-1 py-0.5 `}>
        <Main {...props} />
      </div>
    )
  } else {
    return <></>
  }
}
export default MyPagination

const Main = (props: PaginationPropType) => {
  const {useGlobalProps, getPaginationProps, records} = props

  const {query, addQuery} = useGlobalProps

  const {tableId, totalCount, page, skip, take, pageCount, from, to, pageKey, skipKey, takeKey, changePage} = getPaginationProps()

  const range = (start, end) => {
    const firstPage = end - start + 1
    if (isNaN(firstPage)) {
      return []
    }

    return [...Array(firstPage)]?.map((_, i) => start + i)
  }

  // paginationで典型的にみられる、最初と最後の3つのみの数値を残す仕組みを作って
  const array = range(1, pageCount)
  const activePage = array.find(number => String(number) === String(page))

  const noData = activePage === undefined && page > 1

  useEffect(() => {
    if (noData) {
      addQuery({
        ...query,
        [pageKey]: '',
        [skipKey]: '',
        [takeKey]: '',
      })
    }
  }, [query, activePage])

  if (noData) return <></>

  const partClasses = {
    inputGroupClass: 'row-stack gap-0   ',
    labelClass: ' text-responsive ',
    selectClass: ' onHover   w-[40px]   bg-gray-100  border rounded  ',
  }

  return (
    <div className={` items-end   gap-0.5  `}>
      <R_Stack className={` justify-center  gap-x-1 gap-y-0 rounded-lg bg-gray-100 px-0.5 `}>
        <section className={` w-fit   p-0.5 font-normal`}>
          <DataCountViewer {...{from, to, totalCount, partClasses}} />
        </section>

        {totalCount > take && (
          <section className={`w-fit p-0.5  font-normal`}>
            <PaginationButtons {...{array, changePage, page, partClasses, totalCount, pageCount}} />
          </section>
        )}
        {/* <section className={`w-fit p-0.5  font-normal`}>
          <DataPerPageSelector
            {...{
              take,
              countPerPage,
              changeDataPerPage,
              totalCount,
              page,
              partClasses,
            }}
          />
        </section> */}
        {/* <NumberButtons {...{arrayWithDots, changePage, page}} /> */}
      </R_Stack>
    </div>
  )
}
