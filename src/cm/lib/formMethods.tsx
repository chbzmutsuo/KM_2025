import {DH} from 'src/cm/class/DH'
import {generarlFetchUniversalAPI, updateWithImageAndAddUrlToLatestFormData} from '@lib/methods/api-fetcher'
import {isMultiItem, updateMultiItemInTransaction} from 'src/cm/lib/methods/multipleItemLib'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import {additionalPropsType, anyObject, colType, dataModelNameType, multipleSelectProps, requestResultType} from '@cm/types/types'
import {Days} from 'src/cm/class/Days'
import {getSchema} from '@lib/methods/prisma-schema'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'

export type myFormDefaultUpsertPropType = {
  latestFormData: anyObject
  extraFormState: anyObject
  dataModelName: dataModelNameType
  additional: additionalPropsType
  formData: any
  columns
}

export const myFormDefaultUpsert: (props: myFormDefaultUpsertPropType) => Promise<requestResultType> = async (
  props: myFormDefaultUpsertPropType
) => {
  const {latestFormData, extraFormState, dataModelName, additional, formData, columns} = props
  const latestFormDataWithImageUrl = await updateWithImageAndAddUrlToLatestFormData({
    latestFormData,
    extraFormState,
    columns,
  })

  Object.keys(latestFormDataWithImageUrl).forEach(key => {
    const value = latestFormDataWithImageUrl[key]
    const col = columns.flat().find(col => col.id === key)

    if (col) {
      latestFormDataWithImageUrl[key] = DH.convertDataType(value, col.type, 'server')
    }
  })

  const res: requestResultType = await updateSimply({
    columns,
    latestFormData: latestFormDataWithImageUrl,
    dataModelName,
    additionalPayload: additional?.payload,
    additionalInclude: {...additional?.include},
    initialModelData: formData,
    extraFormState,
  })

  // ==========②中間テーブルのリレーションを組む==========

  return res
}

export const updateSimply = async (props: {
  columns: any[]
  latestFormData: anyObject
  dataModelName: PrismaModelNames
  additionalPayload?: object
  additionalInclude?: object
  initialModelData: any
  extraFormState: anyObject
}) => {
  const {columns, latestFormData, dataModelName, additionalPayload, additionalInclude, initialModelData, extraFormState} = props

  //=============複数選択の場合=============
  const MultiItems = columns.flat().filter(col => isMultiItem(col.id))
  const cleansedFormData = {...latestFormData}

  MultiItems.forEach(obj => {
    delete cleansedFormData[obj.id] //親子構造のモデルは除去し、別途処理する
  })

  const {id, modelBasicData, relationIds} = separateFormData({
    latestFormData: cleansedFormData,
    additionalPayload,
    columns,
  })

  //==========リレーションを削除し、後でトランザクションで処理==========

  const midTableTargetCols = columns.flat().filter(col => {
    if (col.multipleSelect) {
      delete modelBasicData[col.id]
      return true
    }
  })

  const payload = {
    ...additionalPayload, //元々最後に設置してアップデートする予定でだったが、初期値とするように設定
    ...modelBasicData,
    ...relationIds,
    // include: additionalInclude,
  }

  columns.flat().forEach(col => {
    if (col.type === 'file' && !payload[col.id]) {
      //空で更新した際に、ファイルが削除されてしまうので、ファイルの削除を防ぐ
      delete payload[col.id]
    }
    if (col?.form?.send === false) {
      delete payload[col.id]
    }
  })

  const updatedModelRes = await generarlFetchUniversalAPI(dataModelName, 'upsert', {
    where: {id: id ?? 0},
    create: payload,
    update: payload,
  })

  await updateMultiItemInTransaction({
    MultiItems,
    latestFormData,
    initialModelData,
    updatedModelRes,
    dataModelName,
    fetchTransactionAPI,
  })

  if (midTableTargetCols.length > 0) {
    const createdData = updatedModelRes.result

    const midTableTransactionQuery: transactionQuery[] = []

    midTableTargetCols.forEach((col: colType) => {
      const {
        models: {parent, mid, option, uniqueWhereKey},
      } = col.multipleSelect as multipleSelectProps

      const selectedValues = extraFormState[col.id]

      Object.keys(selectedValues).forEach(optionId => {
        const isActive = selectedValues[optionId]

        const payload = {
          [`${parent}Id`]: createdData?.id,
          [`${option}Id`]: Number(optionId),
        }

        if (isActive) {
          midTableTransactionQuery.push({
            model: mid,
            method: `upsert`,
            queryObject: {
              where: {[uniqueWhereKey]: payload},
              create: payload,
              update: payload,
            },
          })
        } else {
          const dataRegistered = latestFormData[DH.capitalizeFirstLetter(mid)]
          if (dataRegistered.find(data => data[`${option}Id`] === Number(optionId))) {
            midTableTransactionQuery.push({
              model: mid,
              method: `delete`,
              queryObject: {
                where: {[uniqueWhereKey]: payload},
              },
            })
          }
        }
      })
    })

    await fetchTransactionAPI({transactionQueryList: midTableTransactionQuery})
  }

  return updatedModelRes
}

const separateFormData = ({latestFormData, additionalPayload, columns}) => {
  Object.keys(additionalPayload ?? {}).forEach(key => {
    if (latestFormData[key]) {
      delete additionalPayload[key]
    }
  })

  const prismaDataObject = {...latestFormData, ...additionalPayload}

  const relationIdOrigin = {...prismaDataObject}
  const modelBasicDataOrigin = {...prismaDataObject}

  const prismaSchema = getSchema()
  // const Omit = [`Assessment_ID`, `APPINDEX`, `KJ_KAINMEI1`]
  const Omit = Object.keys(prismaSchema)

  // const relationalModelObject = {}
  Object.keys(modelBasicDataOrigin).forEach(key => {
    const col = columns.flat().find(col => col.id === key)
    const isNonDateObject =
      !Array.isArray(modelBasicDataOrigin[key]) &&
      typeof modelBasicDataOrigin[key] === 'object' &&
      !Days.isDate(modelBasicDataOrigin[key]) &&
      modelBasicDataOrigin[key] !== null

    const isRelationalId = key.includes('Id')

    const firstLetter = key.slice(0, 1)

    const startsWithCapital = /^[A-Z]+$/.test(key.slice(0, 1)) && isNaN(Number(firstLetter)) && Omit.includes(key)

    const formHidenTrue = col?.form?.hidden === true

    if (isNonDateObject || isRelationalId || startsWithCapital || formHidenTrue) {
      /**リレーション先の削除 */
      delete modelBasicDataOrigin[key]
    }
  })

  const {id, ...modelBasicData} = modelBasicDataOrigin
  const relationIds = {}
  Object.keys(relationIdOrigin).forEach(key => {
    if (key.match(/.+Id/)) {
      const modelName = DH.capitalizeFirstLetter(key.replace('Id', ''))

      const relationalTableId = prismaDataObject[key]

      if (relationalTableId) {
        relationIds[modelName] = {connect: {id: relationalTableId}}
      }
    }
  })

  return {
    id,
    modelBasicData,
    relationIds,
  }
}
