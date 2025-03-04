'use server'
import prisma from '@lib/prisma'

const keiyuPerLiter = 159.98

export const getNenpiDataByCar = async ({tbmBaseId, whereQuery}) => {
  console.warn(`営業所 / 月ごとに軽油単価の設定が必要です。`)

  const vehicleList = await prisma.tbmVehicle.findMany({where: {tbmBaseId}})
  const TbmBase_MonthConfigList = await prisma.tbmBase_MonthConfig.findUnique({
    where: {
      unique_tbmBaseId_yearMonth: {
        yearMonth: whereQuery.gte,
        tbmBaseId,
      },
    },
  })

  const fuelByCar = await prisma.tbmRefuelHistory.groupBy({
    by: [`tbmVehicleId`],
    where: {
      date: whereQuery,
      TbmVehicle: {tbmBaseId},
    },
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

    const config = TbmBase_MonthConfigList

    const totalSokoKyori = item._max.odometer ?? 0
    const totalKyuyu = item._sum.amount ?? 0
    const avgNempi = totalSokoKyori / totalKyuyu

    const price = totalKyuyu * (config?.keiyuPerLiter ?? 0)

    return {
      vehicle,
      totalKyuyu,
      totalSokoKyori,
      avgNempi,
      price,
      // ...item,
    }
  })

  return {
    fuelByCarWithVehicle,
  }
}
