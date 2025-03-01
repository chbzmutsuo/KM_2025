//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {addDays} from 'date-fns'
import {Days, toUtc} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import GenbadayListClient from '@app/(apps)/sohken/(pages)/genbaDay/GenbadayListClient'
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
  const isMyPage = query[`myPage`] === `true`

  return <GenbadayListClient {...{today, tomorrow, todayRecords, tomorrowRecords, isMyPage, allShiftBetweenDays}} />
}
