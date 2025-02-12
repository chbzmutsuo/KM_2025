'use client'
import React from 'react'
import NavItemWrapper, {getItemProps, navItemProps} from 'src/cm/components/layout/Navigation/NavItem/NavItemWrapper'

import {anyObject} from '@cm/types/types'

const NavItemChildren = React.memo((props: navItemProps) => {
  const {HK_NAV, item, nestLevel = 1, navWrapperIdx, horizontalMenu} = props

  const {hasChildren} = getItemProps({item, nestLevel})
  const menuStyle: anyObject = {zIndex: 1000}

  const {menuIsOpen} = HK_NAV

  if (!(menuIsOpen(navWrapperIdx) && hasChildren)) {
    return <></>
  }

  if (horizontalMenu) {
    return (
      <div>
        <div
          className={`
            absolute -left-[50px] top-full min-w-[180px]  bg-white
            shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200
          `}
          style={menuStyle}
        >
          <ul className={`py-1`}>
            {item?.children?.map((child, i) => {
              const nextLevel = nestLevel + 1
              return (
                <li key={i} className="border-b  hover:bg-gray-50">
                  <NavItemWrapper {...{...props, item: child, nestLevel: nextLevel}} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  } else {
    return (
      <div className="overflow-hidden">
        <ul className={`col-stack gap-0 pl-4 pt-1`}>
          {item?.children?.map((child, i) => {
            const nextLevel = nestLevel + 1
            return (
              <div key={i}>
                <NavItemWrapper {...{...props, item: child, nestLevel: nextLevel}} />
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
})

export default NavItemChildren
