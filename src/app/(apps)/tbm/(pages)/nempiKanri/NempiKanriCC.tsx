'use client'
import React from 'react'
import {Calc} from '@class/Calc'
import {formatDate} from '@class/Days'
import {DH} from '@class/DH'
import { R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {KeyValue} from '@components/styles/common-components/ParameterCard'
import EmptyPlaceholder from '@components/utils/loader/EmptyPlaceHolder'

export default function NempiKanriCC({vehicleList, fuelByCarWithVehicle, lastRefuelHistoryByCar}) {
  return (
    <R_Stack className={`w-full items-start gap-8`}>
      {vehicleList.map((vehicle, idx) => {
        const avgData = fuelByCarWithVehicle.find(data => data?.vehicle?.id === vehicle.id)

        const flexChild = `w-1/2 px-1`

        const prevRefuelHistory = [
          ...lastRefuelHistoryByCar
            .filter(v => v.id === vehicle.id)
            .map(v => v.TbmRefuelHistory)
            .flat(),
        ]
        prevRefuelHistory.sort((a, b) => {
          const sortByodometer = b.odometer - a.odometer
          const sortByDate = b.date.getTime() - a.date.getTime()
          if (sortByodometer === 0) {
            return sortByDate
          }
          return sortByodometer
        })

        return (
          <div key={idx} className={`t-paper w-[450px]  p-2`}>
            <div>
              <section>
                <R_Stack className={` text-lg font-bold`}>
                  <span>{vehicle?.name}</span>
                  <span>{vehicle?.plate}</span>
                </R_Stack>
              </section>

              <section>
                <R_Stack className={`gap-0 text-lg`}>
                  <div className={flexChild}>
                    <KeyValue label="総走行距離">
                      <strong>{DH.toPrice(avgData?.totalSokoKyori)}</strong>
                    </KeyValue>
                  </div>
                  <div className={flexChild}>
                    <KeyValue label="総給油量">
                      <strong>{DH.toPrice(avgData?.totalKyuyu)}</strong>
                    </KeyValue>
                  </div>
                  <div className={flexChild}>
                    <KeyValue label="燃費">
                      <strong>{DH.toPrice(avgData?.avgNempi)}</strong>
                    </KeyValue>
                  </div>
                  <div className={flexChild}>
                    <KeyValue label="金額">
                      <strong>{DH.toPrice(avgData?.price)}</strong>
                    </KeyValue>
                  </div>
                </R_Stack>
              </section>

              <section>
                {vehicle.TbmRefuelHistory.length > 0 ? (
                  <>
                    {CsvTable({
                      records: (vehicle.TbmRefuelHistory ?? []).map((current, i) => {
                        const prev = vehicle.TbmRefuelHistory[i - 1] ?? prevRefuelHistory[0]

                        const kukanKyori = (current.odometer ?? 0) - (prev?.odometer ?? 0)

                        const kyuyuryo = current.amount
                        const nempi = kukanKyori / kyuyuryo

                        return {
                          csvTableRow: [
                            //
                            {label: '日付', cellValue: formatDate(current.date, 'short')},
                            {label: '給油時走行距離', cellValue: current.odometer},
                            {label: '区間距離', cellValue: kukanKyori},
                            {label: '給油量', cellValue: kyuyuryo},
                            {label: '燃費', cellValue: Calc.round(nempi, 1)},
                          ],
                        }
                      }),
                    }).WithWrapper({className: ''})}
                  </>
                ) : (
                  <EmptyPlaceholder>データがありません</EmptyPlaceholder>
                )}
              </section>
            </div>
          </div>
        )
      })}
      {/* {userListWithCarHistory.map(data => {
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
        })} */}
    </R_Stack>
  )
}
