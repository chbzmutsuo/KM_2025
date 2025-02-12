'use client'

import {materialTypes} from '@app/(apps)/tsukurunger/class/constants'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {getMidnight} from '@class/Days'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
export class ColBuilder {
  static roleMaster = (props?: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `項目`, form: {}},
      {id: `color`, label: `色`, form: {}, type: `color`},
      {id: `description`, label: `詳細`, form: {}, type: `textarea`},
    ]).transposeColumns()
  }
  static tsNippMannualWorkContent = (props?: columnGetterType) => {
    return new Fields([
      ...new Fields([
        {id: `part`, label: `部位`, form: {}},
        {id: `name`, label: `項目`, form: {}},
      ]).aggregateOnSingleTd().plain,
      ...new Fields([
        {id: `count`, label: `数量`, form: {}, type: `float`, inputProps: {step: 0.001}},
        {id: 'unit', label: '単位', type: 'string', form: {}},
      ]).aggregateOnSingleTd().plain,
      {id: `price`, label: `単価`, form: {}, type: `price`},
    ]).transposeColumns()
  }
  static tsNippoRemarks = (props?: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `項目`, form: {}},
      {id: `price`, label: `金額`, form: {}, type: `price`, td: {style: {width: 90}}},
    ]).transposeColumns()
  }
  static tsNippo = (props?: columnGetterType) => {
    return new Fields([{id: `date`, label: `日付`, type: `date`}]).transposeColumns()
  }
  static mainContractor = (props?: columnGetterType) => {
    return new Fields([{id: `name`, label: `名称`}]).transposeColumns()
  }

  static tsRegularSubcontractor = (props?: columnGetterType) => {
    return new Fields([
      {id: 'name', label: '名称', type: 'string', form: {}},
      {id: 'contentName', label: '作業名', type: 'string', form: {}},
      {id: 'unitPrice', label: '単価', type: 'float', form: {}},
      {id: 'remarks', label: '備考', type: 'textarea', form: {}},
    ]).transposeColumns()
  }

  static tsSubcontractor = (props?: columnGetterType) => {
    3
    return new Fields([
      {id: `name`, label: `名称`, form: {}},
      {id: 'unitPrice', label: '単価', type: 'float', form: {}},
      {id: 'remarks', label: '備考', type: 'textarea', form: {}},
    ]).transposeColumns()
  }

  static tsMachinery = (props?: columnGetterType) => {
    return new Fields([
      {id: `name`, label: `名称`, form: {}},
      {id: 'unit', label: '単位', type: 'string', form: {}},
      {id: 'unitPrice', label: '単価', type: 'float', form: {}},
      {id: 'vendor', label: '業者名', type: 'string', form: {}},
      {id: 'remarks', label: '備考', type: 'textarea', form: {}},
    ]).transposeColumns()
  }

  static tsMaterial = (props?: columnGetterType) => {
    const cols = new Fields([
      {
        id: 'materialType',
        label: '材料タイプ',
        forSelect: {
          optionsOrOptionFetcher: materialTypes,
        },
      },
      {id: 'name', label: '名称', type: 'string', form: {}, td: {style: {width: 180}}},
      ...new Fields([
        {id: 'vehicle', label: '車両', type: 'string', form: {}},
        {id: 'category', label: '区分', type: 'string', form: {}},
      ]).aggregateOnSingleTd().plain,
      ...new Fields([
        {id: 'unitPrice', label: '単価(税抜)', type: 'float', form: {}},
        {id: 'unit', label: '単位', type: 'string', form: {}},
      ]).aggregateOnSingleTd().plain,

      {id: 'vendor', label: '業者名', type: 'string', form: {}, td: {style: {width: 180}}},
      {id: 'billedAt', label: '請求月', type: `month`, form: {}},

      ...new Fields([
        {id: 'genbaName', label: '現場名（手打ち）', form: {}, td: {style: {width: 180}}},
        {id: 'remarks', label: '備考', type: 'textarea', form: {}},
      ]).aggregateOnSingleTd().plain,
      // {id: 'genbaId', label: '現場', forSelect: {}},
    ]).customAttributes(({col}) => {
      if ([`name`, `vendor`, `genbaName`].includes(col.id)) return {search: {}}
      return {search: {}, td: {style: {minWidth: 120}}}
    }).plain
    return new Fields(cols).transposeColumns()
  }

  static tsWorkContent = (props?: columnGetterType) => {
    const result = new Fields([
      // {
      //   id: `createdAt`,
      //   label: `データ作成日`,
      //   format: (value, row) => {
      //     return formatDate(row[`createdAt`], 'YYYY/MM/DD HH:mm:ss')
      //   },
      //   type: `date`,
      //   form: {hidden: true},
      // },

      // {id: `sortOrder`, label: `並び順`, form: {hidden: true}},
      {id: `part`, label: `部位`, form: {}},
      {id: `name`, label: `名称`, form: {...defaultRegister}},
      {id: `remarks`, label: `摘要`, type: `textarea`, form: {}},
      {id: 'unit', label: '単位', type: 'string', form: {}},
      {
        id: 'contractAmount',
        label: '契約数量',
        type: 'float',
        inputProps: {step: 0.001},
        form: {},
      },
      {id: 'unitPrice', label: '単価(税抜)', type: 'float', form: {}},
    ]).transposeColumns()

    return result
  }

  static user = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'name', label: '名称', form: {}}},
      {...{id: 'email', label: 'Email', form: {}}},
      {...{id: 'password', label: 'パスワード', type: `password`, form: {}}},
      // {
      //   ...{id: 'type',
      //     label: '区分',
      //     forSelect: {
      //       optionsOrOptionFetcher: [`管理者`, `外注`],
      //     },
      //   },
      // },
    ]).transposeColumns()
  }

  static tsConstruction = (props: columnGetterType) => {
    return new Fields([
      ...new Fields([
        {...{id: 'tsMainContractorId', label: '元請け業者', forSelect: {}, form: {hidden: true}}},
        {...{id: 'name', label: '名称', form: {}}},
      ]).buildFormGroup({groupName: `名称`}).plain,
      ...new Fields([
        {...{id: 'address1', label: '住所1', form: {}}},
        {...{id: 'address2', label: '住所2', form: {}}},
      ]).buildFormGroup({groupName: `住所`}).plain,
      ...new Fields([
        {...{id: 'contractAmount', label: '請負金額', type: `float`, form: {}}},
        {...{id: 'budget', label: '実行予算', type: `float`, form: {}}},
      ]).buildFormGroup({groupName: `予算等`}).plain,

      {
        ...{
          id: 'readOnlyTsNippo',
          label: '日報件数',
          form: {hidden: true},
          format: (value, row) => {
            const Nippo = row?.TsNippo
            return <>{Nippo?.length}</>
          },
        },
      },
    ]).transposeColumns()
  }

  static tsPart = (props: columnGetterType) => {
    return new Fields([{...{id: 'name', label: '名称'}, form: {...defaultRegister}}]).transposeColumns()
  }

  static tsPaymentDestination = (props: columnGetterType) => {
    return new Fields([{...{id: 'name', label: '名称', form: {}}}]).transposeColumns()
  }

  static tsExpense = (props: columnGetterType) => {
    return new Fields([
      {...{id: 'date', label: '日付', type: `date`}, form: {defaultValue: getMidnight()}},
      {...{id: 'tsPaymentDestinationId', label: '支払い先', forSelect: {}}},
      {...{id: 'name', label: '名称'}, form: {}},
      {...{id: 'price', label: '金額', type: `float`}, form: {}},
    ])
      .customAttributes(({col}) => ({
        ...col,
        form: {
          ...col.form,
          ...defaultRegister,
        },
      }))
      .transposeColumns()
  }
}
