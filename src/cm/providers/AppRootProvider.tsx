'use client'
import {RecoilEnv} from 'recoil'
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

import {fetcher} from 'src/cm/lib/swr'
import {SWRConfig} from 'swr'
import {SessionProvider} from 'next-auth/react'
export default function AppRootProvider({children}) {
  return (
    <SessionProvider>
      <SWRConfig value={{fetcher}}>{children}</SWRConfig>
    </SessionProvider>
  )
}
