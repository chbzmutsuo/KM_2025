import {ClientPropsType} from '@cm/types/types'
import {getInitModelRecordsProps} from '@components/DataLogic/TFs/ClientConf/fetchers/getInitModelRecordsProps'

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

  const serverFetchProps = {
    DetailePageId: params?.[`id`] ? Number(params?.[`id`]) : undefined,
    EasySearchBuilder,
    dataModelName,
    additional,
    myTable,
    include,
    session,
    easySearchExtraProps,
    useSql: undefined,
  }

  const initialModelRecords = await getInitModelRecordsProps({
    ...serverFetchProps,
    query,
  })

  const fetchTime = new Date()

  return {
    fetchTime,
    initialModelRecords,
    ClientProps,
    serverFetchProps,
  }
}
