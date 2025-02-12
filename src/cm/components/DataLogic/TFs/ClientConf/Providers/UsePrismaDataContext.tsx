'use client'
import {prismaDataType, serverFetchihngDataType} from '@cm/types/types'
import {createContext, useContext} from 'react'
import {ClientPropsType} from '@cm/types/types'

import {EasySearchAtomContext} from 'src/cm/components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import usePrismaDataSwr from 'src/cm/components/DataLogic/TFs/ClientConf/usePrismaDataSwr'

import Loader from 'src/cm/components/utils/loader/Loader'

export const UsePrismaDataContext = createContext<prismaDataType>({
  records: [],
  totalCount: 0,
  noData: false,
  loading: true,
  beforeLoad: true,
})
export default function UsePrismaDataProvider(props: {
  ClientProps: ClientPropsType
  serverFetchihngData?: serverFetchihngDataType
  children: any
}) {
  const {ClientProps, serverFetchihngData} = props
  const {dataModelName, additional} = ClientProps
  const {prismaDataExtractionQuery, easySearchObject, easySearchWhereAnd} = useContext(EasySearchAtomContext)
  const {prismaData} = usePrismaDataSwr({dataModelName, prismaDataExtractionQuery})

  if (prismaData.beforeLoad) {
    return <Loader>Loading ...</Loader>
  }

  return <UsePrismaDataContext.Provider value={prismaData}>{props.children}</UsePrismaDataContext.Provider>
}
