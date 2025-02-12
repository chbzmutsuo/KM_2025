'use server'
import {requestResultType} from '@cm/types/types'
import {usePrismaOnServerPropType} from '@lib/methods/api-fetcher'

import {
  doDefaultPrismaMethod,
  doDelete,
  doDeleteMany,
  initQueryObject,
} from '@lib/server-actions/common-server-actions/doStandardPrisma/lib'
import {prismaChain} from 'src/non-common/prismaChain'

type doStandardPrismaType = (props: usePrismaOnServerPropType) => Promise<requestResultType>
export const doStandardPrisma: doStandardPrismaType = async (props: usePrismaOnServerPropType) => {
  const {model, method, transactionPrisma} = props

  const PRISMA = transactionPrisma || prisma
  const prismaModel = PRISMA[model] as any

  const queryObject = await initQueryObject({model, method, queryObject: props.queryObject, prismaModel})

  let res: requestResultType

  //処理の実行
  try {
    switch (method) {
      case 'delete': {
        res = await doDelete({prismaModel, queryObject, model, method})
        break
      }

      case 'deleteMany': {
        res = await doDeleteMany({prismaModel, queryObject, model, method})
        break
      }

      default: {
        res = await doDefaultPrismaMethod({prismaModel, method, queryObject, model})
        break
      }
    }

    const chainMethod = prismaChain[model]?.find(e => e.when.includes(method))?.do
    if (chainMethod) {
      const chainRes: requestResultType = await executeChainMethod(async () => {
        return await chainMethod({res, queryObject})
      })
      return {
        ...chainRes,
        result: res.result,
      }
    }
    return res
  } catch (error) {
    const errorMessage = handlePrismaError(error)
    console.error({errorMessage, model, method, queryObject, error: error.stack})
    return {success: false, message: errorMessage, error: error.message, result: null}
  }
}

import prisma, {handlePrismaError} from '@lib/prisma'

const executeChainMethod = async callback => {
  // 現在のロック状態をチェック
  const lockRecord = await prisma.chainMethodLock.findUnique({
    where: {id: 1}, // IDが固定されている場合
  })

  const now = new Date()

  // ロックがかかっているか、ロックの有効期限が切れていないか確認
  if (lockRecord && lockRecord.isLocked && lockRecord.expiresAt && lockRecord.expiresAt > now) {
    console.debug('他のプロセスが実行中です。処理をスキップします。')
    return {success: false, message: '他のプロセスが実行中です。処理をスキップします。', result: null} as requestResultType
  }

  try {
    const data = {
      isLocked: true,
      expiresAt: new Date(now.getTime() + 60000), // 60秒後にロックが解除される
    }
    // ロックを設定（有効期限を60秒後に設定）
    await prisma.chainMethodLock.upsert({
      where: {id: 1},
      create: data,
      update: data,
    })

    // チェーンメソッドの実行
    console.debug('チェーンメソッドを実行します')
    const res: requestResultType = await callback()

    return res
  } catch (error) {
    console.error(error.stack)
    return {success: false, message: 'エラーが発生しました', result: null} as requestResultType
  } finally {
    console.debug(`lock解除`)
    const data = {
      isLocked: false,
      expiresAt: null,
    }
    // ロック解除
    await prisma.chainMethodLock.upsert({
      where: {id: 1},
      create: data,
      update: data,
    })
  }
}
