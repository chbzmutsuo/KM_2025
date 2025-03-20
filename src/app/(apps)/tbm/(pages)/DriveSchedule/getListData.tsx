import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {TbmDriveSchedule, TbmVehicle, TbmRouteGroup, OdometerInput} from '@prisma/client'

export const getListData = async ({tbmBaseId, whereQuery}) => {
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
      date: {gte: whereQuery.gte, lte: whereQuery.lt},
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
  })

  const {result: tbmRouteGroup} = await fetchUniversalAPI(`tbmRouteGroup`, `findMany`, {
    where: commonWhere,
    include: {
      // TbmRoute: {},
    },
  })
  const {result: carList} = await fetchUniversalAPI(`tbmVehicle`, `findMany`, {
    where: commonWhere,
  })

  return {tbmBase, TbmDriveSchedule, calendar, userList, tbmRouteGroup, carList}
}

export type HaishaDriveSchedule = (TbmDriveSchedule & {
  TbmRouteGroup: TbmRouteGroup
  TbmVehicle: TbmVehicle & {OdometerInput: OdometerInput[]}
})[]
