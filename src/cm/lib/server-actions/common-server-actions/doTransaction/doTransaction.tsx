'use server'

import prisma, {handlePrismaError} from 'src/cm/lib/prisma'
import {anyObject, dataModelNameType, requestResultType} from '@cm/types/types'
import {prismaMethodType} from '@cm/types/prisma-types'

export const doTransaction = async (props: {transactionQueryList: transactionQuery[]}) => {
  try {
    const {transactionQueryList} = props

    const models = {}

    const data = await prisma.$transaction(
      transactionQueryList.map(q => {
        const {model, method, queryObject} = q
        models[model] = true
        return prisma[model][method](queryObject)
      })
    )

    const message = `トランザクション---${Object.keys(models)
      .map(d => `【${d}】`)
      .join(', ')}の更新---${data.length}件`

    if (transactionQueryList.length > 0) {
      console.debug(message)
    }

    const result = {
      success: true,
      result: data,
      message,
    }
    return result as requestResultType
  } catch (error) {
    console.error(error.stack)
    const errorMessage = handlePrismaError(error)
    const message = `トランザクションエラー:【${errorMessage}】`

    return {success: false, message: message, result: null} as requestResultType
  }
}

export type transactionQuery = {
  model: dataModelNameType
  method: prismaMethodType
  queryObject: anyObject
  transactionPrisma?: any
}

export const testTransaction = async cb => {
  // return await prisma.$transaction(async prisma => {
  //   await cb()
  // })
}
