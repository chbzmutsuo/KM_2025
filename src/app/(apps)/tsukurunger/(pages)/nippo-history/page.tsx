import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'
import NippoHistoryCC from '@app/(apps)/tsukurunger/(pages)/nippo-history/nippoHistoryCC'
import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import {Center} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {Prisma} from '@prisma/client'
import React from 'react'

export default async function page(props) {
  const query = await props.searchParams;
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) {
    return <Redirector {...{redirectPath}} />
  }

  const args: Prisma.TsConstructionFindManyArgs = {
    where: {
      TsNippo: {
        some: {
          date: whereQuery,
        },
      },
    },

    orderBy: [{sortOrder: `asc`}, {createdAt: `asc`}],
    include: {
      TsMainContractor: {},
      TsNippo: {
        where: {date: whereQuery},
        orderBy: [{date: `asc`}],
        include: QueryBuilder.getInclude({}).tsNippo.include,
      },
    },
  }
  let {result: GenbaWithNippoInPeriodList} = await fetchUniversalAPI(`tsConstruction`, `findMany`, args)

  //アクティブな日報のみに
  GenbaWithNippoInPeriodList = GenbaWithNippoInPeriodList.map(d => {
    const activeNippo = d.TsNippo.map(nippo => {
      const NippoCl = new TsNippo(nippo)
      const sum = NippoCl.getTotalPrice().sum
      return {...nippo, sum}
    })

    return {...d, TsNippo: activeNippo}
  })

  return (
    <Center>
      <div>
        <NewDateSwitcher {...{monthOnly: true}} />
        <NippoHistoryCC {...{GenbaWithNippoInPeriodList}} />
      </div>
    </Center>
  )
}
