import {DH} from 'src/cm/class/DH'
import {ChildCreatorProps} from 'src/cm/components/DataLogic/RTs/ChildCreator/ChildCreator'

import useInitFormState from 'src/cm/hooks/useInitFormState'
import {additionalPropsType, colType, MyTableType, prismaDataType} from '@cm/types/types'

import useRecords from 'src/cm/components/DataLogic/TFs/PropAdjustor/useRecords'
import {prismaDataExtractionQueryType} from 'src/cm/components/DataLogic/TFs/Server/Conf'

import {searchModels} from '@lib/methods/api-fetcher'
import useSWR from 'swr'
import {checkShowHeader} from '@components/DataLogic/TFs/PropAdjustor/updateMyTable'

export default function useInitChildCreator(props: ChildCreatorProps) {
  const {
    NoDatawhenParentIsUndefined,
    ParentData,
    models,
    additional,
    nonRelativeColumns = [],
    EditForm,
    editType,
    useGlobalProps,
  } = props
  const {parentModelIdStr, childrenModelIdStr} = getModelData()
  const columns = convertColumns()

  const orderBy = additional?.orderBy ? additional?.orderBy : [{sortOrder: 'asc'}, {id: 'asc'}]

  const tunedAdditional: additionalPropsType = {
    ...additional,
    payload: {...additional?.payload, [parentModelIdStr]: ParentData?.id},
  }

  const prismaDataExtractionQuery: prismaDataExtractionQueryType = {
    where: {
      [parentModelIdStr]: ParentData?.id,
      ...tunedAdditional?.where,
    },
    include: additional?.include ? additional?.include : undefined,
    orderBy,
    take: undefined,
  }

  const dataSwitchDeps = [
    props.useGlobalProps.pathname,
    props.models.children,
    props.useGlobalProps.query,
    // dataUpdated,
    prismaDataExtractionQuery,
  ]

  const {
    data = {
      records: [],
      totalCount: 0,
      loading: true,
      noData: false,
    },
    mutate: mutateThicChildCreator,
  } = useSWR(JSON.stringify(dataSwitchDeps), async () => {
    return await searchModels(models.children, {...prismaDataExtractionQuery, take: undefined, skip: undefined})

    // const Children = ParentData[DH.capitalizeFirstLetter(models.children)]

    // if (Children) {
    //   return {records: Children, totalCount: Children.length}
    // } else {
    //   return await searchModels(models.children, {...prismaDataExtractionQuery, take: undefined, skip: undefined})
    // }
  })
  const prismaData = data as prismaDataType

  const recordSource = prismaData?.records ?? []
  const showHeader = checkShowHeader({myTable: props.myTable, columns})
  const childTableProps = {
    myTable: {
      showHeader: checkShowHeader({myTable: props.myTable, columns}),
      ...{pagination: false, sort: false, drag: false, search: false},
      ...props.myTable,
    } as MyTableType,

    myForm: {...props.myForm},
  }

  const {records, setrecords, mutateRecords, deleteRecord} = useRecords({recordSource})

  const {formData, setformData} = useInitFormState(null, prismaData?.records ?? [])

  const myTable = childTableProps.myTable

  const myForm = childTableProps.myForm

  return {
    prismaDataExtractionQuery,
    ...{ParentData, models, NoDatawhenParentIsUndefined, tunedAdditional},
    //以下、ChildCreatorに渡す
    ...{dataModelName: models.children, columns},
    ...{prismaData, formData, setformData},
    ...{records, setrecords, mutateRecords, deleteRecord},
    ...{myTable, myForm, additional: tunedAdditional, EditForm, editType, useGlobalProps},
    mutateThicChildCreator,
  }
  function getModelData() {
    const parentModelIdStr = models.parent ? DH.lowerCaseFirstLetter(models.parent) + 'Id' : ''

    const childrenModelIdStr = models.children ? DH.lowerCaseFirstLetter(models.children) + 'Id' : ''

    return {
      parentModelIdStr,
      childrenModelIdStr,
    }
  }

  function convertColumns() {
    const columns = props.columns as unknown as colType[][]
    // わかりきっているカラムは削除
    columns.forEach((rows, i) => {
      rows.forEach((col: {id: any}, j: any) => {
        if (nonRelativeColumns.includes(col?.id)) {
          columns[i].splice(j, 1)
        }
      })
    })
    return columns
  }

  // function getPrismaData() {
  //   let prismaData = forcedPirsmaData ?? {records: [], totalCount: 0}

  //   if (!forcedPirsmaData) {
  //     const {data} = usefetchUniversalAPI_SWR(models.children, 'findMany', {
  //       where: {
  //         [parentModelIdStr]: ParentData?.id,
  //         ...tunedAdditional?.where,
  //       },
  //       include: additional?.include ? additional?.include : undefined,
  //       orderBy,
  //     })

  //     prismaData = {records: data ?? [], totalCount: data?.length ?? 0}
  //   }
  //   const recordSource = prismaData?.records ?? []
  //   return {prismaData, recordSource}
  // }
}
