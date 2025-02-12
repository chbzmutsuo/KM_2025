import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {Days, getMidnight} from '@class/Days'
import {C_Stack, Padding} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {Prisma} from '@prisma/client'
import React, {Fragment} from 'react'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {Paper} from '@components/styles/common-components/paper'

export default async function Page(props) {
  const query = await props.searchParams
  const {session} = await initServerComopnent({query})

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({
    query,
    firstDayOfMonth: Days.getMonthDatum(new Date()).firstDayOfMonth,
    defaultWhere: {
      from: getMidnight(),
    },
  })

  if (redirectPath) return <Redirector {...{redirectPath}} />

  const GenbaDayFindManyArgs: Prisma.GenbaDayFindManyArgs = {
    where: {
      date: whereQuery,
      GenbaDayShift: {
        some: {
          userId: session?.id ?? 0,
        },
      },
    },
    orderBy: [{date: 'asc'}],
    include: QueryBuilder.getInclude({}).genbaDay.include,
  }
  const {result: genbaDay} = await fetchUniversalAPI(`genbaDay`, 'findMany', GenbaDayFindManyArgs)

  return (
    <Padding>
      <C_Stack className={`gap-6`}>
        <NewDateSwitcher {...{selectPeriod: true}} />

        <C_Stack className={`gap-10`}>
          {genbaDay.map(gDay => {
            return (
              <Fragment key={gDay.id}>
                <Paper {...{className: `w-fit mx-auto`}}>
                  {/* <GenbaDaySummary
                    {...{
                      editable: false,
                      HK_USE_RECORDS: true,
                      GenbaDay: gDay,
                    }}
                  /> */}
                </Paper>
              </Fragment>
            )
          })}
        </C_Stack>

        {/* <MyPageCC {...{genbaDay}} /> */}
      </C_Stack>
    </Padding>
  )
}
