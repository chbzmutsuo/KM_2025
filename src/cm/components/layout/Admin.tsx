'use client'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'
import Redirector from 'src/cm/components/utils/Redirector'
import React, {useCallback, useEffect, useState} from 'react'
import Loader from 'src/cm/components/utils/loader/Loader'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'

const NavBar = dynamic(() => import('src/cm/components/layout/Navigation/NavBar'), {loading: () => <PlaceHolder />})
const Header = dynamic(() => import('src/cm/components/layout/Header'), {loading: () => <PlaceHolder />})
const Drawer = dynamic(() => import('src/cm/components/layout/Navigation/Drawer'), {loading: () => <PlaceHolder />})

import {PageBuilderGetterType} from '@cm/types/types'
import {MenuButton} from 'src/cm/components/layout/MenuButton'
import {identifyPathItem, PAGES} from 'src/non-common/path-title-constsnts'
import {HREF} from 'src/cm/lib/methods/urls'
import {DH} from 'src/cm/class/DH'

import dynamic from 'next/dynamic'
import {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobalOrigin'
import {rootPaths} from 'src/middleware'
import {MetaData} from '@components/layout/MetaData'

export type adminProps = {
  AppName: string | JSX.Element
  Logo?: any
  PagesMethod: string
  children?: JSX.Element
  additionalHeaders?: JSX.Element[]
  PageBuilderGetter?: PageBuilderGetterType
  showLogoOnly?: boolean
  ModelBuilder?: any
  getTopPageLink?: getTopPageLinkType
  navBarPosition?: 'left' | 'top'
}

export type menuContext = {
  isOpen
  setIsOpen
  toggleMenu
  MenuButton: JSX.Element
}

export type getTopPageLinkType = (props: {session: any}) => string
export type adminContext = adminProps & {
  horizontalMenu: boolean
  pathItemObject: ReturnType<typeof getPathItemRelatedProps>
  useGlobalProps: useGlobalPropType
  getTopPageLink?: getTopPageLinkType
  menuContext: menuContext
}

const Admin = (props: adminProps) => {
  const useGlobalProps = useGlobal()

  const {AppName, PagesMethod, children} = props
  const {session, pathname, rootPath, query, device, waitRendering, status, roles} = useGlobalProps

  const {PC} = device ?? {}
  const horizontalMenu = PC && (props.navBarPosition ?? `top`) === `top`

  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, query])

  const toggleMenu = () => setIsOpen(!isOpen)

  const pathItemObject = getPathItemRelatedProps({PagesMethod, useGlobalProps})

  const MainDisplay = useCallback(() => {
    return (
      <div>
        <MetaData {...{pathItemObject, AppName}} />
        {children}
      </div>
    )
  }, [children, pathItemObject, AppName])

  if (waitRendering || status === `loading` || useGlobalProps.waitRendering) {
    return <Loader />
  }

  const {invalidCheck} = getInvalidCheck()

  if (invalidCheck && !waitRendering && roles !== undefined) {
    return <Redirector redirectPath={invalidCheck.path} />
  }

  const menuContext: menuContext = {
    isOpen,
    setIsOpen,
    toggleMenu,
    MenuButton: <MenuButton onClick={toggleMenu} />,
  }

  const adminContext: adminContext = {
    ...props,
    pathItemObject,
    useGlobalProps,
    ...{navBarPosition: props.navBarPosition ?? `top`, horizontalMenu},
    menuContext,
  }

  //不要なクエリを削除する
  const cleanedQuery = DH.clean({...query})

  const needToRedirect = Object.keys(query).some(key => !cleanedQuery[key])
  if (needToRedirect) {
    console.warn(`redirected because of undefined query parameter`)
    const redirectPath = HREF(pathname, cleanedQuery, query)
    return <Redirector redirectPath={redirectPath} />
  }

  return (
    <div>
      {PC
        ? renderOnPc({MainDisplay, adminContext, menuContext, useGlobalProps, horizontalMenu, pathItemObject})
        : renderOnSp({MainDisplay, adminContext, menuContext, useGlobalProps, horizontalMenu, pathItemObject})}
    </div>
  )

  /**redirect */
  function getInvalidCheck() {
    const pathChecks = rootPaths
      .filter(path => path.rootPath === rootPath)
      .map(d => {
        const rootPath = d.rootPath
        const GET_PAGE_METHOD_NAME = `${rootPath}_PAGES`

        const PAGE_GETTER = PAGES[GET_PAGE_METHOD_NAME]

        const allPathsPattenrs = PAGE_GETTER({session, rootPath, pathname, query, roles}).allPathsPattenrs

        const check = checkValidAccess({
          allPathsPattenrs,
          pathname,
          origin: '',
        })

        return check
      })

    const invalidCheck = pathChecks.find(item => item.valid === false)

    return {invalidCheck}
    type checkValidAccessPropTYpe = {
      pathname: string
      origin: string
      allPathsPattenrs: any[]
    }

    function checkValidAccess(props: checkValidAccessPropTYpe) {
      const {allPathsPattenrs, pathname, origin = ''} = props
      const matchedPathItem = identifyPathItem({allPathsPattenrs, pathname})

      if (matchedPathItem?.exclusiveTo === false) {
        const rootPath = matchedPathItem?.href?.split('/')[1]

        const path = `${origin}/not-found?rootPath=${rootPath}`
        return {valid: false, path}
      } else {
        return {valid: true, path: ''}
      }
    }
  }
}

export default Admin

function getPathItemRelatedProps({PagesMethod, useGlobalProps}) {
  const {roles, session, pathname, rootPath, query, dynamicRoutingParams} = useGlobalProps

  const pageGetterprops = {session, pathname, rootPath, query, dynamicRoutingParams, roles}
  const pages = PAGES[PagesMethod]?.(pageGetterprops)
  const {allPathsPattenrs} = pages ?? {}
  const matchedPathItem = identifyPathItem({allPathsPattenrs, pathname})
  const {navItems} = pages ?? {}

  return {matchedPathItem, navItems, pages}
}

const renderOnPc = ({MainDisplay, adminContext, menuContext, useGlobalProps, horizontalMenu, pathItemObject}) => {
  return (
    <div>
      <Header {...{adminContext}} />

      {adminContext.navBarPosition === `left` && (
        <>
          <Drawer {...{menuContext}}>
            <NavBar {...{useGlobalProps, horizontalMenu, navItems: pathItemObject.navItems}} />
          </Drawer>
        </>
      )}
      <MainDisplay />
    </div>
  )
}

const renderOnSp = ({MainDisplay, adminContext, menuContext, useGlobalProps, horizontalMenu, pathItemObject}) => {
  return (
    <div className={`sticky top-0`}>
      <Header {...{adminContext}} />
      <Drawer {...{menuContext}}>
        <NavBar {...{useGlobalProps, horizontalMenu, navItems: pathItemObject.navItems}} />
      </Drawer>

      <MainDisplay />
    </div>
  )
}
