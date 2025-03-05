import NempiKanriCC from '@app/(apps)/tbm/(pages)/nempiKanri/NempiKanriCC'
import {getNenpiDataByCar} from '@app/(apps)/tbm/(server-actions)/getNenpiDataByCar'
import { getMidnight} from '@class/Days'
import {FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup} from '@prisma/client'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />
  const theDate = whereQuery?.gte ?? getMidnight()

  const {fuelByCarWithVehicle} = await getNenpiDataByCar({tbmBaseId, whereQuery})

  const vehicleList = await prisma.tbmVehicle.findMany({
    where: {tbmBaseId},
    orderBy: [{code: 'asc'}, {id: 'asc'}],
    include: {
      TbmRefuelHistory: {
        where: {date: whereQuery},
        orderBy: [{date: 'asc'}, {odometer: `asc`}],
      },
    },
  })

  const lastRefuelHistoryByCar = await prisma.tbmVehicle.findMany({
    where: {tbmBaseId},
    orderBy: [{code: 'asc'}, {id: 'asc'}],
    include: {
      TbmRefuelHistory: {
        where: {date: {lt: whereQuery.gte}},
      },
    },
  })

  return (
    <FitMargin className={`p-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <NempiKanriCC {...{vehicleList, fuelByCarWithVehicle, lastRefuelHistoryByCar}} />
    </FitMargin>
  )
}

export type MonthlyTbmDriveData = {
  rows: {
    schedule: TbmDriveSchedule
    ConfigForRoute: TbmMonthlyConfigForRouteGroup | undefined
    keyValue: {[key: string]: any}
  }[]
}
