'use client'

import {breadType} from 'src/non-common/path-title-constsnts'

import React, {Fragment} from 'react'

import {cl} from 'src/cm/lib/methods/common'
import {HREF} from 'src/cm/lib/methods/urls'

import useDetailedModelData from 'src/cm/components/layout/breadcrumbs/useDetailedModelData'

import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'
import {R_Stack} from '@components/styles/common-components/common-components'
import {ChevronDoubleRightIcon} from '@heroicons/react/20/solid'
import {useParams} from 'next/navigation'

import {T_LINK} from '@components/styles/common-components/links'

const Breadcrumbs = React.memo((props: {breads: breadType[]; ModelBuilder}) => {
  const {breads, ModelBuilder} = props

  const paramsId = useParams()?.id

  const {query, pathname} = useGlobal()
  const {breadCrumbDisplay} = useDetailedModelData({paramsId, pathname, ModelBuilder})

  const BreadLink = React.memo((props: {isActive; bread}) => {
    const {isActive, bread} = props
    return (
      <div className={cl(isActive ? 't-link onHover' : ' pointer-events-none opacity-75')}>
        {isActive ? <T_LINK href={HREF(bread.href, {}, query)}>{bread.label}</T_LINK> : <strong>{bread.label}</strong>}
      </div>
    )
  })
  const processes = [
    ...breads.map((bread: breadType, index: number) => {
      const isActive = index !== breads.length - 1 || query.paramsId
      return {
        isActive,
        component: <BreadLink {...{bread, isActive}} />,
      }
    }),
  ]
  if (paramsId) {
    processes.push({
      isActive: true,
      component: <BreadLink {...{bread: {label: breadCrumbDisplay}, isActive: false}} />,
    })
  }

  return (
    <>
      <R_Stack className={` w-fit gap-0.5 `}>
        {processes.map((p, i) => {
          const {isActive = true, component} = p

          return (
            <Fragment key={i}>
              <R_Stack className={`gap-1`}>
                <span className={`${isActive ? '' : ' opacity-40'}`}>{component}</span>
              </R_Stack>
              <div> {i !== processes.length - 1 && <ChevronDoubleRightIcon className={`  font-bold`} />}</div>
            </Fragment>
          )
        })}
      </R_Stack>
    </>
  )
})

export default Breadcrumbs
