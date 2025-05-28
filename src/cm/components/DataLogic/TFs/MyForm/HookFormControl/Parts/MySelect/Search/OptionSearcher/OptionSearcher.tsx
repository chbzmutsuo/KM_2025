'use client'

import {C_Stack} from 'src/cm/components/styles/common-components/common-components'

import React from 'react'

import {colType} from '@cm/types/types'

import {contextsType} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/my-select-types'

import {
  ComplexSearchForm,
  SearchFormHookType,
} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/Search/OptionSearcher/ComplexSearchForm'
import {SimpleSearchForm} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/Search/OptionSearcher/SimpleSearchForm'

export const OptionSearcher = (props: {
  SearchFormHook: SearchFormHookType
  contexts: contextsType
  optionsISFromArray
  allowCreateOptions
}) => {
  const {SearchFormHook, contexts, optionsISFromArray, allowCreateOptions} = props

  const {MySelectContextValue, controlContextValue} = contexts

  const col: colType = controlContextValue?.col

  return (
    <C_Stack>
      {col.forSelect?.allowCreateOptions || col.forSelect?.searcher ? (
        <ComplexSearchForm {...{contexts, SearchFormHook}} />
      ) : (
        <SimpleSearchForm {...{contexts}} />
      )}
    </C_Stack>
  )
}
export default OptionSearcher
