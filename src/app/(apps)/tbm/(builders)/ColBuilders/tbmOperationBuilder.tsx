'use client'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const tbmOperationBuilder = (props: columnGetterType) => {
  const {selectedBase, setselectedBase, setselectedRouteGroup} = useSelectedBase()

  return new Fields([
    {id: 'date', label: '日付', type: `date`},
    {id: 'userId', label: 'ユーザー', forSelect: {}},
    {id: 'tbmRouteGroupId', label: 'ルート', forSelect: {}},
    {id: 'distanceKm', label: '距離'},
    {id: 'type', label: '区分'},
  ])
    .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
    .transposeColumns()
}
