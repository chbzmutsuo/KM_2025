import { generarlFetchUniversalAPI} from '@lib/methods/api-fetcher'

import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import useSWR from 'swr'

const usefetchUniversalAPI_SWR = <T extends PrismaModelNames, M extends prismaMethodType>(
  model: T,
  method: M,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  queryObject: Parameters<PrismaClient[T][M]>[0],
  options?: {deps: any[]}
) => {
  const key = JSON.stringify({model, method, queryObject, deps: options?.deps})

  const {data, isValidating, error, mutate} = useSWR(key, async () => {
    const res = await generarlFetchUniversalAPI(model, method, queryObject)

    return res.result
  })

  return {data: data, isLoading: !data && !error, isValidating, error, mutate}
}

export default usefetchUniversalAPI_SWR
