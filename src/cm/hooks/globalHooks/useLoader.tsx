import {RecoilEnv} from 'recoil'
import {handleDB} from 'src/cm/lib/methods/common'

import useMyNavigation from 'src/cm/hooks/globalHooks/useMyNavigation'
import useMatchMutate from 'src/cm/hooks/useMatchMutate'

import {atomTypes, useJotaiByKey} from '@hooks/useJotai'
import {requestResultType} from '@cm/types/types'
import {toast} from 'react-toastify'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
export type toggleLoadType = (
  callback: any,
  options?: {
    refresh?: boolean
    mutate?: boolean
  }
) => Promise<any>

export default function useLoader() {
  const [globalLoaderAtom, setglobalLoaderAtom] = useJotaiByKey<atomTypes[`globalLoader`]>(`globalLoader`, false)

  const {router, pathname} = useMyNavigation()
  const mutateAll = useMatchMutate()

  const toggleLoad: toggleLoadType = async (callback, options) => {
    setglobalLoaderAtom(true)
    const {refresh = true, mutate = false} = options ?? {}

    const res = await handleDB(async () => await callback())

    setglobalLoaderAtom(false)
    if (mutate) {
      mutateAll()
    }
    if (refresh) {
      router.refresh()
    }

    return res
  }

  const toastIfFailed = async (res: requestResultType) => {
    if (res.success === false) {
      toast.error(res.message)
      router.refresh()
    }
  }
  const fullLoad = async callback => {
    await toggleLoad(callback, {refresh: true, mutate: true})
  }

  const useLoaderDeps = [globalLoaderAtom]

  return {
    toastIfFailed,
    globalLoaderAtom,
    toggleLoad,
    fullLoad,
    useLoaderDeps,
  }
}
