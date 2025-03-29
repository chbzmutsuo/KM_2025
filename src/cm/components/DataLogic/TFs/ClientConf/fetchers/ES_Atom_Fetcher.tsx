'use server'

import {P_Query} from '@class/PQuery'
import {PrismaModelNames} from '@cm/types/prisma-types'

import {additionalPropsType, anyObject, MyTableType, serverFetchihngDataType} from '@cm/types/types'
import {EasySearchObject} from 'src/cm/class/builders/QueryBuilderVariables'
import {getMyTableId} from '@components/DataLogic/TFs/MyTable/getMyTableId'
import {getInitModelRecordsProps} from '@components/DataLogic/TFs/ClientConf/fetchers/getInitModelRecordsProps'

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
