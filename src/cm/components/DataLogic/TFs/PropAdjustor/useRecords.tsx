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
  initialModelRecords?: Awaited<ReturnType<typeof getInitModelRecordsProps>>
  fetchTime?: Date
}) => {
  const {serverFetchProps, initialModelRecords, fetchTime} = props
  const {asPath, query, showLoader} = useGlobal()

  const [easySearchPrismaDataOnServer, seteasySearchPrismaDataOnServer] = useState<easySearchDataSwrType>({
    dataCountObject: {},
    availableEasySearchObj: {},
    loading: true,
    noData: false,
    beforeLoad: true,
  })

  const [records, setrecords] = useState<tableRecord[] | null>(null)
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
      if (prev === null) return prev
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
      if (prev === null) return prev
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
    if (fetchTime && initialModelRecords) {
      const {data: InitialData, queries: InitialQueries} = initialModelRecords ?? {}
      const diff = new Date().getTime() - fetchTime.getTime()

      const mounted = diff > 1 * 1000

      //初回のみサーバーから取得
      if (mounted) {
        console.log(`initFetchTableRecords`)
        initFetchTableRecords()
      } else {
        console.log(`fetchOnMount`)

        //2回目はクライアントで更新
        setrecords(InitialData.records)
        settotalCount(InitialData.totalCount)
        seteasySearchPrismaDataOnServer(InitialData.easySearchPrismaDataOnServer)
        setEasySearcherQuery(InitialQueries.EasySearcherQuery)
        setprismaDataExtractionQuery(InitialQueries.prismaDataExtractionQuery)
      }
    } else {
      initFetchTableRecords()
    }
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
