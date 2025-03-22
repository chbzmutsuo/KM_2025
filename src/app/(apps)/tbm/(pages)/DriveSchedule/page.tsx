import DriveScheduleCC from '@app/(apps)/tbm/(pages)/DriveSchedule/DriveScheduleCC'
import {getListData} from '@app/(apps)/tbm/(pages)/DriveSchedule/getListData'
import {Days, getMidnight} from '@class/Days'
import Redirector from '@components/utils/Redirector'
import {createUpdate, fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {Prisma} from '@prisma/client'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  const theDate = whereQuery?.gte ?? getMidnight()
  const MONTH = Days.getMonthDatum(theDate)

  const {result: tbmBase} = await fetchUniversalAPI(`tbmBase`, `findUnique`, {where: {id: tbmBaseId}})

  await autoCreateMonthConfig({MONTH, tbmBaseId})

  return (
    <>
      <DriveScheduleCC
        {...{
          tbmBase,
          days: MONTH.days,
          tbmBaseId,
          whereQuery,
        }}
      />
    </>
  )
}

const autoCreateMonthConfig = async ({MONTH, tbmBaseId}) => {
  const {result: checkMonthConfig} = await fetchUniversalAPI(`tbmRouteGroup`, `findMany`, {
    where: {tbmBaseId},
    include: {
      TbmMonthlyConfigForRouteGroup: {where: {yearMonth: {equals: MONTH.firstDayOfMonth}}},
    },
  })

  const transactionQueryList = (
    await Promise.all(
      (checkMonthConfig ?? [])
        .filter(route => {
          const monthConfig = route.TbmMonthlyConfigForRouteGroup[0]
          return !monthConfig
        })
        .map(async route => {
          const previousMonthConfig = (
            await fetchUniversalAPI(`tbmMonthlyConfigForRouteGroup`, `findMany`, {
              where: {
                tbmRouteGroupId: route.id,
                yearMonth: {
                  lt: MONTH.firstDayOfMonth,
                },
              },
              orderBy: {yearMonth: `desc`},
              take: 1,
            })
          ).result[0]

          if (previousMonthConfig) {
            const payload: Prisma.TbmMonthlyConfigForRouteGroupUpsertArgs = {
              where: {
                unique_yearMonth_tbmRouteGroupId: {
                  yearMonth: MONTH.firstDayOfMonth,
                  tbmRouteGroupId: route.id,
                },
              },
              ...createUpdate({...previousMonthConfig, yearMonth: MONTH.firstDayOfMonth, id: undefined}),
            }

            return {
              model: `tbmMonthlyConfigForRouteGroup`,
              method: `upsert`,
              queryObject: payload,
            }
          }
        })
    )
  ).filter(Boolean)

  if (transactionQueryList.length > 0) {
    await fetchTransactionAPI({transactionQueryList})
  }
}
