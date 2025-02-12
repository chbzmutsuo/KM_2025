import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {prismaMethodType} from '@cm/types/prisma-types'
import {anyObject, dataModelNameType} from '@cm/types/types'
import useSWR from 'swr'

const usefetchUniversalAPI_SWR = (
  model: dataModelNameType,
  method: prismaMethodType,
  queryObject: anyObject,
  options?: {
    deps: any[]
  }
) => {
  const key = JSON.stringify({model, method, queryObject, deps: options?.deps})

  const {data, isValidating, error, mutate} = useSWR(key, async () => {
    const res = await fetchUniversalAPI(model, method, queryObject)

    return res.result
  })

  return {data: data, isLoading: !data && !error, isValidating, error, mutate}
}

export default usefetchUniversalAPI_SWR
