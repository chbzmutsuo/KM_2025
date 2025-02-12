// import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
// import React from 'react'
// import useSWR from 'swr'

import {userForSelect} from '@app/(apps)/sohken/class/sohken-constants'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export type ditributeOptionsType = {
  user: any
}

export const fetchGenbadayOptions = async () => {
  const {result: user} = await fetchUniversalAPI('user', 'findMany', {
    where: userForSelect.config.where,
  })

  return {
    user,
  }
}
