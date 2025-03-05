import HaishaTable from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable'
import RouteDisplay from '@app/(apps)/tbm/(pages)/DriveSchedule/RouteDisplay'
import {Days, getMidnight} from '@class/Days'
import {FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import BasicTabs from '@components/utils/tabs/BasicTabs'
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

  const {tbmBase, calendar, TbmDriveSchedule, userList, tbmRouteGroup, carList} = await getListData({tbmBaseId, whereQuery})

  await autoCreateMonthConfig({MONTH, tbmBaseId})

  return (
    <>
      <FitMargin>
        <NewDateSwitcher {...{monthOnly: true}} />
        <BasicTabs
          {...{
            id: 'driveSchedule',

            showAll: false,
            TabComponentArray: [
              {label: 'ドライバー', component: <HaishaTable {...{tbmBase, userList, TbmDriveSchedule, days: MONTH.days}} />},
              {label: '便', component: <RouteDisplay {...{tbmBase, whereQuery}} />},
            ],
          }}
        />
      </FitMargin>
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
      checkMonthConfig
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

const getListData = async ({tbmBaseId, whereQuery}) => {
  const commonWhere = {tbmBaseId}
  const {result: tbmBase} = await fetchUniversalAPI(`tbmBase`, `findUnique`, {
    where: {id: tbmBaseId},
  })

  const {result: calendar} = await fetchUniversalAPI(`calendar`, `findMany`, {
    where: {
      date: {
        gte: whereQuery.gte,
        lte: whereQuery.lt,
      },
    },
  })

  const {result: TbmDriveSchedule} = await fetchUniversalAPI(`tbmDriveSchedule`, `findMany`, {
    where: {
      date: {
        gte: whereQuery.gte,
        lte: whereQuery.lt,
      },
    },
    include: {
      TbmVehicle: {
        include: {OdometerInput: {}},
      },
      TbmRouteGroup: {},
    },
  })

  const {result: userList} = await fetchUniversalAPI(`user`, `findMany`, {
    where: commonWhere,
    include: {UserWorkStatus: {where: {date: whereQuery}}},
  } as Prisma.UserFindManyArgs)

  const {result: tbmRouteGroup} = await fetchUniversalAPI(`tbmRouteGroup`, `findMany`, {
    where: commonWhere,
    include: {
      // TbmRoute: {},
    },
  } as Prisma.TbmRouteGroupFindManyArgs)
  const {result: carList} = await fetchUniversalAPI(`tbmVehicle`, `findMany`, {
    where: commonWhere,
  } as Prisma.TbmVehicleFindManyArgs)

  return {tbmBase, TbmDriveSchedule, calendar, userList, tbmRouteGroup, carList}
}
