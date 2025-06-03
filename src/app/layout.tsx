export const dynamic = 'force-dynamic'
import 'src/cm/styles/globals.css'

import {Suspense} from 'react'
import {Metadata} from 'next'
import GlobalToast from '@components/utils/GlobalToast'

import React from 'react'

import {getServerSession, Session} from 'next-auth'
import {authOptions} from '@app/api/auth/authOptions'
import SessionContextProvider from '@hooks/useGlobalContext/providers/SessionContextProvider'

const title = process.env.NEXT_PUBLIC_TITLE
export const metadata: Metadata = {title: title}

export default async function AppRootLayout(props) {
  const session = (await getServerSession(authOptions)) as Session

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        {/* <StrictMode> */}

        <Suspense>
          <SessionContextProvider>
            <GlobalToast></GlobalToast>
            {props.children}
          </SessionContextProvider>
        </Suspense>
        {/* </StrictMode> */}
      </body>
    </html>
  )
}
