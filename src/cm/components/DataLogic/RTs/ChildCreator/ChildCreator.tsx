'use client'

import {dataMinimumCommonType, form_table_modal_config, anyObject, prismaDataType} from '@cm/types/types'

import {NoData} from 'src/cm/components/styles/common-components/common-components'
import {PrismaModelNames} from '@cm/types/prisma-types'
import React, {JSX} from 'react'
import TableForm from 'src/cm/components/DataLogic/TFs/PropAdjustor/TableForm'

import useInitChildCreator from 'src/cm/components/DataLogic/RTs/ChildCreator/useInitChildCreator'

import {useParams} from 'next/navigation'

export type ChildCreatorProps = dataMinimumCommonType &
  form_table_modal_config & {
    NoDatawhenParentIsUndefined?: () => JSX.Element
    ParentData: anyObject
    models: {
      parent: PrismaModelNames
      children: PrismaModelNames
    }
    nonRelativeColumns?: string[]
    forcedPirsmaData?: prismaDataType
  }

export const ChildCreator = (props: ChildCreatorProps) => {
  const params = useParams()
  const {
    ParentData,
    models,
    columns,
    EditForm,
    editType,
    useGlobalProps,
    myTable,
    myForm,
    NoDatawhenParentIsUndefined,
    records,
    setrecords,
    mutateRecords,
    deleteRecord,
    totalCount,
    formData,
    setformData,
    tunedAdditional,
    prismaDataExtractionQuery,
    initFetchTableRecords,
  } = useInitChildCreator({...props})

  const defaultToggleLoadFunc = async cb => {
    const result = await cb()
    return result
  }
  const toggleLoadFunc = props.additional?.toggleLoadFunc ?? defaultToggleLoadFunc

  return (
    <div className={`w-fit`}>
      {!ParentData?.id ? (
        NoDatawhenParentIsUndefined?.() ?? <NoData>データ作成後に登録可能</NoData>
      ) : (
        <TableForm
          {...{
            params: params as any,
            easySearchPrismaDataOnServer: {},
            prismaDataExtractionQuery,
            ...{dataModelName: models.children, columns},
            ...{formData, setformData},
            ...{records, setrecords, mutateRecords, deleteRecord, totalCount},
            ...{
              myTable,
              myForm,
              additional: {...tunedAdditional, toggleLoadFunc},
              EditForm,
              editType,
              useGlobalProps,
            },
          }}
        />
      )}
    </div>
  )
}

export default ChildCreator
