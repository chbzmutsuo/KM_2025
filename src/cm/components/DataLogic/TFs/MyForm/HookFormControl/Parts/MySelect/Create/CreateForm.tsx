'use client'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {requestResultType} from '@cm/types/types'
import {getAllowCreateDefault} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/allowCreateOptionLib'
import {mapAdjustOptionValue} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/MySelectMethods-server'
import {parseContexts} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/useInitMySelect'
import {contextsType} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/my-select-types'
import {SearchFormHookType} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/Search/OptionSearcher/ComplexSearchForm'
import {Button} from 'src/cm/components/styles/common-components/Button'

import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'

import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import React, {useEffect} from 'react'

export default function CreateForm(props: {SearchFormHook: SearchFormHookType; contexts: contextsType}) {
  const {SearchFormHook, contexts} = props
  const col = contexts.controlContextValue.col
  const {controlContextValue} = contexts
  const {options, setFilteredOptions, handleOptionClick} = parseContexts(contexts)

  const creator = col.forSelect?.allowCreateOptions?.creator

  const createSeldctItem = async (res: requestResultType) => {
    const newOptionObj = res.result
    const newOptions = mapAdjustOptionValue([newOptionObj])
    newOptions.shift()
    setFilteredOptions(options)
    await handleOptionClick(newOptionObj, newOptions)
    toastByResult(res)
  }

  const getCreateFormPropsMethod =
    creator?.().getCreatFormProps ?? getAllowCreateDefault({contexts})?.CreateFunc().getCreatFormProps

  const {columns, formData} =
    getCreateFormPropsMethod({...controlContextValue, searchFormData: SearchFormHook.searchFormData}) ?? {}

  const useCreateForm = useBasicFormProps({columns, formData: {...formData}})

  const firstCol = columns.flat()[0]

  useEffect(() => {
    SearchFormHook.ReactHookForm.setFocus(firstCol.id)
  }, [])

  return (
    <div className={`mx-auto w-fit `}>
      <useCreateForm.BasicForm
        onSubmit={async data => {
          if (confirm(`新規にマスタデータを作成しますか?`) === false) return
          const modelName = controlContextValue.col.id.replace('Id', '') as PrismaModelNames

          const res = await fetchUniversalAPI(modelName, 'create', data)

          res.result = {
            id: res.result.id,
            name: res.result.name,
          }

          await createSeldctItem(res)
        }}
      >
        <Button color={`blue`}>新規作成</Button>
      </useCreateForm.BasicForm>
    </div>
  )
}
