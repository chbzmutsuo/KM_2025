import {easySearchDataSwrType} from '@class/builders/QueryBuilderVariables'
import {useEffect, useState} from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {getInitModelRecordsProps, serverFetchProps} from '@components/DataLogic/TFs/ClientConf/fetchers/getInitModelRecordsProps'
export type tableRecord = {
  id: number
  [key: string]: any
}

const useRecords = (props: {
  serverFetchProps: serverFetchProps
  // modelName
  //  EasySearcherQuery; prismaDataExtractionQuery
}) => {
  const {serverFetchProps} = props
  const {asPath, query} = useGlobal()

  const [easySearchPrismaDataOnServer, seteasySearchPrismaDataOnServer] = useState<easySearchDataSwrType>({
    dataCountObject: {},
    availableEasySearchObj: {},
    loading: true,
    noData: false,
    beforeLoad: true,
  })

  const [records, setrecords] = useState<tableRecord[]>([])
  const [totalCount, settotalCount] = useState<number>(0)
  const [prismaDataExtractionQuery, setprismaDataExtractionQuery] = useState({})
  const [EasySearcherQuery, setEasySearcherQuery] = useState({})

  //データ更新関数
  const initFetchTableRecords = async () => {
    const {queries, data} = await getInitModelRecordsProps({
      ...serverFetchProps,
      query,
    })

    setEasySearcherQuery(queries.EasySearcherQuery)
    setprismaDataExtractionQuery(queries.prismaDataExtractionQuery)
    seteasySearchPrismaDataOnServer(data.easySearchPrismaDataOnServer)
    setrecords(data.records)
    settotalCount(data.totalCount)
  }

  const mutateRecords = ({record}) => {
    setrecords(prev => {
      const index = prev.findIndex(r => r.id === record?.id)
      if (index !== -1) {
        prev[index] = {...prev[index], ...record}
        return [...prev]
      } else {
        return [...prev, record]
      }
    })
  }

  const deleteRecord = ({record}) => {
    setrecords(prev => {
      const index = prev.findIndex(r => r.id === record?.id)
      if (index !== -1) {
        prev.splice(index, 1)
        return [...prev]
      } else {
        return [...prev]
      }
    })
  }

  useEffect(() => {
    initFetchTableRecords()
  }, [query])

  return {
    totalCount,
    records,
    setrecords,
    mutateRecords,
    deleteRecord,
    easySearchPrismaDataOnServer,

    EasySearcherQuery,
    prismaDataExtractionQuery,

    initFetchTableRecords,
  }
}

export default useRecords
