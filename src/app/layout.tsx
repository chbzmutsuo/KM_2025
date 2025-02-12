import 'src/cm/styles/globals.css'

import AppRootProvider from 'src/cm/providers/AppRootProvider'

import {Suspense} from 'react'
import {Metadata} from 'next'
import GlobalToast from '@components/utils/GlobalToast'

export const dynamic = 'auto'

export const metadata: Metadata = {
  title: 'App',
}

export default async function AppRootLayout(props) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {/* <StrictMode> */}

        <Suspense>
          <GlobalToast></GlobalToast>
          <AppRootProvider>{props.children}</AppRootProvider>
        </Suspense>
        {/* </StrictMode> */}
      </body>
    </html>
  )
}
