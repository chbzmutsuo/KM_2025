'use server'

import {SearchQuery} from '@components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/search-methods'

import {getEasySearchWhereAnd} from '@class/builders/QueryBuilderVariables'

import {makePrismaDataExtractionQuery} from '@components/DataLogic/TFs/ClientConf/makePrismaDataExtractionQuery'
import {getMyTableId} from '@components/DataLogic/TFs/MyTable/getMyTableId'
import {P_Query} from '@class/PQuery'
import {makeEasySearcherQuery} from '@components/DataLogic/TFs/ClientConf/makeEasySearcherQuery'
import {searchModels} from '@lib/methods/api-fetcher'
import {EasySearchDataSwrFetcher} from '@components/DataLogic/TFs/ClientConf/fetchers/EasySearchDataSwrFetcher'
import {prismaDataExtractionQueryType} from '@components/DataLogic/TFs/Server/Conf'

export type serverFetchProps = {
  DetailePageId
  EasySearchBuilder
  dataModelName
  additional
  myTable
  include
  session
  easySearchExtraProps
  useSql
  prismaDataExtractionQuery?: prismaDataExtractionQueryType
}
export const getInitModelRecordsProps = async (props: serverFetchProps & {query}) => {
  const {
    DetailePageId,
    EasySearchBuilder,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    easySearchExtraProps,
    useSql,
    query,
  } = props
  const {page, take, skip} = P_Query.getPaginationPropsByQuery({
    query,
    tableId: getMyTableId({dataModelName, myTable}),
    countPerPage: myTable?.pagination?.countPerPage,
  })

  const EasySearchBuilderFunc = await EasySearchBuilder?.()

  const easySearchObject = await EasySearchBuilderFunc?.[dataModelName]?.({
    additionalWhere: additional?.where,
    session,
    query,
    dataModelName,
    easySearchExtraProps: easySearchExtraProps,
  })

  const searchQueryAnd: any = SearchQuery.createWhere({dataModelName, query: query})
  const easySearchWhereAnd = getEasySearchWhereAnd({
    easySearchObject,
    query,
    additionalWhere: {...additional?.where},
  })
  const prismaDataExtractionQuery =
    props.prismaDataExtractionQuery ??
    makePrismaDataExtractionQuery({
      query,
      dataModelName,
      additional,
      myTable,
      DetailePageId,
      include,
      take,
      skip,
      page,
      easySearchWhereAnd,
      searchQueryAnd,
    })

  const EasySearcherQuery = await makeEasySearcherQuery({
    EasySearchBuilder,
    dataModelName,
    additional,
    session,
    query,
    easySearchExtraProps,
  })

  const {records, totalCount} = await searchModels(dataModelName, prismaDataExtractionQuery)

  const easySearchPrismaDataOnServer = await EasySearchDataSwrFetcher(EasySearcherQuery)

  return {
    queries: {
      EasySearcherQuery,
      prismaDataExtractionQuery,
    },
    data: {
      records,
      totalCount,
      easySearchPrismaDataOnServer,
    },
  }
}
