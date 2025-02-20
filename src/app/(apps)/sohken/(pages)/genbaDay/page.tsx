//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {addDays} from 'date-fns'
import {Days, formatDate, toUtc} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import GenbaDaySummary from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/GenbaDaySummary'
import {C_Stack, Circle, Padding, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const params = await props.params
  const {session, scopes} = await initServerComopnent({query})

  const genbaId = query.genbaId ? Number(query.genbaId) : undefined
  const queryFrom = query.from ? toUtc(query.from) : null
  const queryTo = query.to ? toUtc(query.to) : null
  if (!queryFrom) {
    return <div>日付を選択してください</div>
  }
  const whereQuery =
    queryFrom && queryTo
      ? {date: {gte: queryFrom, lte: queryTo}}
      : queryFrom
      ? {date: {gte: queryFrom, lt: addDays(queryFrom, 2)}}
      : {}

  const include = QueryBuilder.getInclude({}).genbaDay.include
  const {result: records} = await fetchUniversalAPI(`genbaDay`, `findMany`, {
    include,
    where: {
      genbaId,
      OR: [{status: {not: `不要`}}, {status: null}],
      ...whereQuery,
    },
    orderBy: [
      //
      {date: `asc`},
      {Genba: {PrefCity: {sortOrder: `asc`}}},
    ],
  })

  const today = queryFrom
  const tomorrow = addDays(queryFrom, 1)
  const {result: allShiftBetweenDays} = await fetchUniversalAPI(`genbaDayShift`, `findMany`, {
    include: {GenbaDay: {}},
    where: {
      GenbaDay: {
        date: queryFrom ? {gte: queryFrom, lt: addDays(queryFrom, 1)} : undefined,
      },
    },
  })

  const todayRecords = records.filter(record => Days.isSameDate(record.date, today))
  const tomorrowRecords = records.filter(record => Days.isSameDate(record.date, tomorrow))

  return (
    <Padding>
      <R_Stack className={` mx-auto w-full  max-w-[1500px]  items-start  justify-center   gap-10   lg:justify-end`}>
        <div>
          <strong>{formatDate(today)}</strong>
          <C_Stack className={` gap-8    p-2`}>
            {todayRecords.map((GenbaDay, i) => {
              return (
                <div key={GenbaDay.id}>
                  <Paper className={` p-2.5`}>
                    <R_Stack>
                      <Circle {...{width: 24}}>{i + 1}</Circle>
                      <GenbaDaySummary
                        {...{
                          allShiftBetweenDays,
                          records: todayRecords,
                          GenbaDay,
                          editable: true,
                        }}
                      />
                    </R_Stack>
                  </Paper>
                </div>
              )
            })}
          </C_Stack>
        </div>
        <div>
          <strong>{formatDate(tomorrow)}</strong>
          <C_Stack className={` gap-8 p-2`}>
            {tomorrowRecords.map((GenbaDay, i) => {
              return (
                <div key={GenbaDay.id}>
                  <Paper className={` p-2.5`}>
                    <R_Stack>
                      <Circle {...{width: 24}}>{i + 1}</Circle>
                      <GenbaDaySummary
                        {...{
                          allShiftBetweenDays,
                          records: tomorrowRecords,
                          GenbaDay,
                          editable: true,
                        }}
                      />
                    </R_Stack>
                  </Paper>
                </div>
              )
            })}
          </C_Stack>
        </div>
      </R_Stack>
    </Padding>
  )
}
