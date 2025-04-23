'use client'

import AppLogo from 'src/cm/components/layout/Navigation/AppLogo'
import NavBar from 'src/cm/components/layout/Navigation/NavBar'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import Breadcrumbs from 'src/cm/components/layout/breadcrumbs/Breadcrumbs'
import {adminContext} from 'src/cm/components/layout/Admin'
import {Z_INDEX} from '@cm/lib/constants/constants'
import {HREF} from '@lib/methods/urls'
import React, {Fragment, useMemo} from 'react'
import {T_LINK} from '@components/styles/common-components/links'

export type HeaderProps = any

const Header = React.memo((props: {adminContext: adminContext}) => {
  const {adminContext} = props

  const {
    AppName,
    Logo,
    showLogoOnly,
    PageBuilderGetter,
    useGlobalProps,
    pathItemObject: {navItems, pages},
    ModelBuilder,
    horizontalMenu,
    menuContext: {MenuButton},
  } = adminContext

  const {device, query, rootPath, appbarHeight} = useGlobalProps ?? {}
  const {PC} = device ?? {}

  const GlobalIdSelector = useMemo(() => {
    return PageBuilderGetter?.class[PageBuilderGetter.getter]?.({useGlobalProps})
  }, [PageBuilderGetter, useGlobalProps])

  // return <div></div>
  const topLink = HREF(`/${rootPath}`, {}, query)

  return (
    <div
      style={{width: `100%`, zIndex: Z_INDEX.appBar, position: `fixed`, top: 0}}
      className={` shadow-primary-main bg-primary-light  shadow-sm`}
    >
      <div>
        <R_Stack style={{height: appbarHeight}} className={`justify-between px-2 py-0  md:px-6 `}>
          <R_Stack>
            {horizontalMenu === false && PC && MenuButton}
            <R_Stack className={`  gap-x-10`}>
              <T_LINK href={topLink} simple>
                <AppLogo {...{showLogoOnly, AppName, Logo}} />
              </T_LINK>
              {PC && <Breadcrumbs {...{breads: pages?.breads ?? [], ModelBuilder}} />}
            </R_Stack>
            {/* {isDev && <Alert color={`red`}>開発中</Alert>} */}
            <div>{GlobalIdSelector && <GlobalIdSelector />}</div>
            {/* {isDev && <div className={`text-error-main font-bold`}>==開発画面モード==</div>} */}
            {adminContext?.additionalHeaders?.map((d, idx) => {
              return <Fragment key={idx}>{d}</Fragment>
            })}
          </R_Stack>
          <R_Stack className={`ml-auto   items-center gap-2`}>
            <div>{horizontalMenu && <NavBar {...{useGlobalProps, appbarHeight, horizontalMenu, navItems}} />}</div>
          </R_Stack>
          {!PC && MenuButton}
        </R_Stack>
      </div>
    </div>
  )
})

export default Header
