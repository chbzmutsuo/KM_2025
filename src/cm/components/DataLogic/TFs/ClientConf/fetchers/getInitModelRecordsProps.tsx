import {SearchQuery} from '@components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/search-methods'

import {getEasySearchWhereAnd} from '@class/builders/QueryBuilderVariables'

import {makePrismaDataExtractionQuery} from '@components/DataLogic/TFs/ClientConf/makePrismaDataExtractionQuery'
import {getMyTableId} from '@components/DataLogic/TFs/MyTable/getMyTableId'
import {P_Query} from '@class/PQuery'
import {EasySearchDataSwrFetcher} from '@components/DataLogic/TFs/ClientConf/fetchers/EasySearchDataSwrFetcher'
import {makeEasySearcherQuery} from '@components/DataLogic/TFs/ClientConf/makeEasySearcherQuery'

export async function getInitModelRecordsProps({
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
}) {
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

  const searchQueryAnd: any = SearchQuery.createWhere({dataModelName, query: query})
  const easySearchWhereAnd = getEasySearchWhereAnd({
    easySearchObject,
    query,
    additionalWhere: {...additional?.where},
  })
  const prismaDataExtractionQuery = makePrismaDataExtractionQuery({
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
  return {
    EasySearcherQuery,
    prismaDataExtractionQuery,
  }
}
