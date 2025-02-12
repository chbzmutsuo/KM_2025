'use client'
import {pathItemType} from 'src/non-common/path-title-constsnts'

const NavItemParent = dynamic(() => import('src/cm/components/layout/Navigation/NavItem/NavItemParent'), dynamicOptions)
const NavItemChildren = dynamic(() => import('src/cm/components/layout/Navigation/NavItem/NavItemChildren'), dynamicOptions)

import dynamic from 'next/dynamic'

import {dynamicOptions} from 'src/cm/components/utils/loader/dynamicOptions'
import useNavMenu from '@components/layout/Navigation/useNavMenu'
import React from 'react'

export type navItemProps = {
  useGlobalProps: any
  horizontalMenu: boolean
  HK_NAV: ReturnType<typeof useNavMenu>
  item: pathItemType
  nestLevel: number
  navWrapperIdx: number
}
const NavItemWrapper = React.memo((props: navItemProps) => {
  const {item} = props

  const isValid = item.exclusiveTo !== false && !item.hide

  if (isValid) {
    return (
      <div className={`  cursor-pointe relative   border-opacity-50  `}>
        <NavItemParent {...props} />
        <NavItemChildren {...props} />
      </div>
    )
  }

  return <></>
})

export default NavItemWrapper

export function getItemProps({item, nestLevel}) {
  const childrenCount = getChildrenCount(item)
  const hasChildren = childrenCount > 0 && nestLevel < 2
  const label = hasChildren ? (
    <div>
      <span>{item.label}</span>
    </div>
  ) : (
    item.label
  )
  const isParent = nestLevel === 1
  return {
    childrenCount,
    hasChildren,
    label,
    isParent,
  }
}

export const getChildrenCount = (item: pathItemType) => {
  const childrenCount: number =
    item?.children?.filter(d => {
      return d.hide !== true && d.exclusiveTo !== false
    }).length ?? 0
  return childrenCount
}
