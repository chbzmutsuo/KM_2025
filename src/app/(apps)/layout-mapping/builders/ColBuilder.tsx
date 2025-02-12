'use client'

import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {T_LINK} from '@components/styles/common-components/links'
export class ColBuilder {
  static lmLocation = (props: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `名前`, form: {}},
      // {
      //   id: `url`,
      //   label: `PDFをアップロード`,
      //   type: `file`,
      //   form: {
      //     file: {accept: {'application/pdf': ['.pdf']}, backetKey: `layout-mapping`},
      //   },
      //   td: {hidden: true},
      // },
    ]).transposeColumns()
  }

  static pdf = (props: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `名前`, form: {}},
      {
        id: `url`,
        label: `PDFをアップロード`,
        type: `file`,
        form: {
          file: {accept: {'application/pdf': ['.pdf']}, backetKey: `layout-mapping`},
        },
        // td: {hidden: true},
      },
      {
        id: `edit`,
        label: `編集`,

        format: (value, row) => <T_LINK href={`/${props.useGlobalProps.rootPath}/pdf/edit/${row.id}`}>編集</T_LINK>,
      },
    ]).transposeColumns()
  }
  static user = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'name', label: '名称'}, form: {...defaultRegister}},
      {...{id: 'email', label: 'Email'}, form: {...defaultRegister}},
      {...{id: 'password', label: 'パスワード', type: `password`}, form: {...defaultRegister}},
    ]).transposeColumns()
  }
}
