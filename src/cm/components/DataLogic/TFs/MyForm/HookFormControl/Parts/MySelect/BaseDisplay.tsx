import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'
import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import {contextsType} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/my-select-types'
import {CssString} from 'src/cm/components/styles/cssString'
import {cl} from 'src/cm/lib/methods/common'

import React from 'react'
import { IconBtnForSelect} from '@components/styles/common-components/IconBtn'
import {twMerge} from 'tailwind-merge'

const BaseDisplay = React.memo((props: {contexts: contextsType}) => {
  const {MySelectContextValue, controlContextValue} = props.contexts
  const {COLOR, currentValueToReadableStr, setIsOptionsVisible, options} = MySelectContextValue

  const {col, formProps, ControlOptions} = controlContextValue

  if (currentValueToReadableStr === undefined) {
    return <PlaceHolder>Loading...</PlaceHolder>
  }

  const displayValue = currentValueToReadableStr && typeof currentValueToReadableStr !== 'object'

  const showSelector = e => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (col?.form?.disabled !== true) {
        setIsOptionsVisible(true)
      }
    }
  }

  const textAlignMent = COLOR ? `text-center` : `: text-start`

  return (
    <R_Stack
      style={{...controlContextValue.ControlStyle}}
      tabIndex={0}
      onClick={showSelector}
      onKeyDown={showSelector}
      className={twMerge(
        //
        ` flex-nowrap h-full items-center`,
        formProps.className
      )}
    >
      <IconBtnForSelect color={COLOR} className={twMerge(`w-full truncate rounded !py-[1.5px] px-1  text-[16px]`, textAlignMent)}>
        <div>
          {displayValue ? (
            <MarkDownDisplay className={currentValueToReadableStr.length > 10 ? `` : ``}>
              {currentValueToReadableStr}
            </MarkDownDisplay>
          ) : (
            <div className={cl(CssString.fontSize.cell, `text-[#9DA3AE]`)}>{col.form?.placerHolder ?? '選択'}</div>
          )}
        </div>
      </IconBtnForSelect>
      {/* <ColoredText bgColor={COLOR} className={`w-full truncate rounded !py-[1.5px] px-1  text-[16px] ${textAlignMent}`}>
        <div>
          {displayValue ? (
            <MarkDownDisplay className={currentValueToReadableStr.length > 10 ? `` : ``}>
              {currentValueToReadableStr}
            </MarkDownDisplay>
          ) : (
            <div className={cl(CssString.fontSize.cell, `text-[#9DA3AE]`)}>{col.form?.placerHolder ?? '選択'}</div>
          )}
        </div>
      </ColoredText> */}
    </R_Stack>
  )
})
export default BaseDisplay
