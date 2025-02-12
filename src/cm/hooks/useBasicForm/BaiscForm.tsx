'use client'
import React, {useEffect, useState} from 'react'

import {colType, onFormItemBlurType} from '@cm/types/types'

import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {FormProvider, UseFormReturn} from 'react-hook-form'

import {AdditionalBasicFormPropType} from 'src/cm/hooks/useBasicForm/useBasicFormProps'

import {useCacheSelectOptionReturnType} from 'src/cm/hooks/useCacheSelectOptions/useCacheSelectOptions'
import {cl} from 'src/cm/lib/methods/common'

import FormSecLabel from 'src/cm/hooks/useBasicForm/FormSecLabel'
import {makeFormsByColumnObj} from '@hooks/useBasicForm/lib/makeFormsByColumnObj'

import ColForm from '@hooks/useBasicForm/ColForm'
import {adjustBasicFormProps} from '@hooks/useBasicForm/lib/createBasicFormProps'

export type useRegisterType = (props: {col: colType; newestRecord: any}) => {
  currentValue: any
  shownButDisabled: boolean
  Register: any
}

export type useResetValueType = (props: {col: colType; field: any}) => void

export type BasicFormType = {
  formData: any
  setformData: any
  values: any
  columns: colType[][]
  latestFormData: any
  extraFormState: any
  setextraFormState: any
  useGlobalProps: any
  Cached_Option_Props: useCacheSelectOptionReturnType
  ReactHookForm: UseFormReturn
  formId: string
  formRef: any
  useRegister: useRegisterType
  useResetValue: useResetValueType
  onFormItemBlur?: onFormItemBlurType
} & AdditionalBasicFormPropType

const BasicForm = (props: BasicFormType) => {
  const {formRef, columns, useGlobalProps, formId, alignMode, style, wrapperClass, ControlOptions} = adjustBasicFormProps(props)

  const ReactHookForm: UseFormReturn = props.ReactHookForm
  const handleFormSubmit = props.onSubmit ? ReactHookForm.handleSubmit(props.onSubmit) : undefined
  const onSubmit = async e => {
    e.preventDefault()
    const formElement = e.target as HTMLFormElement
    if (formElement?.getAttribute('id') === formId && handleFormSubmit) {
      return await handleFormSubmit(e)
    }
  }
  const {justifyDirection} = useJustifyDirection({columns, useGlobalProps})
  const {transposedRowsForForm} = makeFormsByColumnObj(columns)

  const ChildComponent = () => {
    if (props.children) {
      return <div className={alignMode === `row` ? `` : 'pb-2 pt-4'}>{props.children}</div>
    }
    return <></>
  }

  return (
    <div className={`w-fit `}>
      <FormProvider {...ReactHookForm}>
        <form {...{ref: formRef, id: formId, onSubmit}}>
          <C_Stack className={`items-center`}>
            <R_Stack style={style} className={cl(` mx-auto w-full items-stretch gap-8  gap-y-24`, justifyDirection)}>
              {transposedRowsForForm.map((columns, i) => {
                return (
                  <div key={i} className={`formSec `}>
                    <FormSecLabel {...{columns, ControlOptions}}>
                      <div className={`${wrapperClass}   `}>
                        {columns.map((col: colType, formItemIndex) => {
                          const uniqueKey = `${i}-${formItemIndex}`
                          return <ColForm key={uniqueKey} {...{...props, col, formItemIndex}} />
                        })}
                        {alignMode === `row` && <ChildComponent />}
                      </div>
                    </FormSecLabel>
                  </div>
                )
              })}
            </R_Stack>
            {alignMode !== `row` && <ChildComponent />}
          </C_Stack>
        </form>
      </FormProvider>
    </div>
  )
}

export default BasicForm

const useJustifyDirection = ({columns, useGlobalProps}) => {
  const {width, SP} = useGlobalProps
  const {transposedRowsForForm} = makeFormsByColumnObj(columns)
  const [justifyDirection, setjustifyDirection] = useState(`justify-center`)
  const elems = document?.querySelectorAll(`.formSec`)
  useEffect(() => {
    if (elems.length > 0) {
      const justifyDirection = transposedRowsForForm.length === 1 || SP ? `justify-center` : `justify-start`
      setjustifyDirection(justifyDirection)
    }
  }, [width, transposedRowsForForm, elems, SP])

  return {justifyDirection}
}
