import fetchPonyfill from 'fetch-ponyfill'
import {FileHandler} from 'src/cm/class/FileHandler'

import {toast} from 'react-toastify'
import {FileData} from '@cm/types/file-types'
import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import {anyObject, colType, dataModelNameType, requestResultType} from '@cm/types/types'

import {doTransaction, transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {prismaDataExtractionQueryType} from '@components/DataLogic/TFs/Server/Conf'
import {doStandardPrisma, doStandardPrismaType} from '@lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import {searchByQuery} from '@lib/server-actions/common-server-actions/SerachByQuery/SerachByQuery'
import {MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'

type fetchOptionType = {
  method?: string
  headers?: anyObject
  cache?: 'no-store' | 'force-cache'
  revalidate?: number
  tags?: string[]
}
export async function fetchAlt(url: string, body: any, defaultOptions?: fetchOptionType, usefetchPonyfill?: any): Promise<any> {
  const defaultRevalidate = 0

  const {
    method = 'POST',
    headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public',
      // 'Authorization': `Bearer ${session?.accessToken}`,
    },
    revalidate = defaultRevalidate,
    tags = ['fetch-alt'],
  } = defaultOptions ?? {}

  const options: any = {
    method,
    headers,
    body: JSON.stringify(body),
    next: {revalidate, tags},
  }

  if (method === 'GET') {
    delete options.body
  }

  const fetchMethod = usefetchPonyfill === false ? fetch : fetchPonyfill().fetch

  const result = await fetchMethod(url, {...options})
    .then(async response => {
      const {status, headers, statusText} = response
      if (!response.status) {
        console.error(`fetchAlt error [status:${status}, statusText:${statusText}] `), {url, body}
        const result = await response.json()
        console.error(result)
      }

      if (!response.ok) {
        const res = await response.json()

        console.error(res)
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    })
    .catch(error => {
      console.error(error.stack)
      return error
    })
  return result
}

export const searchModels = async (modelNameAsStr: string, prismaDataExtractionQuery?: prismaDataExtractionQueryType) => {
  const modelName = modelNameAsStr as PrismaModelNames

  const {where, include, orderBy, skip, take, select} = prismaDataExtractionQuery ?? ({} as prismaDataExtractionQueryType)

  const result = await searchByQuery({
    modelName: modelName,
    where,
    include,
    orderBy,
    skip,
    take,
    select,
  })

  return {...result}
}

export type usePrismaOnServerPropType = {
  model: PrismaModelNames
  method: prismaMethodType
  queryObject: any
  transactionPrisma?: any
  // transactionQueryList: transactionQuery[]
  // fetchKey?: string
}

export const generarlFetchUniversalAPI = async (model: PrismaModelNames, method: prismaMethodType, queryObject: any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return fetchUniversalAPI(model, method, queryObject)
}

export const createUpdate = <T,>(payload: T): {create: T; update: T} => {
  return {
    create: payload,
    update: payload,
  }
}

export const fetchUniversalAPI: doStandardPrismaType = async (model, method, queryObject, transactionPrisma?: any) => {
  const {body, fetchKey} = buildUniversalRoutePayload(model, method, queryObject as anyObject)
  // const {fetchKey, ...body} = queryObject as anyObject
  const payload = {...body, transactionPrisma, fetchKey} as usePrismaOnServerPropType

  const data = await doStandardPrisma(
    //
    payload.model,
    payload.method,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    payload.queryObject,
    payload.transactionPrisma
  )

  return data

  function buildUniversalRoutePayload(model: dataModelNameType, method: prismaMethodType, queryObject: anyObject) {
    let fetchKey
    if (queryObject.fetchKey) {
      fetchKey = queryObject.fetchKey
      delete queryObject.fetchKey
    }

    const body = (() => {
      let convertedQueryObject = {...queryObject}
      const {where, include, create, update, ...data} = convertedQueryObject

      /**data / create / updateなどのpayloadを作成する */
      // switch (method) {
      //   case 'create':
      //   case 'update': {
      //     convertedQueryObject = {
      //       where,
      //       include,
      //       data: {...data},
      //     }
      //     break
      //   }

      //   case 'upsert': {
      //     convertedQueryObject = {where, include, create: create ?? data, update: update ?? data}
      //     break
      //   }
      // }
      convertedQueryObject = {...convertedQueryObject}

      const transactionQueryList: transactionQuery = {
        model,
        method,
        queryObject: convertedQueryObject,
      }
      return transactionQueryList
    })()

    return {body, fetchKey}
  }
}

export const fetchTransactionAPI = async (props: {transactionQueryList: transactionQuery[]}) => {
  const {transactionQueryList} = props

  const result: requestResultType = await doTransaction({transactionQueryList})

  return result
}

export const updateWithImageAndAddUrlToLatestFormData = async ({latestFormData, extraFormState, columns}) => {
  if (extraFormState?.files) {
    /**画像アップロードが必要な場合はそれを実行 */
    const {updatedFileObject} = await (async () => {
      const updatedFileObject: {
        [key: string]: requestResultType[]
      } = {}
      await Promise.all(
        Object.keys(extraFormState?.files ?? {}).map(async fileKey => {
          const fileArr: FileData[] = extraFormState?.files?.[fileKey]
          const col: colType = columns.flat().find(col => col.id === fileKey)

          const updatedFileResponsesForKey: requestResultType[] = await Promise.all(
            fileArr.map(async fileState => {
              const theFile = fileState.file
              const backetKey = col?.form?.file?.backetKey
              const updatedFileRes = await FileHandler.sendFileToS3({
                file: theFile,
                formDataObj: {
                  backetKey: `${backetKey}/${fileKey}`,
                  deleteImageUrl: latestFormData?.[fileKey],
                },
              })

              return updatedFileRes
            })
          )

          //**完了データを別オブジェクトに保存 */
          updatedFileObject[fileKey] = updatedFileResponsesForKey
          return updatedFileResponsesForKey
        })
      )
      return {updatedFileObject}
    })()

    Object.keys(updatedFileObject).forEach(fileKey => {
      const updatedFileResponsesForKey = updatedFileObject[fileKey]
      const updatedFileUrls = updatedFileResponsesForKey.map(res => {
        return res?.result?.url
      })
      latestFormData[fileKey] = updatedFileUrls[0]
    })

    return latestFormData
  }
  return latestFormData
}

export const toastByResult = (result: requestResultType) => {
  const {success, message, error} = result
  if (success === true) {
    toast.success(<MarkDownDisplay>{message}</MarkDownDisplay>)
  } else if (success === false) {
    // console.info(`ToasByResultエラー: ${message}`)
    toast.error(message)
  }
}
