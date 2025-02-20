import NippoForm from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/NippoForm'
import {Starter} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Starter'
import {groups} from '@app/(apps)/tsukurunger/class/constants'
import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import {Days, formatDate} from '@class/Days'
import {CenterScreen} from '@components/styles/common-components/common-components'

import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {Prisma, TsMachinery, TsMaterial, TsRegularSubcontractor, TsSubcontractor, TsWorkContent, User} from '@prisma/client'
import React from 'react'

export default async function Page(props) {
  const query = await props.searchParams
  const params = await props.params
  const tsConstructionId = Number(params.tsConstructionId)

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({
    query,
    firstDayOfMonth: Days.getMonthDatum(new Date()).firstDayOfMonth,
    defaultWhere: {from: formatDate(new Date())},
  })

  if (redirectPath) {
    return <Redirector {...{redirectPath}} />
  }

  const include = {
    TsNippo: {
      include: QueryBuilder.getInclude({}).tsNippo.include,
      where: {date: whereQuery},
    },
  }

  const payload: Prisma.TsConstructionFindManyArgs = {
    where: {id: tsConstructionId},
    include: {...include, TsMainContractor: {}},
  }
  const {result: Genba} = await fetchUniversalAPI(`tsConstruction`, `findUnique`, {...payload})

  const user = await prisma.user.findMany({
    where: {apps: {has: `tsukurunger`}},
    orderBy: [{sortOrder: `asc`}],
  })
  const tsRegularSubcontractor = await prisma.tsRegularSubcontractor.findMany({orderBy: [{sortOrder: `asc`}]})
  const tsSubcontractor = await prisma.tsSubcontractor.findMany({orderBy: [{sortOrder: `asc`}]})
  const tsMachinery = await prisma.tsMachinery.findMany({orderBy: [{sortOrder: `asc`}]})
  const tsMaterial = await prisma.tsMaterial.findMany({orderBy: [{sortOrder: `asc`}]})
  const tsWorkContent = await prisma.tsWorkContent.findMany({
    where: {tsConstructionId: tsConstructionId},
    orderBy: [{sortOrder: `asc`}],
  })

  const materialGroups = groups

  const nippoOptions: nippoOptions = {
    user,
    tsRegularSubcontractor,
    tsSubcontractor,
    tsMachinery,
    tsMaterial,
    tsWorkContent,
  }

  materialGroups.forEach(group => {
    const groupKey = `tsMaterial_${group.name}`
    const options = tsMaterial.filter(material => {
      return group.keys.includes(material.materialType ?? ``)
    })
    nippoOptions[groupKey] = options
  })

  if (Genba.TsNippo.length >= 2) return <div>日報は一日一回のみ登録できます</div>
  if (Genba.TsNippo.length === 0) {
    return (
      <CenterScreen>
        <Starter {...{Genba, query}} />
      </CenterScreen>
    )
  }
  return (
    <div>
      <NippoForm
        {...{
          Genba,
          nippoOptions,
          materialGroups,
        }}
      />
    </div>
  )
}
export type nippoOptions = {
  user: User[]
  tsRegularSubcontractor: TsRegularSubcontractor[]
  tsSubcontractor: TsSubcontractor[]
  tsMachinery: TsMachinery[]
  tsMaterial: TsMaterial[]
  tsWorkContent: TsWorkContent[]
}
