import {userForSelect} from '@app/(apps)/sohken/class/sohken-constants'
import {Days} from '@class/Days'
import {anyObject} from '@cm/types/types'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {GenbaDayShift, Prisma} from '@prisma/client'
import React, {useState} from 'react'
import {genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/getGenbaScheduleStatus'

type selectedUserObjectType = {
  [key: string]: {
    active: boolean
    from: string | undefined
    to: string | undefined
    shiftOnOtherDate: GenbaDayShift[]
    important: boolean
  }
}

export default function MultipleUserSelector({currentRelationalModelRecords, GenbaDay, useGlobalProps, handleClose}) {
  let {data: options} = usefetchUniversalAPI_SWR('user', 'findMany', {
    orderBy: [{sortOrder: 'asc'}],
    where: userForSelect.config.where,
    include: {
      GenbaDayShift: {
        include: {GenbaDay: {}},
        where: {
          GenbaDay: {date: {equals: GenbaDay.date}},
        },
        orderBy: {
          User: {
            sortOrder: 'asc',
          },
        },
      },
    },
  })

  if (!options) return <PlaceHolder />
  options = options.sort((a, b) => {
    const shift = a?.GenbaDayShift.find(shift => shift.genbaDayId === GenbaDay?.id)

    return shift?.from ? b.sortOrder - a.sortOrder : 0
  })

  const Main = () => {
    const {toggleLoad} = useGlobalProps
    const {optionList, defaultValue} = init({options, currentRelationalModelRecords, GenbaDay})

    const [selectedUserObject, setselectedUserObject] = useState<selectedUserObjectType>(defaultValue)

    const bulkUpdateUsersOnGenbaDay = async () => {
      toggleLoad(
        async () => {
          const transactionQueryList: transactionQuery[] = []
          const currentRegisterdUsers = currentRelationalModelRecords.map(record => record.User.id)
          type user = {
            id: number
            from: string
            to: string
            important: boolean
          }
          const usersToUpsert = Object.entries(selectedUserObject)
            .map(entry => {
              const [id, {active, from, to, shiftOnOtherDate, important}] = entry as [string, selectedUserObjectType[string]]

              if (active) {
                return {
                  id: Number(id),
                  from,
                  to,
                  shiftOnOtherDate,
                  important,
                }
              }
            })
            .filter(Boolean) as user[]

          const usersDelete = currentRegisterdUsers.filter(id => !usersToUpsert.find(user => user?.id === id))

          usersDelete.forEach(id => {
            transactionQueryList.push({
              model: `genbaDayShift`,
              method: 'delete',
              queryObject: {
                where: {
                  unique_userId_genbaDayId: {
                    genbaDayId: GenbaDay.id,
                    userId: id,
                  },
                },
              },
            })
          })

          usersToUpsert.forEach(user => {
            const payload = {
              genbaId: GenbaDay.genbaId,
              genbaDayId: GenbaDay.id,
              userId: user.id,
              from: user.from,
              to: user.to,
              important: user.important,
            }

            const args: Prisma.GenbaDayShiftUpsertArgs = {
              where: {
                unique_userId_genbaDayId: {
                  genbaDayId: GenbaDay.id,
                  userId: user.id,
                },
              },
              create: payload,
              update: payload,
            }
            transactionQueryList.push({
              model: `genbaDayShift`,
              method: 'upsert',
              queryObject: args,
            })
          })

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
                      {cellValue: `いつから`},
                      {cellValue: `いつまで`},
                      {cellValue: `強調`},
                    ],
                  },
                ],
                bodyRecords: optionList.map(user => {
                  const active = selectedUserObject?.[user.id]
                  const {shiftsOnOtherGembaOnSameDate} = user

                  const UserNameDisplay = () => {
                    return (
                      <R_Stack className={`items-start leading-3`}>
                        <div>{user.name}</div>
                        <div className={`text-error-main`}>{shiftsOnOtherGembaOnSameDate.length > 0 ? '★' : ''}</div>
                        {/* <div className={`text-error-main text-[8px]`}>
                            {shiftsOnOtherGembaOnSameDate.map(shift => formatDate(shift.GenbaDay.date, 'M/D(ddd)')).join(`,`)}
                          </div> */}
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
                              setselectedUserObject(prev => {
                                return {
                                  ...prev,
                                  [user.id]: {
                                    ...prev[user.id],
                                    active: !prev[user.id]?.active,
                                  },
                                }
                              })
                            }
                          />
                        ),
                        style: {width: 30, padding: 5},
                      },
                      {
                        cellValue: <UserNameDisplay />,
                        style: {width: 120, padding: 5},
                      },
                      {
                        cellValue: <Input {...{user, type: `time`, dataKey: `from`, setselectedUserObject}} />,
                        style: {width: 70, padding: 5},
                      },
                      {
                        cellValue: <Input {...{user, type: `time`, dataKey: `to`, setselectedUserObject}} />,
                        style: {width: 70, padding: 5},
                      },
                      {
                        cellValue: (
                          <input
                            disabled={!active.active}
                            className={`h-6 w-6`}
                            type={`checkbox`}
                            checked={!!active?.important}
                            onChange={() => {
                              setselectedUserObject(prev => {
                                return {
                                  ...prev,
                                  [user.id]: {
                                    ...prev[user.id],
                                    important: !prev[user.id]?.important,
                                  },
                                }
                              })
                            }}
                          />
                        ),
                        style: {width: 70, padding: 5},
                      },
                    ],
                  }
                }),
              }).ALL()}
            </TableBordered>
          </TableWrapper>
          <R_Stack className={` justify-end`}>
            <Button color={`blue`} onClick={bulkUpdateUsersOnGenbaDay}>
              更新する
            </Button>
          </R_Stack>
        </C_Stack>
      </>
    )
  }

  return <Main />
}

