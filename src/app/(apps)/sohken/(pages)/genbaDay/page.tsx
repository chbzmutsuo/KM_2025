//classを切り替える
import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {addDays, subDays} from 'date-fns'
import {Days, toUtc} from '@class/Days'
import GenbadayListClient from '@app/(apps)/sohken/(pages)/genbaDay/GenbadayListClient'
import {SOHKEN_CONST} from '@app/(apps)/sohken/(constants)/SOHKEN_CONST'
import prisma from '@lib/prisma'

import {C_Stack} from '@components/styles/common-components/common-components'

import {getHolidayCalendar} from '@app/(apps)/sohken/api/cron/refreshGoogleCalendar/getHolidayCalendar'
const include = QueryBuilder.getInclude({}).genbaDay.include as any

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const isMyPage = query[`myPage`] === `true`
  const genbaId = query.genbaId ? Number(query.genbaId) : undefined
  const queryFrom = query.from ? toUtc(query.from) : null

  if (!queryFrom) {
    return <div>日付を選択してください</div>
  }

  // 今日と明日を取得
  let today = queryFrom
  let tomorrow = addDays(today, 1)

  const {holidays} = await getHolidayCalendar({
    whereQuery: {gte: subDays(today, 30), lte: addDays(tomorrow, 30)},
  })

  // マイページにて、休日だった場合は、翌日にリダイレクト

  if (!isMyPage) {
    while (holidays.find(holiday => Days.isSameDate(holiday.date, tomorrow))) {
      tomorrow = addDays(tomorrow, 1)
    }

    while (holidays.find(holiday => Days.isSameDate(holiday.date, today))) {
      today = addDays(today, -1)
    }
  }

  const records = await prisma.genbaDay.findMany({
    include,
    where: {genbaId, OR: [{status: {not: `不要`}}, {status: null}], date: {gte: today, lte: tomorrow}},
  })

  records.sort((a: any, b: any) => {
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

      if (aFinalIndex !== bFinalIndex) {
        return aFinalIndex - bFinalIndex
      }

      // 第三順位: genbaDay.Genba.nameで並び替え
      const aGenbaid = a.Genba?.id || 0
      const bGenbaid = b.Genba?.id || 0
      return aGenbaid - bGenbaid
    }
    return a.date.getTime() < b.date.getTime() ? -1 : 1
  })

  // const tomorrowShifts =
  const genbaDayRecords = {
    today: records.filter(record => Days.isSameDate(record.date, today)),
    tomorrow: records.filter(record => {
      return Days.isSameDate(record.date, tomorrow)
    }),
  }

  // シフトデータの取得
  const shifts = {
    today: await prisma.genbaDayShift.findMany({
      include: {GenbaDay: {}},
      where: {genbaDayId: {in: genbaDayRecords.today.map(item => item.id)}},
    }),
    tomorrow: await prisma.genbaDayShift.findMany({
      include: {GenbaDay: {}},
      where: {genbaDayId: {in: genbaDayRecords.tomorrow.map(item => item.id)}},
    }),
  }

  const users = {
    today: await prisma.user.findMany({
      include: {
        UserRole: {include: {RoleMaster: {}}},
        GenbaDayShift: {where: {GenbaDay: {date: today}}},
        DayRemarksUser: {
          include: {DayRemarks: {}},
          where: {DayRemarks: {date: today}},
        },
      },
      where: {apps: {has: `sohken`}},
      orderBy: [{sortOrder: `asc`}],
    }),
    tomorrow: await prisma.user.findMany({
      include: {
        UserRole: {include: {RoleMaster: {}}},
        GenbaDayShift: {where: {GenbaDay: {date: tomorrow}}},
        DayRemarksUser: {
          include: {DayRemarks: {}},
          where: {DayRemarks: {date: tomorrow}},
        },
      },
      where: {apps: {has: `sohken`}},
      orderBy: [{sortOrder: `asc`}],
    }),
  }

  const dayRemarksStates = {
    today: await prisma.dayRemarks.upsert({
      where: {date: today},
      create: {date: today},
      update: {date: today},
      include: {DayRemarksUser: {include: {User: true}}},
    }),
    tomorrow: await prisma.dayRemarks.upsert({
      where: {date: tomorrow},
      create: {date: tomorrow},
      update: {date: tomorrow},
      include: {DayRemarksUser: {include: {User: true}}},
    }),
  }

  //カレンダーの取得
  const calendars = {
    today: await prisma.sohkenGoogleCalendar.findMany({where: {date: today}}),
    tomorrow: await prisma.sohkenGoogleCalendar.findMany({where: {date: tomorrow}}),
  }

  return (
    <div>
      <C_Stack className={` items-center`}>
        <GenbadayListClient
          {...{
            holidays,
            calendars,
            shifts,
            genbaDayRecords,
            users,
            dayRemarksStates,
            today,
            tomorrow,
            isMyPage,
          }}
        />
      </C_Stack>
    </div>
  )
}
