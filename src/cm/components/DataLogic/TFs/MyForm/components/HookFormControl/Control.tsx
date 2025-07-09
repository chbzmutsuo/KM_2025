import React from 'react'
import MyInput from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyInput/MyInput'

import MyFileControl from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyFileControl/MyFileControl'

import {ControlContextType, ControlOptionType, formPropType} from '@cm/types/form-control-type'

import {colType} from '@cm/types/types'
import MyMdEditor from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyMdEditor'
import MyTextarea from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyTextarea'
import MyCheckBox from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyCheckBox/MyCheckBox'
import MyDatepicker from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MyDatePIcker/MyDatepicker'
import MyMultipleChoice from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/MyMultipleChoice'
import MySelect from '@components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/MySelect'
import ErrorMessage from '@components/DataLogic/TFs/MyForm/components/HookFormControl/util-components/ErrorMessage'

export type ControlProps = {
  field: string
  latestFormData: any
  ReactHookForm: any
  Register: any
  col: colType
  currentValue: any
  formProps: formPropType
  shownButDisabled: boolean
  extraFormState: any
  setextraFormState: any
  controlContextValue: ControlContextType
  ControlOptions: ControlOptionType
}

const Control = ({controlContextValue}) => {
  const {
    ReactHookForm,
    col,
    Register,
    ControlOptions,
    latestFormData,
    extraFormState,
    setextraFormState,
    currentValue,
    field,
    formProps,
    ControlStyle,
  } = controlContextValue

  const shownButDisabled = ControlOptions?.shownButDisabled ?? false

  col.type = col.inputTypeAs ?? col.type ?? 'text'
  const {type} = col

  const props: ControlProps = {
    field,
    latestFormData,
    ReactHookForm,
    Register,
    col,
    currentValue,
    formProps,
    shownButDisabled,
    extraFormState,
    setextraFormState,
    controlContextValue,
    ControlOptions,
  }

  return (
    <>
      <div style={{...ControlStyle}}>
        <Main {...{type, col, props}} />
        <ErrorMessage {...{controlContextValue}} />
      </div>
    </>
  )
}

export default Control

const Main = ({type, col, props}) => {
  if (type === 'slate') {
    return <MyMdEditor {...props} />
  }
  if (type === 'textarea') {
    return <MyTextarea {...props} />
  }

  if (type === 'boolean' || type === 'confirm') {
    return <MyCheckBox {...props} />
  }

  if (type === 'date' || type === 'month' || type === 'datetime' || type === 'year') {
    return <MyDatepicker {...props} />
  }

  if (col.multipleSelect) {
    return <MyMultipleChoice {...props}></MyMultipleChoice>
  } else if (col.forSelect) {
    return <MySelect {...{...props}} />
  }

  if (type === 'file') {
    return <MyFileControl {...props} />
  }

  return <MyInput {...props} />
}