const Input = ({user, type, dataKey = `from`, setselectedUserObject}) => {
  const [value, setvalue] = useState(user[dataKey] ?? '')
  const timeInputProps = {
    datalist: new Array(24 * 4).fill(0).map((_, i) => {
      const hours = Math.floor(i / 4)
      const minutes = (i % 4) * 15
      return {value: `${String(hours).padStart(2, `0`)}:${String(minutes).padStart(2, `0`)}`}
    }),
    step: 60 * 15,
  }

  const id = `${user.id}-${dataKey}-dataList`

  const DataList = () => {
    if (timeInputProps?.datalist) {
      return (
        <datalist id={id}>
          {timeInputProps?.datalist?.map((item: anyObject) => {
            return <option key={item.value} value={item.value} />
          })}
        </datalist>
      )
    }
    return null
  }
  return (
    <>
      <input
        {...{
          list: id,
          className: `bg-gray-200 px-2 border rounded`,
          type,
          value: value,
          onChange: e => {
            setvalue(e.target.value)
            setselectedUserObject(prev => {
              const result = {
                ...prev,
                [user.id]: {
                  ...prev[user.id],
                  [dataKey]: e.target.value,
                  active: true,
                },
              }

              return result
            })
          },
        }}
      />
      <DataList />
    </>
  )
}

const init = ({options, currentRelationalModelRecords, GenbaDay}) => {
  const optionList = options.map((user, idx) => {
    const shift = user.GenbaDayShift.find(shift => shift.genbaDayId === GenbaDay?.id)

    const shiftsOnOtherGembaOnSameDate = user.GenbaDayShift.filter(shift => {
      const isSameDate = Days.isSameDate(shift.GenbaDay.date, GenbaDay.date)
      const isSameGenba = shift.GenbaDay.genbaId === GenbaDay.genbaId
      return isSameDate && !isSameGenba
    })

    const shiftOnDate = currentRelationalModelRecords?.find(record => record?.User?.id === user.id)

    const {from, to, important} = shift ?? {}

    return {
      ...user,
      active: !!shiftOnDate,
      shiftsOnOtherGembaOnSameDate,
      from,
      to,
      important,
    }
  })
  // .sort((a, b) => {
  //   if (a.active) return -1
  //   if (b.active) return 1
  //   return 0
  // })

  const defaultValue = Object.fromEntries(
    optionList.map(user => {
      return [
        user.id,
        {
          active: user.active,
          from: user.from,
          to: user.to,
          important: user.important,
        },
      ]
    })
  )
  return {optionList, defaultValue}
}
