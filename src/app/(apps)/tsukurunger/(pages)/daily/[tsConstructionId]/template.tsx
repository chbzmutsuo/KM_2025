'use client'
import {IsMyConstruction} from '@app/(apps)/tsukurunger/(roles)/roler-lib'
import {R_Stack} from '@components/styles/common-components/common-components'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'

import {HREF} from '@lib/methods/urls'
import {Prisma} from '@prisma/client'
import Link from 'next/link'
import {useParams} from 'next/navigation'
import React, {Fragment} from 'react'

export default function Template({children}) {
  const params = useParams()
  const {PC, pathname, appbarHeight, accessScopes} = useGlobal()
  const constructionId = Number(params?.['tsConstructionId'])
  const {subConRole} = accessScopes().getTsukurungerScopes()

  return (
    <div>
      {PC && (
        <div
          style={{
            position: `absolute`,
            right: `4px`,
            top: `${appbarHeight + 10}px`,
            zIndex: 10,
          }}
        >
          {!subConRole && <ConstructionLinks {...{constructionId}} />}
        </div>
      )}
      {children}
    </div>
  )
}

export const ConstructionLinks = ({constructionId}) => {
  const {query, pathname, session, accessScopes} = useGlobal()
  const {subConRole} = accessScopes().getTsukurungerScopes()
  const links = [
    {label: `日報入力`, href: `/tsukurunger/daily/${constructionId}/input`},
    {label: `原価表`, href: `/tsukurunger/daily/${constructionId}/expense`},
    {label: `出来高内訳`, href: `/tsukurunger/daily/${constructionId}/progress`},
    {label: `現場詳細（契約内訳/日報一覧）`, href: `/tsukurunger/tsConstruction/${constructionId}`},
  ]

  const params = useParams()
  const {data: myConstruction} = usefetchUniversalAPI_SWR(`tsConstruction`, `findUnique`, {
    where: {id: Number(params?.tsConstructionId ?? 0), ...IsMyConstruction({session})},
  } as Prisma.TsConstructionFindManyArgs)

  if (params?.tsConstructionId !== undefined) {
    if (myConstruction === undefined) {
      return <PlaceHolder />
    } else if (subConRole && myConstruction === null) {
      return <div>このページは存在しません</div>
    }
  }

  return (
    <>
      <R_Stack className={` justify-end`}>
        {links.map((d, i) => {
          const active = pathname.includes(d.href)
          return (
            <Fragment key={i}>
              <Link
                key={i}
                className={active ? 'disabled   t-btn rounded-md text-white' : 't-link'}
                href={HREF(d.href, {}, query)}
              >
                {d.label}
              </Link>
            </Fragment>
          )
        })}
      </R_Stack>
    </>
  )
}
