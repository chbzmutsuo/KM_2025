'use client'

import React from 'react'
import {R_Stack} from '@components/styles/common-components/common-components'
import {sleep} from '@cm/lib/methods/common'
import ColOptionModal from '@components/DataLogic/TFs/MyTable/components/Thead/ColOption/ColOptionModal'
import Loader from '@components/utils/loader/Loader'
import {useScrollPosition} from '@hooks/scrollPosition/useScrollPosition'
import {usePageTracking} from '@hooks/usePageTracking'
import {RefreshCwIcon} from 'lucide-react'
import {twMerge} from 'tailwind-merge'
import {useGlobalContext} from '@hooks/useGlobalContext/hooks/useGlobalContext'

// 新しいContext方式のインポート

export default function GlobalTemplate({children}) {
  const {showLoader, rootPath, toggleLoad} = useGlobalContext()

  useScrollPosition()
  usePageTracking()

  return (
    <div>
      <ColOptionModal />
      {showLoader && <Loader />}
      <div id="poratal-root-top-fixed"></div>
      <div
        {...{
          id: 'main-wrapper',
          className: 'bg-background min-h-screen',
          style: rootPath === `apex` ? {} : {overscrollBehavior: 'none'},
        }}
      >
        {children}
      </div>

      <R_Stack id="portal-root-bottom-fixed" className={twMerge(`fixed bottom-0 w-full`)} />
      <div className={`fixed bottom-6 right-6`}>
        <button className={`w-7 onHover`} onClick={async () => await toggleLoad(async () => sleep(500))}>
          <RefreshCwIcon />
        </button>
      </div>
    </div>
  )
}
