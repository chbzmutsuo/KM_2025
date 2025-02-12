import {DH} from 'src/cm/class/DH'
import {mapAdjustOptionValue} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/MySelectMethods-server'
import {useEffect, useState} from 'react'
import useSWR from 'swr'

export const OptionsFromMannualFetch = ({CacheKeys, manualFetcheTargetCols, latestFormData}) => {
  const isReady = manualFetcheTargetCols?.length > 0
  const [Mannual_OP, setMannual_OP] = useState({})
  const {data, isValidating} = useSWR(CacheKeys.Mannual_OP, async () => {
    return await switchOptions({manualFetcheTargetCols, latestFormData})
  })

  useEffect(() => {
    if (data && isReady) {
      setMannual_OP(data)
    }
  }, [data])

  // useEffect(() => {
  //   if (isReady) {
  //     switchOptions({SWR_REQUEST_PARAMS, columns}).then(d => {
  //       setFetch_OP(d)
  //     })
  //   }
  // }, [CacheKeys?.Fetch_OP, isReady])

  // useEffect(() => {
  //   if (isReady) {
  //     switchOptions({manualFetcheTargetCols, latestFormData}).then(d => {
  //       setMannual_OP(d)
  //     })
  //   }
  // }, [isReady, CacheKeys.Mannual_OP])

  return Mannual_OP
}

const switchOptions = async ({manualFetcheTargetCols, latestFormData}) => {
  const newObject = {}
  for (const col of manualFetcheTargetCols) {
    if (col?.forSelect?.optionsOrOptionFetcher && typeof col?.forSelect?.optionsOrOptionFetcher === 'function') {
      const {optionObjArr} = await col?.forSelect?.optionsOrOptionFetcher({latestFormData, col})

      const values = mapAdjustOptionValue(optionObjArr)
      DH.makeObjectOriginIfUndefined(newObject, col.id, values)
    }
  }
  return newObject
}
