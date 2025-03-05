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

  const today = queryFrom
  const tomorrow = addDays(today, 1)
  const whereQuery = {
    date: {
      gte: today,
      lte: tomorrow,
    },
  }
  // today && queryTo
  //   ? {date: {gte: today, lte: queryTo}}
  //   : today
  //   ? {date: {gte: today, lte: addDays(today, 2)}}
  //   : {}

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

  const {result: allShiftBetweenDays} = await fetchUniversalAPI(`genbaDayShift`, `findMany`, {
    include: {GenbaDay: {}},
    where: {
      GenbaDay: {
        date: today ? {gte: today, lt: addDays(today, 1)} : undefined,
      },
    },
  })

  const todayRecords = records.filter(record => Days.isSameDate(record.date, today))
  const tomorrowRecords = records.filter(record => {
    console.log(record.date.getTime(), tomorrow.getTime()) //////logs
    return record.date.getTime() === tomorrow.getTime()
  })
  const isMyPage = query[`myPage`] === `true`

  return <GenbadayListClient {...{today, tomorrow, todayRecords, tomorrowRecords, isMyPage, allShiftBetweenDays}} />
}
