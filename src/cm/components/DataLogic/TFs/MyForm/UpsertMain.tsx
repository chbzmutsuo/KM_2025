'use client'

import {additionalPropsType, anyObject, requestResultType, upsertControllerType} from '@cm/types/types'

import {myFormDefaultUpsert} from 'src/cm/lib/formMethods'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {prismaDataExtractionQueryType} from '@components/DataLogic/TFs/Server/Conf'
import {toast} from 'react-toastify'
import {toastByResult} from '@lib/methods/api-fetcher'

export type UpsertMainProps = {
  latestFormData: anyObject
  upsertController: upsertControllerType | undefined
  extraFormState: anyObject
  dataModelName: PrismaModelNames
  additional: additionalPropsType
  formData: anyObject
  columns: anyObject
  prismaDataExtractionQuery: prismaDataExtractionQueryType
  toggleLoadFunc?: (props: any) => Promise<requestResultType>
}

export const UpsertMain = async (props: UpsertMainProps) => {
  const {additional, latestFormData, upsertController, extraFormState, dataModelName, formData, columns} = props

  const args = {latestFormData, extraFormState, dataModelName, additional, formData, columns}

  const toggleLoadFunc = additional?.toggleLoadFunc ?? (async cb => await cb())

  const errorResult: requestResultType = {
    success: false,
    message: 'このデータは更新できません',
    result: null,
  }

  if (typeof upsertController == 'object') {
    const {executeUpdate, validateUpdate, finalizeUpdate} = upsertController

    //更新するかどうか判定する
    const validateResultRequest = !validateUpdate
      ? {success: true, message: ''}
      : await validateUpdate?.({
          latestFormData,
          extraFormState,
          dataModelName,
          additional,
          formData,
          columns,
        })

    if (!validateResultRequest.success) {
      toast.error(validateResultRequest.message)
      return validateResultRequest
    }

    const res = await toggleLoadFunc(async () => {
      const createMethod = executeUpdate ?? myFormDefaultUpsert

      //メインの更新処理を実施する
      const res = await createMethod?.(args)
      toastByResult(res)

      //更新後の処理を実行する
      const res2 = await finalizeUpdate?.({res, formData})

      return res
    })
    return res
  } else {
    return errorResult
  }
}
