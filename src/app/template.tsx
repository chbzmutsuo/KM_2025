'use client'

import React from 'react'

import DynamicLoader from '@components/utils/loader/Loader'
import {R_Stack} from '@components/styles/common-components/common-components'
import {cl, isDev} from '@cm/lib/methods/common'

import ColOptionModal from '@components/DataLogic/TFs/MyTable/Thead/ColOption/ColOptionModal'
import useInitGlobalHooks from '@hooks/globalHooks/useInitGlobalHooks'

import Loader from '@components/utils/loader/Loader'

import Redirector from '@components/utils/Redirector'
import useGlobal from '@hooks/globalHooks/useGlobal'

import {useScrollPosition} from '@hooks/scrollPosition/useScrollPosition'

import {usePageTracking} from '@hooks/usePageTracking'

export default function Global_Template(props) {
  const {globalHooks, globalPropsReady} = useInitGlobalHooks()
  if (!globalHooks) return <Loader />
  const {router, waitRendering, appbarHeight, headerMargin, pathname} = globalHooks

  if (waitRendering || globalPropsReady === false) return <Loader />
  if (pathname === `/` && process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH) {
    return <Redirector {...{redirectPath: `/${process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_PATH}`}} />
  }

  return <Main {...{children: props.children, router}} />
}

const Main = ({children, router}) => {
  const {headerMargin, showLoader, appbarHeight, rootPath} = useGlobal()
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

      {isDev && (
        <div className={`fixed bottom-1 right-1`}>
          <button className={` t-btn`} {...{onClick: () => router.refresh()}}>
            更新
          </button>
        </div>
      )}
    </div>
  )
}
