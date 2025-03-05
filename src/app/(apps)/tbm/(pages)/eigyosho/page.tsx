import NempiKanriCC from '@app/(apps)/tbm/(pages)/nempiKanri/NempiKanriCC'
import {getMonthlyTbmDriveData} from '@app/(apps)/tbm/(server-actions)/getMonthlyTbmDriveData'
import {getNenpiDataByCar} from '@app/(apps)/tbm/(server-actions)/getNenpiDataByCar'
import {getMidnight} from '@class/Days'
import {FitMargin} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup, User} from '@prisma/client'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />
  const theDate = whereQuery?.gte ?? getMidnight()
  const {monthlyTbmDriveData, ConfigForMonth} = await getMonthlyTbmDriveData({whereQuery, tbmBaseId})
  const userList = monthlyTbmDriveData.rows
    .reduce((acc, row) => {
      const {schedule, ConfigForRoute} = row
      const {User} = schedule
      if (acc.find(user => user.id === User.id)) {
        return acc
      }
      acc.push(User)

      return acc
    }, [] as User[])
    .sort((a, b) => String(a.code ?? '').localeCompare(String(b.code ?? '')))

  // const {fuelByCarWithVehicle,} = await getNenpiDataByCar({tbmBaseId, whereQuery})

  // const vehicleList = await prisma.tbmVehicle.findMany({
  //   where: {tbmBaseId},
  //   orderBy: [{code: 'asc'}, {id: 'asc'}],
  //   include: {
  //     TbmRefuelHistory: {
  //       where: {date: whereQuery},
  //       orderBy: [{date: 'asc'}, {odometer: `asc`}],
  //     },
  //   },
  // })

  // const lastRefuelHistoryByCar = await prisma.tbmVehicle.findMany({
  //   where: {tbmBaseId},
  //   orderBy: [{code: 'asc'}, {id: 'asc'}],
  //   include: {
  //     TbmRefuelHistory: {
  //       where: {date: {lt: whereQuery.gte}},
  //     },
  //   },
  // })

  return (
    <FitMargin className={`p-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      {CsvTable({
        records: userList.map(item => {
          const user = item
          return {
            csvTableRow: [
              {
                label: 'ドライバ',
                cellValue: user.name,
              },
            ],
          }
        }),
      }).WithWrapper({})}
      {/* <NempiKanriCC {...{vehicleList, fuelByCarWithVehicle, lastRefuelHistoryByCar}} /> */}
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
