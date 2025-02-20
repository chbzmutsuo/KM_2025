'use client'
import React from 'react'

import {anyObject, colType} from '@cm/types/types'
import {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobal'
import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'
import {WrapperRounded} from '@components/styles/common-components/paper'

export type GlobalIdSelectorProps = {
  columns: colType[][]
  options?: anyObject
  useGlobalProps: useGlobalPropType
}

const GlobalIdSelector = React.memo((props: GlobalIdSelectorProps) => {
  const {useGlobalProps, columns} = props
  const {query, addQuery, pathname} = useGlobalProps

  const defaultValues = Object.fromEntries(
    columns.flat().map(col => {
      const value = query[col.id]
      return [col.id, value]
    })
  )

  const {BasicForm, latestFormData} = useBasicFormProps({
    columns,
    formData: defaultValues,
    autoApplyProps: {form: {}},
    onFormItemBlur: ({newlatestFormData}) => {
      addQuery(newlatestFormData, 'push')
    },
  })

  const ControlOptions = {
    ControlStyle: {width: 120, fontSize: 13},
    LabelStyle: {fontSize: 13},
  }

  if (['/QRBP/engineer'].some(path => pathname.includes(path))) {
    return <></>
  }

  return (
    <div className={`min-w-10`}>
      <div className={` p-0.5  text-sm `}>
        <WrapperRounded className={`!bg-white/70`}>
          <BasicForm latestFormData={latestFormData} alignMode="row" ControlOptions={ControlOptions}></BasicForm>
        </WrapperRounded>
      </div>
    </div>
  )
})
export default GlobalIdSelector
