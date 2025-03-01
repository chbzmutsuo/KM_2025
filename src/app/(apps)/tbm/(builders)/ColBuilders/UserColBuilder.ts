'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const UserColBuilder = (props: columnGetterType) => {
  return new Fields([
    {id: 'tbmBaseId', label: '営業所', forSelect: {}, form: {...defaultRegister}},
    {...{id: 'code', label: 'コード'}, form: {...defaultRegister}},
    {...{id: 'name', label: '名称'}, form: {...defaultRegister}},
    {...{id: 'email', label: 'Email'}, form: {...defaultRegister}},
    {...{id: 'password', label: 'パスワード', type: `password`}, form: {...defaultRegister}},
  ]).transposeColumns()
}
