'use server'

import {PrismaModelNames} from '@cm/types/prisma-types'

import {additionalPropsType, anyObject, MyTableType} from '@cm/types/types'
import {EasySearchObject} from 'src/cm/class/builders/QueryBuilderVariables'

export type ES_Atom_FetcherProps = {
  DetailePageId
  // params: anyObject
  EasySearchBuilder: any
  dataModelName: PrismaModelNames
  additional: additionalPropsType
  myTable: MyTableType
  include: anyObject
  session: anyObject
  query: anyObject
  easySearchExtraProps: anyObject
  useSql?: any
}
export type dataCountObject = {
  [key: string]: number
}

export type easySearchPrismaDataOnServer = {
  dataCountObject: dataCountObject
  availableEasySearchObj: EasySearchObject
}
