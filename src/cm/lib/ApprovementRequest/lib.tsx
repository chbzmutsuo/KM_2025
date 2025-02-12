import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {roopMakeRelationalInclude} from '@class/builders/QueryBuilderVariables'

import {Fields} from '@class/Fields/Fields'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {columnGetterType} from '@cm/types/types'
import {Prisma} from '@prisma/client'

export const getApCustomField = (props: columnGetterType & {dataModelName: string}) => {
  return new Fields([
    {id: `name`, label: `フィールド名`, form: {...defaultRegister}},
    {
      id: `type`,
      label: `データ型`,
      form: {...defaultRegister},
      forSelect: {optionsOrOptionFetcher: [`string`, `number`, `radio`, `date`, `time`, `datetime`, `boolean`, `color`, `radio`]},
    },
    {id: `required`, label: `必須`, type: `boolean`, form: {}},
    {id: `remarks`, label: `備考`, type: `textarea`, form: {}},
  ]).transposeColumns()
}
export const getAppRceceiverCols = (props: columnGetterType & {dataModelName: string}) => {
  return new Fields([
    {id: `userId`, label: `ユーザー`, forSelect: {}},
    {id: `status`, label: `承認ステータス`},
    {id: `comment`, label: `コメント`},
  ])
}

export const getApRequestIncludes = () => {
  const apRequest: Prisma.ApRequestFindManyArgs = {
    include: {
      ApSender: {include: {User: {}}},
      ApReceiver: {include: {User: {}}},
      ApRequestTypeMaster: {},
      ApCustomFieldValue: {
        include: {
          ApCustomField: {},
        },
      },
    },
  }

  const apRequestTypeMaster: Prisma.ApRequestTypeMasterFindManyArgs = {
    include: {ApCustomField: {}},
  }

  const include: {[key in PrismaModelNames]?: any} = {
    apRequest,
    apRequestTypeMaster,
  }

  Object.keys(include).forEach(key => {
    roopMakeRelationalInclude({
      parentName: key,
      parentObj: include[key],
    })
  })
  return include
}
