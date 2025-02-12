export type useGlobalPropType = ReturnType<typeof useGlobalOrigin>

import {atomTypes, useJotaiByKey} from '@hooks/useJotai'
import {RecoilEnv} from 'recoil'

import useGlobalOrigin from 'src/cm/hooks/globalHooks/useGlobalOrigin'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

export default function useGlobal(place?: any) {
  const data = useJotaiByKey<atomTypes[`globalHooks`]>(`globalHooks`, null)

  const globalHooks = data[0] as useGlobalPropType

  return globalHooks
}
