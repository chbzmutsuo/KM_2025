'use client'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {useEffect, useState} from 'react'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {anyObject} from '@cm/types/types'

const useDetailedModelData = ({paramsId, pathname, ModelBuilder}) => {
  const [dataById, setdataById] = useState<any>(null)

  const [breadCrumbDisplay, setbreadCrumbDisplay] = useState<any>(null)

  const pathnameSplit = String(pathname).split('/')
  const pathnameSplitWithoutNumber = pathnameSplit.filter(d => isNaN(Number(d)))

  const modelName = pathnameSplitWithoutNumber[pathnameSplitWithoutNumber.length - 1]

  const getters = ModelBuilder?.[`breadCrumbDisplayMethods`]

  useEffect(() => {
    if (paramsId) {
      const getter: getter = getters?.[modelName] ?? defaultGetter

      getter?.(modelName as PrismaModelNames, paramsId).then(res => {
        const {dataById, displayName} = res ?? {}
        setdataById(dataById)
        setbreadCrumbDisplay(displayName)
      })
    }
  }, [pathname, paramsId, modelName, getters, ModelBuilder])

  return {
    breadCrumbDisplay,
    paramsId,
    dataById,
    setdataById,
  }
}

export default useDetailedModelData

export type getter = (modelName: PrismaModelNames, paramsId: string) => Promise<{displayName: any; dataById: anyObject}>
const defaultGetter: getter = async (modelName, paramsId) => {
  if (modelName) {
    const {result: dataById} = await fetchUniversalAPI(modelName, `findUnique`, {where: {id: Number(paramsId)}})
    const displayName = dataById?.name ?? '詳細'
    return {dataById, displayName}
  } else {
    return {dataById: null, displayName: null}
  }
}
