import {Days} from '@class/Days'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'
import React, {useState} from 'react'
import {chain_sohken_genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/chain_sohken_genbaDayUpdateChain'

type selectedCarObjectType = {[key: string]: {active: boolean}}

export default function MultipleCarSelector({currentRelationalModelRecords, GenbaDay, useGlobalProps, handleClose}) {
  let {data: options} = usefetchUniversalAPI_SWR(`sohkenCar`, 'findMany', {
    orderBy: [{sortOrder: 'asc'}],
    include: {
      GenbaDaySoukenCar: {
        include: {GenbaDay: {}, SohkenCar: {}},
        where: {GenbaDay: {date: {equals: GenbaDay.date}}},
      },
    },
  })

  if (!options) return <PlaceHolder />
  options = options.sort((a, b) => {
    const shift = a?.GenbaDaySoukenCar.find(shift => shift.genbaDayId === GenbaDay?.id)
    return shift?.from ? b.sortOrder - a.sortOrder : 0
  })

  const Main = () => {
    const {toggleLoad} = useGlobalProps
    const {optionList, defaultValue} = init({options, currentRelationalModelRecords, GenbaDay})

    const [selectedCarObject, setselectedCarObject] = useState<selectedCarObjectType>(defaultValue)

    const bulkUpdate = async () => {
      const transactionQueryList: transactionQuery[] = []
      const currentRegisterdRecords = currentRelationalModelRecords.map(record => record.SohkenCar.id)
      type car = {
        id: number
        from: string
        to: string
        important: boolean
        directGo: boolean
        directReturn: boolean
      }
      const record = Object.entries(selectedCarObject)
        .map(entry => {
          const [id, {active}] = entry as [string, selectedCarObjectType[string]]

          if (active) {
            return {
              id: Number(id),
            }
          }
        })
        .filter(Boolean) as car[]

      const recordsToDelete = currentRegisterdRecords.filter(id => !record.find(car => car?.id === id))

      recordsToDelete.forEach(id => {
        transactionQueryList.push({
          model: `genbaDaySoukenCar`,
          method: 'delete',
          queryObject: {
            where: {
              unique_genbaDayId_sohkenCarId: {
                genbaDayId: GenbaDay.id,
                sohkenCarId: id,
              },
            },
          },
        })
      })

      record.forEach(car => {
        const payload = {
          genbaId: GenbaDay.genbaId,
          genbaDayId: GenbaDay.id,
          sohkenCarId: car.id,
        }

        const args: Prisma.GenbaDaySoukenCarUpsertArgs = {
          where: {
            unique_genbaDayId_sohkenCarId: {
              genbaDayId: GenbaDay.id,
              sohkenCarId: car.id,
            },
          },
          create: payload,
          update: payload,
        }
        transactionQueryList.push({
          model: `genbaDaySoukenCar`,
          method: 'upsert',
          queryObject: args,
        })
      })

      toggleLoad(
        async () => {
          await fetchTransactionAPI({transactionQueryList})
          await chain_sohken_genbaDayUpdateChain({genbaId: GenbaDay.genbaId})
          handleClose()
        },
        {refresh: true, mutate: true}
      )
    }

    return (
      <>
        <C_Stack>
          <TableWrapper className={`border-blue-main max-h-[50vh]  border-2`}>
            <TableBordered className={`text-center`}>
              {CsvTable({
                headerRecords: [
                  {
                    csvTableRow: [
                      //
                      {cellValue: ``},
                      {cellValue: `ユーザー`},
                    ],
                  },
                ],
                bodyRecords: optionList.map(car => {
                  const active = selectedCarObject?.[car.id]
                  const {carsOnOtherGembaOnSameDate} = car

                  const CarNameDisplay = () => {
                    return (
                      <R_Stack className={`items-start leading-3`}>
                        <div>{car.name}</div>
                        <div className={`text-error-main`}>{carsOnOtherGembaOnSameDate.length > 0 ? '★' : ''}</div>
                      </R_Stack>
                    )
                  }

                  return {
                    style: {
                      opacity: active?.active ? 1 : 0.5,
                    },
                    csvTableRow: [
                      {
                        cellValue: (
                          <input
                            className={`h-6 w-6`}
                            type={`checkbox`}
                            checked={!!active?.active}
                            onChange={() =>
                              setselectedCarObject(prev => {
                                return {
                                  ...prev,
                                  [car.id]: {
                                    ...prev[car.id],
                                    active: !prev[car.id]?.active,
                                  },
                                }
                              })
                            }
                          />
                        ),
                        style: {width: 30, padding: 5},
                      },
                      {
                        cellValue: <CarNameDisplay />,
                        style: {width: 120, padding: 5},
                      },
                    ],
                  }
                }),
              }).ALL()}
            </TableBordered>
          </TableWrapper>
          <R_Stack className={` justify-end`}>
            <Button
              color={`green`}
              onClick={async () => {
                const {result: pastGenbaDayList} = await fetchUniversalAPI(`genbaDay`, `findMany`, {
                  where: {
                    genbaId: GenbaDay.genbaId,
                    date: {
                      lt: GenbaDay.date,
                    },
                  },
                  include: {GenbaDaySoukenCar: {include: {SohkenCar: {}}}},
                  orderBy: {date: 'desc'},
                  take: 1,
                })

                const prevGenbaDay = pastGenbaDayList[0]

                const carList =
                  prevGenbaDay?.GenbaDaySoukenCar?.map(v => {
                    return v.SohkenCar
                  }) ?? []

                const message = [
                  `この現場の直前の車両配置は、次の通りです。`,
                  ...carList.map(v => {
                    return `・${v.name}`
                  }),
                  `上記配置車両をコピーしますか？`,
                ]

                if (carList.length === 0) {
                  return alert(`直前の車両配置データが見つかりませんでした。`)
                }

                if (confirm(message.join(`\n`))) {
                  const {result: getCurrentSetCarList} = await fetchUniversalAPI(`genbaDaySoukenCar`, `findMany`, {
                    where: {genbaDayId: GenbaDay.id},
                    include: {SohkenCar: {}},
                  })

                  const currentSetCarList = []
                  const addCarList = []
                }
              }}
            >
              引き継ぎ
            </Button>
            <Button color={`blue`} onClick={bulkUpdate}>
              更新する
            </Button>
          </R_Stack>
        </C_Stack>
      </>
    )
  }

  return <Main />
}

const init = ({options, currentRelationalModelRecords, GenbaDay}) => {
  const optionList = options.map((car, idx) => {
    const carsOnOtherGembaOnSameDate = car.GenbaDaySoukenCar.filter(shift => {
      const isSameDate = Days.isSameDate(shift.GenbaDay.date, GenbaDay.date)
      const isSameGenba = shift.GenbaDay.genbaId === GenbaDay.genbaId
      return isSameDate && !isSameGenba
    })

    const carsOnDate = currentRelationalModelRecords?.find(record => {
      return record?.SohkenCar?.id === car.id
    })

    return {
      ...car,
      active: !!carsOnDate,
      carsOnOtherGembaOnSameDate,
    }
  })

  const defaultValue = Object.fromEntries(
    optionList.map(car => {
      return [car.id, {active: car.active}]
    })
  )
  return {optionList, defaultValue}
}
