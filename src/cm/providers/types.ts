import useLoader from '@hooks/globalHooks/useLoader'
import useMyNavigation from '@hooks/globalHooks/useMyNavigation'
import useCustomSession from '@hooks/globalHooks/useMySession'

import useWindowSize from '@hooks/useWindowSize'

export type SessionContextType = ReturnType<typeof useCustomSession>
export type DeviceContextType = ReturnType<typeof useWindowSize>
export type LoaderContextType = ReturnType<typeof useLoader>
export type NavigationContextType = ReturnType<typeof useMyNavigation>

// 結合された型を定義
export type GlobalContextType = SessionContextType &
  DeviceContextType &
  LoaderContextType &
  NavigationContextType & {
    waitRendering: boolean
    showLoader: boolean
    useGlobalDeps: boolean[]
  }

// セレクター用の型
export type GlobalStateKeys = keyof GlobalContextType
