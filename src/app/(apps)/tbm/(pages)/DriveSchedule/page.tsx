import HaishaTable from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable'
import RouteDisplay from '@app/(apps)/tbm/(pages)/DriveSchedule/RouteDisplay'
import {Days, getMidnight} from '@class/Days'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
import Redirector from '@components/utils/Redirector'
import { fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import { Prisma} from '@prisma/client'

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

  // await createUserDateIfNull({userList, MONTH, calendar})

  return (
    <>
      <div>
        <R_Stack className={` items-stretch`}>
          <Paper className={`w-[400px]`}>
            <strong>便</strong>
            <C_Stack className={` items-stretch gap-6`}>
              <RouteDisplay {...{tbmBase}} />
            </C_Stack>
          </Paper>
          <Paper>
            <strong>ドライバー</strong>
            <HaishaTable {...{userList, TbmDriveSchedule, days: MONTH.days}} />
          </Paper>
        </R_Stack>
      </div>
    </>
  )
}

// const createUserDateIfNull = async ({userList, MONTH, calendar}) => {
//   const userScheduleToCreate: {user: User; calendar: Calendar}[] = []
//   MONTH.days.map(date => {
//     const theCalendar = calendar.find(calendar => Days.isSameDate(calendar.date, date))

//     return userList.map(user => {
//       const theDate = user.TbmUserDate.find((userDate: TbmUserDate) => {
//         return userDate.tbmCalendarId === theCalendar.id
//       })

//       if (!theDate) {
//         userScheduleToCreate.push({
//           user,
//           calendar: theCalendar,
//         })
//       }
//     })
//   })

//   if (userScheduleToCreate.length > 0) {
//     await fetchTransactionAPI({
//       transactionQueryList: userScheduleToCreate.map(userSchedule => {
//         const {calendar, user} = userSchedule

//         const unique_userId_tbmCalendarId = {
//           userId: user?.id ?? 0,
//           tbmCalendarId: calendar?.id ?? 0,
//         }

//         const queryObject: Prisma.TbmUserDateUpsertArgs = {
//           where: {unique_userId_tbmCalendarId},
//           create: unique_userId_tbmCalendarId,
//           update: unique_userId_tbmCalendarId,
//         }
//         return {
//           model: `tbmUserDate`,
//           method: `upsert`,
//           queryObject,
//         }
//       }),
//     })
//   }
// }

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
    where: {date: {gte: whereQuery.gte, lte: whereQuery.lt}},
    include: {
      TbmVehicle: {},
      TbmRouteGroup: {},
    },
  } as Prisma.UserFindManyArgs)

  const {result: userList} = await fetchUniversalAPI(`user`, `findMany`, {
    where: commonWhere,
  } as Prisma.UserFindManyArgs)

  const {result: tbmRouteGroup} = await fetchUniversalAPI(`tbmRouteGroup`, `findMany`, {
    where: commonWhere,
    include: {
      TbmRoute: {},
    },
  } as Prisma.TbmRouteGroupFindManyArgs)
  const {result: carList} = await fetchUniversalAPI(`tbmVehicle`, `findMany`, {
    where: commonWhere,
  } as Prisma.TbmVehicleFindManyArgs)

  return {tbmBase, TbmDriveSchedule, calendar, userList, tbmRouteGroup, carList}
}
