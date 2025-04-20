'use client'

import React from 'react'

import DynamicLoader from '@components/utils/loader/Loader'
import {R_Stack} from '@components/styles/common-components/common-components'
import {cl, isDev, sleep} from '@cm/lib/methods/common'

import ColOptionModal from '@components/DataLogic/TFs/MyTable/Thead/ColOption/ColOptionModal'
import useInitGlobalHooks from '@hooks/globalHooks/useInitGlobalHooks'

import Loader from '@components/utils/loader/Loader'

import Redirector from '@components/utils/Redirector'
import useGlobal from '@hooks/globalHooks/useGlobal'

import {useScrollPosition} from '@hooks/scrollPosition/useScrollPosition'

import {usePageTracking} from '@hooks/usePageTracking'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {chain_sohken_genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/chain_sohken_genbaDayUpdateChain'
import {RefreshCwIcon} from 'lucide-react'

export default function Global_Template(props) {
  const {globalHooks, globalPropsReady} = useInitGlobalHooks()
  if (!globalHooks || globalPropsReady === false || globalHooks?.waitRendering === true) return <Loader />
  const {router, pathname} = globalHooks

  if (pathname === `/` && process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH) {
    return <Redirector {...{redirectPath: `/${process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH}`}} />
  }

  return <Main {...{children: props.children, router}} />
}

const Main = ({children, router}) => {
  const {headerMargin, showLoader, appbarHeight, rootPath, toggleLoad, accessScopes} = useGlobal()
  const {admin} = accessScopes()
  useScrollPosition()
  usePageTracking()
  return (
    <div>
      <ColOptionModal />
      {showLoader && <DynamicLoader />}
      <div id="poratal-root-top-fixed"></div>
      <div
        id="main-wrapper"
        className="bg-sub-light/40 min-h-screen "
        style={
          rootPath === `apex`
            ? {}
            : {
                overscrollBehavior: 'none',
                paddingTop: appbarHeight + headerMargin,
              }
        }
      >
        {children}
      </div>

      <R_Stack id="portal-root-bottom-fixed" className={cl(` fixed bottom-0 w-full  `)}></R_Stack>

      <div className={`fixed bottom-1 right-1`}>
        <R_Stack>
          {isDev && (
            <button
              className={` t-btn`}
              onClick={async () => {
                toggleLoad(async () => {
                  const {result: genbaList} = await fetchUniversalAPI(`genba`, 'findMany', {})

                  for (const genba of genbaList) {
                    const res = await fetchUniversalAPI(`genbaDay`, `updateMany`, {
                      where: {genbaId: genba.id},
                      data: {finished: false, active: true, status: null},
                    })

                    await chain_sohken_genbaDayUpdateChain({genbaId: genba.id})

                    await sleep(300)
                  }
                })
              }}
            >
              PLAY
            </button>
          )}
          <button className={`w-7`} {...{onClick: () => router.refresh()}}>
            <RefreshCwIcon />
          </button>
        </R_Stack>
      </div>
    </div>
  )
}
