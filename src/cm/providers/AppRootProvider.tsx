'use client'

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
