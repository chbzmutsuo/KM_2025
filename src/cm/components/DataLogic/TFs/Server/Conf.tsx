import {ClientPropsType} from '@cm/types/types'
import {ES_Atom_Fetcher} from 'src/cm/components/DataLogic/TFs/ClientConf/fetchers/ES_Atom_Fetcher'

export type prismaDataExtractionQueryType = {
  where?: any
  include?: any
  orderBy?: any
  select?: any
  omit?: any
  take?: number
  skip?: number
}

//関数
export const Conf = async props => {
  const {params, session, query, customParams, ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder, EasySearchBuilder} = props

  const {dataModelName, additional, QueryBuilderExtraProps, easySearchExtraProps, myTable} = customParams ?? {}

  const include = QueryBuilder.getInclude({session, query, QueryBuilderExtraProps})?.[dataModelName]?.include

  const ClientProps: ClientPropsType = {
    params,
    ...{ColBuilder, ViewParamBuilder, PageBuilder, EasySearchBuilder},
    ...customParams,
    include,
  }

  const serverFetchihngData = await ES_Atom_Fetcher({
    useSql: props?.customParams?.useSql,
    DetailePageId: params?.[`id`] ? Number(params?.[`id`]) : undefined,
    EasySearchBuilder,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    query,
    easySearchExtraProps,
  })

  return {ClientProps, serverFetchihngData}
}

// export const getDefaultCountPerPage = countPerPage => {
//   const defaultCountPerPage = 20

//   return result
// }
