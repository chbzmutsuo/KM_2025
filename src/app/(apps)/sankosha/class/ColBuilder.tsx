'use client'

import {inputMode} from '@app/(apps)/sankosha/class/Sankosha'
import {getInspectionCols} from '@app/(apps)/sankosha/lib/getInspectionCols'
import {getClientCommonColumnFields, getStorageCols} from '@app/(apps)/sankosha/lib/getStorageCols'
import {getTaskManagementCol} from '@app/(apps)/sankosha/lib/getTaskManagementCol'

import {Fields} from '@cm/class/Fields/Fields'

import {colType, columnGetterType} from '@cm/types/types'

export class ColBuilder {
  static sankoshaProductImage = (props: columnGetterType) => {
    const {useGlobalProps} = props

    const data: colType[][] = new Fields([
      {
        id: `url`,
        label: `写真`,
        type: `file`,
        form: {file: {backetKey: `productImage`}},
      },
    ])
      .customAttributes(({col}) => {
        return {...col, form: {}}
      })
      .transposeColumns()

    return data
  }
  static sankoshaEstimatePriceMasterTable = (props: columnGetterType) => {
    const {useGlobalProps} = props

    const data: colType[][] = new Fields([
      {
        id: `sankoshaPriceMasterId`,
        label: `項目名`,
        forSelect: {
          // dataModelName: `sankoshaPriceMaster`,
          allowCreateOptions: {},
        },
      },
      {id: `quantity`, label: `数量`, type: `number`},
      {id: `priceAdjust`, label: `価格`, type: `float`},
    ])
      .customAttributes(({col}) => {
        return {...col, form: {}}
      })
      .transposeColumns()

    return data
  }
  static sankoshaProcess = (props: columnGetterType) => {
    const {useGlobalProps} = props
    const {query} = useGlobalProps

    const colsByInputType: {[key in inputMode]: colType[]} = {
      storage: getStorageCols(),
      inspection: getInspectionCols(),
      taskManagement: getTaskManagementCol(),
    }

    const inputMode = query.inputMode

    let data: colType[] = []

    let targetColumns: any[] = []
    if (inputMode === `storage`) {
      targetColumns.push(colsByInputType.storage)
    } else if (inputMode === `inspection`) {
      targetColumns.push(colsByInputType.storage)
      targetColumns.push(colsByInputType.inspection)
    } else if (inputMode === `taskManagement`) {
      targetColumns.push(colsByInputType.storage)
      targetColumns.push(colsByInputType.inspection)
      targetColumns.push(colsByInputType.taskManagement)
    } else {
      targetColumns.push(colsByInputType.storage)
      targetColumns.push(colsByInputType.inspection)
      targetColumns.push(colsByInputType.taskManagement)
    }

    targetColumns = targetColumns.map(cols => {
      const result = new Fields(cols).customAttributes(({col}) => {
        const td = {...col.td, style: {minWidth: 80, ...col.td?.style}}
        const searchableColIds = [
          `createdAt`,
          'sankoshaClientAId',
          'sankoshaClientBId',
          'sankoshaClientCId',
          'sankoshaClientDId',
          'sankoshaClientEId',

          `sankoshaProductMasterId`,
          `sankoshaSizeMasterId`,
          `quantity`,
          `requestFormNumber`,
          `plannedDeliveryDate`,
        ]
        const search = searchableColIds.includes(col?.id) ? {} : undefined
        const result = {...col, form: {}, td, search}
        return result
      }).plain

      return result
    })

    data = targetColumns.flat()

    return Fields.transposeColumns(data, {
      ...props.transposeColumnsOptions,
    })
  }
  static user = (props: columnGetterType) => {
    const {useGlobalProps} = props

    const data: colType[] = [
      {
        ...{id: 'name', label: '氏名'},
        form: {register: {required: '必須です'}},
      },
      {
        ...{id: 'email', label: 'メールアドレス'},
        form: {register: {required: '必須です'}},
        type: 'email',
      },
      {
        ...{id: 'password', label: 'パスワード'},
        type: 'password',
        form: {register: {required: '必須です'}},
      },
    ]

    return Fields.transposeColumns(data, {
      ...props.transposeColumnsOptions,
      autoSplit: {form: 4},
    })
  }

  static sankoshaPriceMaster = (props: columnGetterType) => {
    const data: colType[][] = new Fields([
      {id: `name`, label: `項目名`, form: {}},
      {id: `price`, label: `項目名`, type: `number`, form: {}},
    ]).transposeColumns()

    return data
  }
  static sankoshaClientA = (props: columnGetterType) => {
    const data: colType[][] = new Fields([getClientCommonColumnFields()]).transposeColumns()

    return data
  }
}
