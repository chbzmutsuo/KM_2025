'use client'

import {BasicFormType} from '@hooks/useBasicForm/BaiscForm'
import {getFormProps, getStyleProps} from '@hooks/useBasicForm/lib/hookformMethods'
import React, {Fragment} from 'react'
import {Controller} from 'react-hook-form'
import {ControlContextType} from '@cm/types/form-control-type'
import {liftUpNewValueOnChange} from '@components/DataLogic/TFs/MyForm/MyForm'
import {DH__switchColType} from '@class/DataHandler/type-converter'
import Label from '@components/DataLogic/TFs/MyForm/components/HookFormControl/util-components/Label'
import {cn} from '@cm/shadcn-ui/lib/utils'
import ErrorMessage from '@components/DataLogic/TFs/MyForm/components/HookFormControl/util-components/ErrorMessage'
import {Alert} from '@components/styles/common-components/Alert'
import LeftControlRight from './LeftControlRight'
import Description from './Description'

export type ControlGroupPropType = BasicFormType & {
  col
  formItemIndex
  latestFormData
}
export const ControlGroup = React.memo((props: ControlGroupPropType) => {
  const {ReactHookForm, formData, useResetValue, latestFormData, formId, ControlOptions, col, columns} = props

  const messages = ReactHookForm?.formState?.errors
  const {Register} = col

  if (!col?.id && col?.label) {
    return (
      <Fragment>
        <Alert>col.label error</Alert>
      </Fragment>
    )
  } else {
    return (
      <Controller
        name={col.id}
        control={ReactHookForm.control}
        render={({field}) => {
          const errorMessage = messages?.[col.id]?.message?.toString()

          const {id: wrapperId, flexDirection, wrapperClass, ControlStyle, isBooleanType} = getStyleProps({ControlOptions, col})

          const currentValue = props.ReactHookForm?.getValues(col.id)

          const type = DH__switchColType({type: col.type})
          const pointerClass = type === `boolean` ? ' cursor-pointer' : ''

          const required = !!col?.form?.register?.required

          col.inputProps = {
            ...col.inputProps,
            placeholder: col.inputProps?.placeholder ?? (required ? '必須です' : ''),
            required,
          }

          const controlContextValue: ControlContextType = {
            ...props,
            ControlStyle,
            ControlOptions,
            errorMessage,
            formId,
            col,
            wrapperId,
            columns,
            field,
            isBooleanType,
            currentValue,
            Register,
            formProps: getFormProps({ControlOptions, isBooleanType, Register, col, errorMessage, currentValue}),
            liftUpNewValueOnChange,
            useResetValue,
            pointerClass,
            type,
          }
          const horizontal = props.alignMode === `row`

          // // const MEMO_MainControlComponent = useMemo(
          // //   () => (
          // //     <LeftControlRight
          // //       {...{
          // //         col,
          // //         controlContextValue,
          // //         shownButDisabled: ControlOptions?.shownButDisabled ?? false,
          // //       }}
          // //     />
          // //   ),
          // //   [col, controlContextValue]
          // )

          const showDescription = ControlOptions?.showDescription !== false && col.form?.descriptionNoteAfter
          const wrapperClassName = cn(wrapperClass, col.id)

          return (
            <div>
              <div {...{id: wrapperId, className: wrapperClassName}}>
                <div
                  className={cn(
                    flexDirection,
                    ` ${DH__switchColType({type: col.type}) === `boolean` ? ' cursor-pointer' : ''}  relative `
                  )}
                >
                  <div
                    style={{width: horizontal ? undefined : ControlStyle.width}}
                    className={`w-fit  gap-0 ${horizontal ? 'row-stack flex-nowrap　items-center ' : 'col-stack'}`}
                  >
                    <section className={horizontal ? 'mr-1' : `mb-2`}>
                      <div>{!col?.form?.reverseLabelTitle && <Label {...{controlContextValue}} />}</div>
                    </section>

                    <LeftControlRight
                      {...{
                        col,
                        controlContextValue,
                        shownButDisabled: ControlOptions?.shownButDisabled ?? false,
                      }}
                    />

                    {showDescription && (
                      <Description
                        {...{
                          col,
                          ControlStyle,
                          currentValue,
                          formData,
                          latestFormData,
                        }}
                      />
                    )}

                    {col?.form?.reverseLabelTitle && <Label {...{controlContextValue}} />}
                  </div>
                </div>
                <ErrorMessage {...{controlContextValue}} />
              </div>
            </div>
          )
        }}
      />
    )
  }
})

export default ControlGroup
