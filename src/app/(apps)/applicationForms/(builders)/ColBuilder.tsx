'use client'

import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
export class ColBuilder {
  static user = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'name', label: '名称'}, form: {...defaultRegister}},
      {...{id: 'email', label: 'Email'}, form: {...defaultRegister}},
      {...{id: 'password', label: 'パスワード', type: `password`}, form: {...defaultRegister}},
    ]).transposeColumns()
  }
  static product = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'productCode', label: '商品コード'}, form: {...defaultRegister}},
      {...{id: 'name', label: '商品名'}, form: {...defaultRegister}},
      {...{id: 'maker', label: 'メーカー'}, form: {...defaultRegister}},
      {...{id: 'unit', label: '単位'}, form: {...defaultRegister}},
    ]).transposeColumns()
  }
}
