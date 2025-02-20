import {Days} from '@class/Days'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import { Prisma} from '@prisma/client'
import React, {useState} from 'react'
import {genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/getGenbaScheduleStatus'

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
        console.log(car) //////logs
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

      transactionQueryList.forEach(
        d => console.log(d) //////logs
      )
      toggleLoad(
        async () => {
          await fetchTransactionAPI({transactionQueryList})
          await genbaDayUpdateChain({genbaId: GenbaDay.genbaId})
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
                        cellValue: car?.name,
                        style: {width: 120, padding: 5},
                      },
                    ],
                  }
                }),
              }).ALL()}
            </TableBordered>
          </TableWrapper>
          <R_Stack className={` justify-end`}>
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
    const shiftsOnOtherGembaOnSameDate = car.GenbaDaySoukenCar.filter(shift => {
      const isSameDate = Days.isSameDate(shift.GenbaDay.date, GenbaDay.date)
      const isSameGenba = shift.GenbaDay.genbaId === GenbaDay.genbaId
      return isSameDate && !isSameGenba
    })

    const shiftOnDate = currentRelationalModelRecords?.find(record => {
      return record?.SohkenCar?.id === car.id
    })

    return {
      ...car,
      active: !!shiftOnDate,
      shiftsOnOtherGembaOnSameDate,
    }
  })

  const defaultValue = Object.fromEntries(
    optionList.map(car => {
      return [car.id, {active: car.active}]
    })
  )
  return {optionList, defaultValue}
}
