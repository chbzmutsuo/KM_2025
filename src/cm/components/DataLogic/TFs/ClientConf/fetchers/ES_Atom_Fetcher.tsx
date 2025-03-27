'use server'

import {P_Query} from '@class/PQuery'
import {getPrismaRowsBySql} from '@class/SqlBuilder/SqlBuilder'
import {PrismaModelNames} from '@cm/types/prisma-types'

import {additionalPropsType, anyObject, MyTableType, serverFetchihngDataType} from '@cm/types/types'
import {EasySearchObject, getEasySearchWhereAnd} from 'src/cm/class/builders/QueryBuilderVariables'
import {EasySearchDataSwrFetcher} from 'src/cm/components/DataLogic/TFs/ClientConf/fetchers/EasySearchDataSwrFetcher'
import {makePrismaDataExtractionQuery} from 'src/cm/components/DataLogic/TFs/ClientConf/makePrismaDataExtractionQuery'
import {searchModels} from '@lib/methods/api-fetcher'
import {getMyTableId} from '@components/DataLogic/TFs/MyTable/getMyTableId'
import {SearchQuery} from '@components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/search-methods'
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

export async function ES_Atom_Fetcher(props: ES_Atom_FetcherProps) {
  const {
    DetailePageId,
    EasySearchBuilder,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    query,
    easySearchExtraProps,
    useSql,
  } = props
  // const DetailePageId = params?.[`id`] ? Number(params?.[`id`]) : undefined

  const {page, take, skip} = P_Query.getPaginationPropsByQuery({
    query,
    tableId: getMyTableId({dataModelName, myTable}),
    countPerPage: myTable?.pagination?.countPerPage,
  })

  const EasySearchBuilderFunc = await EasySearchBuilder?.()
  const easySearchObject = await EasySearchBuilderFunc[dataModelName]?.({
    additionalWhere: additional?.where,
    session,
    query,
    dataModelName,
    easySearchExtraProps: easySearchExtraProps,
  })

  const easySearchWhereAnd = getEasySearchWhereAnd({
    easySearchObject,
    query,
    additionalWhere: {...additional?.where},
  })

  const {EasySearcherQuery, prismaDataExtractionQuery} = await getInitModelRecordsProps({
    DetailePageId,
    EasySearchBuilder,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    query,
    easySearchExtraProps,
    useSql,
  })

  const easySearchPrismaDataOnServer = await EasySearchDataSwrFetcher(EasySearcherQuery)

  let prismaData = await searchModels(dataModelName, prismaDataExtractionQuery)

  // ==================== 生のSQLを使う場合=============
  if (useSql) {
    const {rows, totalCount} = await getPrismaRowsBySql({
      ...useSql.getPrismaRowsBySqlArgs,
      page,
      take,
      skip,
    })
    prismaData = {records: rows, totalCount}
  }

  return {
    DetailePageId,
    easySearchObject,
    easySearchWhereAnd,
    prismaData,
    easySearchPrismaDataOnServer,

    prismaDataExtractionQuery,
    EasySearcherQuery,
  } as serverFetchihngDataType
}
