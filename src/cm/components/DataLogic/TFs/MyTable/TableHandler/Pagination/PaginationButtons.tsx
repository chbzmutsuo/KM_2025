import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {cl} from 'src/cm/lib/methods/common'
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from '@heroicons/react/20/solid'

const PaginationButtons = ({array, changePage, page, partClasses, totalCount, pageCount}) => {
  const cevronClass = `h-5 w-5 t-link onHover !t-link`
  return (
    <R_Stack className={`gap-0`}>
      <div className={cl(partClasses.inputGroupClass, `  `)}>
        <ChevronDoubleLeftIcon className={cevronClass} onClick={() => changePage(page - 1)} />
        {/* <label htmlFor="page" className={partClasses.labelClass}>
          ページ
          </label> */}
        <select
          id={`take`}
          className={`${partClasses.selectClass} p-0`}
          value={page}
          onChange={e => {
            changePage(Number(e.target.value))
          }}
        >
          {array.map((number, index) => {
            return <option key={index}>{number}</option>
          })}
        </select>
        <ChevronDoubleRightIcon className={cevronClass} onClick={() => changePage(page + 1)} />
      </div>
      <small>/</small>
      <small className={`ml-0.5`}>{pageCount}</small>
    </R_Stack>
  )
  // return (
  //   <select
  //     value={page}
  //     onChange={e => {
  //       changePage(Number(e.target.value))
  //     }}
  //   >
  //     {array.map((number, index) => {
  //       return <option key={index}>{number}</option>
  //     })}
  //   </select>
  // )
  // return (
  //   <R_Stack className={`items-center gap-2`}>
  //     {arrayWithDots.map((number, index) => {
  //       return (
  //         <Fragment key={index}>
  //           {number === '...' ? (
  //             <>
  //               <div className={`AlignJustCenter  px-2`}>{number}</div>
  //             </>
  //           ) : (
  //             <>
  //               <button onClick={() => changePage(number)} key={number}>
  //                 {number}
  //               </button>
  //             </>
  //           )}
  //         </Fragment>
  //       )
  //     })}
  //   </R_Stack>
  // )
}

export default PaginationButtons
