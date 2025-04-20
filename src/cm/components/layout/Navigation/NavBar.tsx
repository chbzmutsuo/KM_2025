'use client'
import {pathItemType} from 'src/non-common/path-title-constsnts'
import React from 'react'

import {cl} from 'src/cm/lib/methods/common'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'
import dynamic from 'next/dynamic'
import useNavMenu from '@components/layout/Navigation/useNavMenu'

import {UserConfig} from '@components/layout/UserConfig'
import NavItemWrapper from '@components/layout/Navigation/NavItem/NavItemWrapper'

const NavBar = React.memo((props: {useGlobalProps; horizontalMenu; navItems}) => {
  const {useGlobalProps, horizontalMenu, navItems} = props

  const HK_NAV = useNavMenu()

  const items = navItems
  const ulClass = `${horizontalMenu ? 'row-stack ' : 'col-stack  px-1 '} w-full gap-2 `

  return (
    <div
      id="navBar"
      onMouseLeave={() => {
        horizontalMenu && HK_NAV.handleCloseMenu(HK_NAV.activeNavWrapper)
      }}
      style={{height: useGlobalProps?.appbarHeight}}
      className={cl(ulClass, ` h-full`)}
    >
      {items?.map((item: pathItemType, navWrapperIdx: number) => {
        const childrenCount: number = item?.children?.length ?? 0
        if (childrenCount === 1) {
          item = item?.children?.[0] ?? item
        }

        if (!item?.hide && item?.exclusiveTo !== false) {
          return (
            <div key={navWrapperIdx}>
              <NavItemWrapper
                {...{
                  useGlobalProps,
                  horizontalMenu,
                  HK_NAV,
                  nestLevel: 1,
                  navWrapperIdx,
                  item,
                }}
              />
            </div>
          )
        }
      })}
      <UserConfig />
    </div>
  )
})
export default NavBar
