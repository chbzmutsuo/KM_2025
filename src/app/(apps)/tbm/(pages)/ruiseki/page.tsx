import {Calc} from '@class/Calc'
import {getMidnight} from '@class/Days'
import {FitMargin, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import EmptyPlaceholder from '@components/utils/loader/EmptyPlaceHolder'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup, TbmVehicle, User} from '@prisma/client'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />
  const theDate = whereQuery?.gte ?? getMidnight()

  const {fuelByCarWithVehicle} = await getNenpiDataByCar({tbmBaseId})

  const userListWithCarHistory = await getUserListWithCarHistory({
    tbmBaseId,
    whereQuery,
    fuelByCarWithVehicle,
  })

  return (
    <FitMargin className={`p-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <R_Stack className={`w-full items-start gap-8`}>
        {userListWithCarHistory.map(data => {
          const {user, allCars} = data
          const {id: userId} = user

          return (
            <div key={userId} className={`t-paper w-[500px] p-2`}>
              <R_Stack className={` w-full justify-between`}>
                <span>{user.code}</span>
                <h2 className={` text-2xl`}>{user.name}</h2>
              </R_Stack>
              {allCars.length > 0 ? (
                CsvTable({
                  records: allCars.map(data => {
                    const {car, soukouKyori, heikinNenpi, ninpiShiyoryo} = data

                    return {
                      csvTableRow: [
                        {
                          label: `車名`,
                          cellValue: car.name,
                        },
                        {
                          label: `車番`,
                          cellValue: car.plate,
                        },
                        {
                          label: `走行距離計`,
                          cellValue: Calc.round(soukouKyori, 1) + ' km',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `平均燃費`,
                          cellValue: Calc.round(heikinNenpi, 1) + ' km/L',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `燃費使用量`,
                          cellValue: Calc.round(ninpiShiyoryo, 1) + ' t',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `使用金額`,
                          cellValue: '金額',
                        },

                        // {cellValue: user.amount},
                        // {cellValue: user.odometer},
                        // {cellValue: user.type},
                      ],
                    }
                  }),
                }).WithWrapper({className: 't-paper'})
              ) : (
                <EmptyPlaceholder>データがありません</EmptyPlaceholder>
              )}
            </div>
          )
        })}
      </R_Stack>

      {/* <ruisekiCC /> */}
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

const getNenpiDataByCar = async ({tbmBaseId}) => {
  const vehicleList = await prisma.tbmVehicle.findMany({where: {tbmBaseId}})
  const fuelByCar = await prisma.tbmRefuelHistory.groupBy({
    by: [`tbmVehicleId`],
    where: {TbmVehicle: {tbmBaseId}},
    _sum: {amount: true},
    _avg: {amount: true},
    _max: {odometer: true},
  })

  await prisma.tbmVehicle.findMany({
    where: {tbmBaseId},
    include: {
      TbmRefuelHistory: {},
    },
  })

  const fuelByCarWithVehicle = fuelByCar.map(item => {
    const vehicle = vehicleList.find(v => v.id === item.tbmVehicleId)

    const totalAmount = item._sum.amount
    const totalOdometer = item._max.odometer
    const avgNempi = (totalOdometer ?? 0) / (totalAmount ?? 0)
    const price = 9999

    return {
      vehicle,
      totalAmount,
      totalOdometer,
      avgNempi,
      price,
      // ...item,
    }
  })

  return {
    fuelByCarWithVehicle,
  }
}

const getUserListWithCarHistory = async ({fuelByCarWithVehicle, tbmBaseId, whereQuery}) => {
  const userList = await prisma.user.findMany({
    where: {tbmBaseId},
    include: {
      TbmDriveSchedule: {
        where: {
          date: whereQuery,
          // finished: true,
        },
        include: {
          TbmVehicle: {
            include: {OdometerInput: {}},
          },
        },
      },
    },
  })

  const userListWithCarHistory = userList.map(user => {
    const {id: userId, TbmDriveSchedule} = user

    let allCars = TbmDriveSchedule.reduce((acc, cur, i) => {
      const {TbmVehicle} = cur
      if (!acc.find(v => v.id === TbmVehicle.id)) {
        acc.push(TbmVehicle)
      }
      return acc
    }, [] as any).sort((a, b) => (a.code ?? '')?.localeCompare(b.code ?? ''))

    allCars = allCars.map(car => {
      const fuelData = fuelByCarWithVehicle.find(v => v?.vehicle?.id === car.id)

      const OdometerInput = car.OdometerInput
      const myOdometerInput = OdometerInput.filter(v => {
        return v.userId === userId && !!v.odometerStart && !!v.odometerEnd
      })

      const soukouKyori = myOdometerInput.reduce((acc, cur, i) => {
        const diff = (cur.odometerEnd ?? 0) - (cur.odometerStart ?? 0)
        return acc + diff
      }, 0)
      const heikinNenpi = fuelData?.avgNempi ?? 0
      const ninpiShiyoryo = soukouKyori / heikinNenpi

      return {
        car,
        soukouKyori,
        heikinNenpi,
        ninpiShiyoryo,
      }
    })
    return {user, allCars}
  })
  type UserWithCarHistory = {
    user: User
    allCars: {
      car: TbmVehicle
      soukouKyori: number
      heikinNenpi: number
      ninpiShiyoryo: number
    }[]
  }

  return userListWithCarHistory as UserWithCarHistory[]
}
