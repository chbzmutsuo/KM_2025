'use client'

import useGlobal, {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobal'

import React, {useEffect} from 'react'
import {ClientPropsType, prismaDataType, serverFetchihngDataType} from '@cm/types/types'
import {NestHandler} from 'src/cm/class/NestHandler'
import TableForm from 'src/cm/components/DataLogic/TFs/PropAdjustor/TableForm'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {HK_USE_RECORDS_TYPE} from 'src/cm/components/DataLogic/TFs/PropAdjustor/usePropAdjustorProps'
import {prismaDataExtractionQueryType} from 'src/cm/components/DataLogic/TFs/Server/Conf'

import DetailedPageCC from '@components/DataLogic/TFs/PropAdjustor/DetailedPageCC'
import EasySearcher from '@components/DataLogic/TFs/MyTable/EasySearcher/EasySearcher'
import {Z_INDEX} from '@lib/constants/constants'

export type PropAdjustorPropsType = {ClientProps: ClientPropsType; serverFetchihngData: serverFetchihngDataType}
const PropAdjustor = React.memo((props: PropAdjustorPropsType) => {
  const useGlobalProps = useGlobal()
  const {router, pathname} = useGlobalProps
  const {ClientProps} = props

  useEffect(() => {
    if (pathname === window.location.pathname) return

    router.refresh()
  }, [])

  const HK_USE_RECORDS: HK_USE_RECORDS_TYPE = useRecords({recordSource: props.serverFetchihngData.prismaData.records})

  const {formData, setformData} = useInitFormState(null, props.serverFetchihngData.prismaData.records)

  const columns = useColumns({
    useGlobalProps,
    HK_USE_RECORDS,
    dataModelName: ClientProps.dataModelName,
    ColBuilder: ClientProps.ColBuilder,
    ColBuilderExtraProps: ClientProps.ColBuilderExtraProps,
  })

  const {
    EasySearcherQuery,
    prismaDataExtractionQuery,
    easySearchObject,
    easySearchWhereAnd,
    prismaData,
    easySearchPrismaDataOnServer,
  } = props.serverFetchihngData

  const additional = useAdditional({additional: ClientProps.additional, prismaDataExtractionQuery})

  const EditForm = useEditForm({
    PageBuilderGetter: ClientProps.PageBuilderGetter,
    PageBuilder: ClientProps.PageBuilder,
    dataModelName: ClientProps.dataModelName,
  })

  const myTable = useMyTable({
    columns,
    displayStyle: ClientProps.displayStyle,
    myTable: ClientProps.myTable,
  })

  const ClientProps2: ClientPropsType2 = useMergeWithCustomViewParams({
    ...ClientProps,
    ...HK_USE_RECORDS,
    additional,
    EditForm,
    myTable,
    useGlobalProps,
    columns,
    formData,
    setformData,
    HK_USE_RECORDS,
    prismaData,
    prismaDataExtractionQuery,
    easySearchObject,
    easySearchWhereAnd,
  })

  if (props.serverFetchihngData.DetailePageId) return <DetailedPageCC {...{ClientProps2, prismaData}} />

  const {appbarHeight} = ClientProps2.useGlobalProps

  const hasEasySearch = Object.keys(easySearchPrismaDataOnServer?.availableEasySearchObj || {}).length > 0

  const {SearchingStatusMemo} = useSearchHandler({
    columns: ClientProps2.columns,
    dataModelName: ClientProps2.dataModelName,
    useGlobalProps,
  })

  const Top = SurroundingComponent({ClientProps2, type: 'top'})

  return (
    <div style={{...ClientProps2.displayStyle, paddingTop: 10}}>
      <div>
        <section
          {...{
            className: `  p-0`,
            style: {
              position: `sticky`,
              top: appbarHeight + 10,
              zIndex: Z_INDEX.EasySearcher,
              marginBottom: 12,
            },
          }}
        >
          <C_Stack className={`gap-1`}>
            {hasEasySearch && (
              <div>
                <EasySearcher
                  {...{
                    dataModelName: ClientProps2.dataModelName,
                    prismaDataExtractionQuery: ClientProps2.prismaDataExtractionQuery,
                    easySearchPrismaDataOnServer,
                    useGlobalProps,
                    HK_USE_RECORDS: ClientProps2.HK_USE_RECORDS,
                  }}
                />
              </div>
            )}

            {SearchingStatusMemo && <div>{SearchingStatusMemo}</div>}

            {Top && <div>{Top}</div>}
          </C_Stack>
        </section>

        <section {...{style: {zIndex: Z_INDEX.EasySearcher - 10}}}>
          <R_Stack className={`mx-auto items-start justify-around `}>
            {<SurroundingComponent {...{ClientProps2, type: 'left'}} />}

            <SurroundingComponent {...{ClientProps2, type: 'table'}} />

            {<SurroundingComponent {...{ClientProps2, type: 'right'}} />}
          </R_Stack>
        </section>
        <section className={`sticky bottom-0`}>
          <div>{<SurroundingComponent {...{ClientProps2, type: 'bottom'}} />}</div>
        </section>
      </div>
    </div>
  )
})

export default PropAdjustor

export type ClientPropsType2 = ClientPropsType & {
  HK_USE_RECORDS?: HK_USE_RECORDS_TYPE
  useGlobalProps: useGlobalPropType
  columns
  formData
  setformData
  records
  setrecords
  mutateRecords
  deleteRecord
  prismaData: prismaDataType
  prismaDataExtractionQuery: prismaDataExtractionQueryType
  easySearchObject?
  easySearchWhereAnd?
}
import {useSearchHandler} from '@components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/useSearchHandler/useSearchHandler'
import useColumns from '@components/DataLogic/TFs/PropAdjustor/useColumns'
import useRecords from '@components/DataLogic/TFs/PropAdjustor/useRecords'
import useInitFormState from '@hooks/useInitFormState'
import useEditForm from '@components/DataLogic/TFs/PropAdjustor/useEditForm'
import useMyTable from '@components/DataLogic/TFs/PropAdjustor/useMyTable'
import useAdditional from '@components/DataLogic/TFs/PropAdjustor/useAdditional'

const SurroundingComponent = ({type, ClientProps2}) => {
  const {PageBuilder, dataModelName} = ClientProps2
  const getter = `${dataModelName}.${type}`

  const ComponentMethod = PageBuilder ? NestHandler.GetNestedValue(getter, PageBuilder) : undefined
  if (ComponentMethod) {
    return ComponentMethod(ClientProps2)
  } else if (type === `table`) {
    return <TableForm {...ClientProps2} />
  }
}
import useMergeWithCustomViewParams from '@components/DataLogic/TFs/PropAdjustor/useMergeWithCustomViewParams'
