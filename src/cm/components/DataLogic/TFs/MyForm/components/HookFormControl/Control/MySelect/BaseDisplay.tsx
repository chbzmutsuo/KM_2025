import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'
import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import {contextsType} from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {CssString} from 'src/cm/components/styles/cssString'

import React from 'react'
import {IconBtnForSelect} from '@components/styles/common-components/IconBtn'
import {twMerge} from 'tailwind-merge'

const BaseDisplay = React.memo((props: {contexts: contextsType}) => {
  const {MySelectContextValue, controlContextValue} = props.contexts
  const {COLOR, currentValueToReadableStr, setIsOptionsVisible, options} = MySelectContextValue

  const {col, formProps, ControlOptions} = controlContextValue

  if (currentValueToReadableStr === undefined) {
    return <PlaceHolder />
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
    <div tabIndex={0}>
      <R_Stack
        style={{...controlContextValue.ControlStyle}}
        onClick={showSelector}
        onKeyDown={showSelector}
        className={twMerge(formProps.className, '')}
      >
        <IconBtnForSelect
          color={COLOR}
          className={twMerge(
            //
            `w-full truncate flex justify-start`,
            textAlignMent
          )}
        >
          <div>
            {displayValue ? (
              <div>
                <MarkDownDisplay className={`truncate`}>{currentValueToReadableStr}</MarkDownDisplay>
              </div>
            ) : (
              <div>
                <input
                  {...{
                    className: twMerge(`text-[#9DA3AE]   pointer-events-none`, CssString.fontSize.cell),
                    value: col.form?.placerHolder ?? '選択',
                    onChange: e => undefined,
                  }}
                />
              </div>
            )}
          </div>
        </IconBtnForSelect>
      </R_Stack>
    </div>
  )
})
export default BaseDisplay
