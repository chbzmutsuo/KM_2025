'use client'
import React from 'react'

import {Days, formatDate} from '@class/Days'
import {Center} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import {Cell} from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable/Cell'
import {TbmDriveSchedule} from '@prisma/client'
import useGlobal from '@hooks/globalHooks/useGlobal'
import UserTh from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable/UserTh'
import {haishaListData} from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable/getListData'
import {createUpdate} from '@lib/methods/api-fetcher'
import {doTransaction} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'

export default function TableContent({mode, listDataState, days, tbmBase, fetchData, setModalOpen}) {
  const {query, accessScopes} = useGlobal()
  const {admin} = accessScopes()

  const {TbmDriveSchedule, userList, tbmRouteGroup} = listDataState as haishaListData
  const userWorkStatusByDate = userList.reduce((acc, user) => {
    acc[user.id] = user.UserWorkStatus.reduce((acc, userWorkStatus) => {
      acc[formatDate(userWorkStatus.date)] = userWorkStatus.workStatus
      return acc
    }, {})
    return acc
  }, {})

  if (mode === `ROUTE`) {
    const {scheduleByDateAndRoute} = getScheduleByDateAndRoute({TbmDriveSchedule})

    return (
      <>
        {tbmRouteGroup.length > 0 ? (
          CsvTable({
            records: tbmRouteGroup
              .sort((a, b) => a.code.localeCompare(b.code))
              .map(route => {
                // const userWorkStatusList = userWorkStatusByDate?.[user.id]
                return {
                  csvTableRow: [
                    // ユーザー情報
                    {
                      label: `便`,
                      cellValue: route.name,
                      style: {minWidth: 240, left: 0, position: 'sticky', background: `#d8d8d8`},
                    },
                    //日付別
                    ...days.map(date => {
                      const scheduleListOnDate = scheduleByDateAndRoute?.[formatDate(date)]?.[String(route.id)] ?? []

                      const holidayType = route.TbmRouteGroupCalendar.find(calendar =>
                        Days.isSameDate(calendar.date, date)
                      )?.holidayType

                      const must = route?.id > 0 && holidayType === '稼働'
                      const dateStr = formatDate(date, 'M/D(ddd)')

                      return {
                        label: (
                          <div id={`#${dateStr}`}>
                            <div>{dateStr}</div>
                          </div>
                        ),
                        cellValue: (
                          <Center>
                            <Cell
                              {...{
                                fetchData,
                                setModalOpen,
                                scheduleListOnDate,
                                date,
                                tbmRouteGroup: route,
                                tbmBase,
                              }}
                            />
                          </Center>
                        ),
                        style: {background: must ? '#fff1cd' : ''},
                        thStyle: {background: '#d8d8d8'},
                      }
                    }),
                  ],
                }
              }),
          }).WithWrapper({className: `max-w-[calc(95vw-50px)] max-h-[75vh] `})
        ) : (
          <div>データがありません</div>
        )}
      </>
    )
  } else {
    const {scheduleByDateAndUser} = getScheduleByDateAndUser({TbmDriveSchedule})

    return (
      <>
        {userList.length > 0 ? (
          CsvTable({
            records: userList
              .sort((a, b) => a.code?.localeCompare(b.code ?? '') ?? 0)
              .map(user => {
                user[`userWorkStatusList`] = userWorkStatusByDate?.[user.id]
                return {
                  csvTableRow: [
                    // ユーザー情報
                    {
                      label: `ユーザー`,
                      cellValue: <UserTh {...{user, admin, query}} />,
                      style: {minWidth: 240, left: 0, position: 'sticky', background: `#d8d8d8`},
                    },

                    //日付別
                    ...days.map(date => {
                      const scheduleListOnDate = scheduleByDateAndUser?.[formatDate(date)]?.[String(user.id)] ?? []

                      const dateStr = formatDate(date, 'M/D(ddd)')

                      return {
                        label: (
                          <div
                            className={`t-link `}
                            id={`#${dateStr}`}
                            onClick={async () => {
                              const targetUserList = userList.filter(user => {
                                // scheduleがapprovedのもの
                                const schedule = scheduleListOnDate.find(
                                  schedule => schedule.approved && schedule.userId === user.id
                                )
                                return schedule
                              })

                              if (confirm(`${targetUserList.length}件のユーザーを稼働に設定しますか？`)) {
                                await doTransaction({
                                  transactionQueryList: targetUserList.map((user, idx) => {
                                    const unique_userId_date = {
                                      userId: user.id,
                                      date,
                                    }

                                    return {
                                      model: `userWorkStatus`,
                                      method: `upsert`,
                                      queryObject: {
                                        where: {
                                          unique_userId_date,
                                        },
                                        ...createUpdate({
                                          ...unique_userId_date,
                                          workStatus: '稼働',
                                        }),
                                      },
                                    }
                                  }),
                                })
                                fetchData()
                              }
                            }}
                          >
                            <div>{dateStr}</div>
                          </div>
                        ),
                        cellValue: (
                          <Cell
                            {...{
                              fetchData,
                              setModalOpen,

                              scheduleListOnDate,
                              user,
                              date,
                              tbmBase,
                            }}
                          />
                        ),
                        // style: {minWidth: 160, minHeight: 160},
                      }
                    }),
                  ],
                }
              }),
          }).WithWrapper({className: `max-w-[calc(95vw-50px)] max-h-[75vh] `})
        ) : (
          <div>データがありません</div>
        )}
      </>
    )
  }
}

const getScheduleByDateAndUser = ({TbmDriveSchedule}) => {
  const scheduleByDateAndUser = TbmDriveSchedule.reduce((acc, schedule) => {
    const dateKey = formatDate(schedule.date)
    const userKey = schedule.userId
    if (!acc[dateKey]) {
      acc[dateKey] = {}
    }
    if (!acc[dateKey][userKey]) {
      acc[dateKey][userKey] = []
    }
    acc[dateKey][userKey].push(schedule)
    return acc
  }, {})

  return {scheduleByDateAndUser} as {scheduleByDateAndUser: Record<string, Record<string, TbmDriveSchedule[]>>}
}
const getScheduleByDateAndRoute = ({TbmDriveSchedule}) => {
  const scheduleByDateAndRoute = TbmDriveSchedule.reduce((acc, schedule) => {
    const dateKey = formatDate(schedule.date)
    const routeKey = schedule.tbmRouteGroupId
    if (!acc[dateKey]) {
      acc[dateKey] = {}
    }
    if (!acc[dateKey][routeKey]) {
      acc[dateKey][routeKey] = []
    }
    acc[dateKey][routeKey].push(schedule)
    return acc
  }, {})

  return {scheduleByDateAndRoute} as {scheduleByDateAndRoute: Record<string, Record<string, TbmDriveSchedule[]>>}
}
