'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const TbmVehicleColBuilder = (props: columnGetterType) => {
  return new Fields([
    {id: 'tbmBaseId', label: '営業所', forSelect: {}, form: {...defaultRegister}},
    {...{id: 'name', label: '車両名'}, form: {...defaultRegister}},
    {...{id: 'plate', label: '車両番号'}, form: {...defaultRegister}},
  ]).transposeColumns()
}
