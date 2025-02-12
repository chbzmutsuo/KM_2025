'use client'
import {PAYMENT_METHOD_LIST} from '@app/(apps)/aquapot/(constants)/options'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {formatDate} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import {Button} from '@components/styles/common-components/Button'
import {R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import React from 'react'

export default function Filter() {
  const {query, addQuery} = useGlobal()

  const onSubmit = async data => {
    addQuery({
      ...data,
      from: formatDate(data.from),
      to: formatDate(data.to),
    })
  }
  const {BasicForm} = useBasicFormProps({
    formData: {...query},
    columns: new Fields([
      {id: `from`, label: `いつから`, type: `date`, form: {...defaultRegister, showResetBtn: false}},
      {id: `to`, label: `いつまで`, type: `date`, form: {...defaultRegister, showResetBtn: false}},
      {id: `paymentMethod`, label: `支払方法`, forSelect: {optionsOrOptionFetcher: PAYMENT_METHOD_LIST}},
      {id: `AqSupportGroupMaster`, label: `支援団体`, forSelect: {}},
      {id: `name`, label: `氏名`},
      {id: `companyName`, label: `会社名`},
      // {id: `jobTitle`, label: `役職`},
    ])
      .customAttributes(({col}) => ({
        ...col,
        form: {
          ...col.form,
          style: {width: 160},
        },
      }))
      .transposeColumns(),
  })

  return (
    <R_Stack {...{className: ` justify-center`}}>
      <BasicForm {...{onSubmit, alignMode: `row`}}>
        <Button color={`red`}>条件変更</Button>
      </BasicForm>
    </R_Stack>
  )
}
