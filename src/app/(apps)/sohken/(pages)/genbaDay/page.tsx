//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {addDays} from 'date-fns'
import {Days, toUtc} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import GenbadayListClient from '@app/(apps)/sohken/(pages)/genbaDay/GenbadayListClient'
import {SOHKEN_CONST} from '@app/(apps)/sohken/(constants)/SOHKEN_CONST'
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
  const where = {
    GenbaDay: {
      date: today ? {gte: today, lt: addDays(today, 1)} : undefined,
    },
  }

  records.sort((a, b) => {
    if (a.date.getTime() === b.date.getTime()) {
      // 第一順位: PrefCityのsortOrder
      const aPrefCitySortOrder = a.Genba?.PrefCity?.sortOrder || 0
      const bPrefCitySortOrder = b.Genba?.PrefCity?.sortOrder || 0

      if (aPrefCitySortOrder !== bPrefCitySortOrder) {
        return aPrefCitySortOrder - bPrefCitySortOrder
      }

      // 第二順位: SOHKEN_CONST.OPTIONS.CONSTRUCTIONのインデックスで並び替え
      const aConstruction = a.Genba?.construction || ''
      const bConstruction = b.Genba?.construction || ''
      const constructionOptions = SOHKEN_CONST.OPTIONS.CONSTRUCTION
      const aIndex = constructionOptions.indexOf(aConstruction)
      const bIndex = constructionOptions.indexOf(bConstruction)

      // リストに存在しない値は最後に配置
      const aFinalIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex
      const bFinalIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex

      return aFinalIndex - bFinalIndex
    }
    return a.date.getTime() < b.date.getTime() ? -1 : 1
  })

  const todayRecords = records.filter(record => Days.isSameDate(record.date, today))
  const tomorrowRecords = records.filter(record => {
    return record.date.getTime() === tomorrow.getTime()
  })
  const isMyPage = query[`myPage`] === `true`

  return (
    <div>
      <GenbadayListClient {...{today, tomorrow, todayRecords, tomorrowRecords, isMyPage}} />
    </div>
  )
}
