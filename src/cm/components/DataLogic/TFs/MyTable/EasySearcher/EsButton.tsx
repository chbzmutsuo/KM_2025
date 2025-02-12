import {CSSProperties} from 'react'

import {cl} from 'src/cm/lib/methods/common'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {IconBtn} from 'src/cm/components/styles/common-components/IconBtn'

import {EasySearchObject} from '@class/builders/QueryBuilderVariables'
import {tail_color} from 'tailwind.config'
import {MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'

export type EsButtonProps = {
  IsSingleItemGroup: boolean
  dataSource: EasySearchObject
  count: number
  isActive: boolean
  conditionMatched: boolean
  handleEasySearch
}
export const EsButton = (props: EsButtonProps) => {
  const {IsSingleItemGroup, dataSource, count, isActive, conditionMatched, handleEasySearch} = props
  const {label, notify} = dataSource ?? {}

  const notZero = count > 0

  // const CLs = {
  //   wrapper: cl(conditionMatched ? ` bg-primary-main` : '', ` shadow-none  bg-gray-300  onHover  px-0.5  `),
  //   count: cl(`px-1 rounded-r-sm`),
  // }

  let countBtnStyle: CSSProperties = {
    background: tail_color.sub.main,
    color: `white`,
  }
  if (notZero && notify) {
    countBtnStyle.background = `#fd6969`
    if (typeof notify === `object`) {
      countBtnStyle = {...countBtnStyle, ...notify}
    }
  }

  const activeClass = isActive ? 'bg-white ring-2  text-gray-900 shadow' : ' text-gray-500 hover:text-gray-900'
  return (
    <button
      onClick={() => {
        handleEasySearch({dataSource})
      }}
      className={cl(
        //
        `flex h-[26px] items-center  gap-1`,
        `rounded-md   p-1 text-sm transition-colors `,
        activeClass
      )}
    >
      <MarkDownDisplay className={` text-xs leading-3`}>{label}</MarkDownDisplay>
      {/* } */}
      <span
        {...{
          className: cl('rounded-full  px-[5px] py-[1px] text-xs font-medium'),
          style: countBtnStyle,
        }}
      >
        <div>{count}</div>
      </span>
    </button>
  )
  return (
    <R_Stack
      className={`
       ${isActive ? ' animate-pulse' : ''}
       relative  h-full items-stretch gap-0.5 `}
      onClick={() => {
        handleEasySearch({dataSource})
      }}
    >
      <IconBtn
        {...{
          // className: CLs.wrapper,
          active: notZero,
        }}
      >
        <R_Stack className={`items-center gap-0.5 text-xs`}>
          {IsSingleItemGroup ? <></> : <MarkDownDisplay className={` leading-3`}>{label}</MarkDownDisplay>}

          <div {...{style: countBtnStyle}}>{count}</div>
        </R_Stack>
      </IconBtn>
    </R_Stack>
  )
}
