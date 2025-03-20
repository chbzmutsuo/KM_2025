'use client'
import React, {useEffect, useState} from 'react'

import {formatDate, getMidnight} from '@class/Days'
import {R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import {Cell} from '@app/(apps)/tbm/(pages)/DriveSchedule/Cell'
import {TbmDriveSchedule} from '@prisma/client'
import useGlobal from '@hooks/globalHooks/useGlobal'
import UserTh from '@app/(apps)/tbm/(pages)/DriveSchedule/UserTh'
import {HaishaDriveSchedule} from '@app/(apps)/tbm/(pages)/DriveSchedule/getListData'

export default function HaishaTable(props: {userList; days; TbmDriveSchedule: HaishaDriveSchedule; tbmBase}) {
  const {days, tbmBase} = props
  const [userList, setuserList] = useState(props.userList)
  const [TbmDriveSchedule, setTbmDriveSchedule] = useState<HaishaDriveSchedule>(props.TbmDriveSchedule)

  const HK_HaishaTableEditorGMF = useHaishaTableEditorGMF({
    afterDelete: ({res, tbmDriveSchedule}) => {
      setTbmDriveSchedule?.(prev => {
        return prev.filter(item => item.id !== tbmDriveSchedule?.id)
      })
    },
    afterUpdate: ({res}) => {
      setTbmDriveSchedule?.(prev => {
        const newList = [...prev]
        const newDriveSchedale = res.result
        const findIndex = newList.findIndex(item => item.id === newDriveSchedale.id)
        if (findIndex !== -1) {
          newList[findIndex] = newDriveSchedale
        } else {
          newList.push(newDriveSchedale)
        }

        return newList
      })
    },
  })

  const setModalOpen = HK_HaishaTableEditorGMF.setGMF_OPEN
  const {query, accessScopes} = useGlobal()
  const {admin} = accessScopes()

  useEffect(() => {
    //
    const past7DayIdList: string[] = []
    const today = getMidnight(new Date())

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      past7DayIdList.push(`#${formatDate(date)}`)
    }

    past7DayIdList.reverse().map(date => `#${formatDate(date)}`)
    for (let i = 0; i < past7DayIdList.length; i++) {
      const theDateCell = document.getElementById(past7DayIdList[i])
      if (theDateCell) {
        theDateCell.scrollIntoView()
        break
      }
    }
  }, [days])

  const {scheduleByDateAndUser} = getScheduleByDateAndUser({TbmDriveSchedule})

  const userWorkStatusByDate = userList.reduce((acc, user) => {
    acc[user.id] = user.UserWorkStatus.reduce((acc, userWorkStatus) => {
      acc[formatDate(userWorkStatus.date)] = userWorkStatus.workStatus
      return acc
    }, {})
    return acc
  }, {})

  return (
    <div>
      <HK_HaishaTableEditorGMF.Modal />
      {userList.length > 0 ? (
        CsvTable({
          records: userList
            .sort((a, b) => a.code > b.code)
            .map(user => {
              const userWorkStatusList = userWorkStatusByDate?.[user.id]
              return {
                csvTableRow: [
                  // ユーザー情報
                  {
                    label: `ユーザー`,
                    cellValue: <UserTh {...{user, admin, query, userWorkStatusList}} />,
                    style: {minWidth: 200, left: 0, position: 'sticky', background: `#d8d8d8`},
                  },

                  //日付別
                  ...days.map(date => {
                    const scheduleListOnDate = scheduleByDateAndUser?.[formatDate(date)]?.[String(user.id)] ?? []

                    return {
                      label: (
                        <R_Stack className={` justify-between `} id={`#${formatDate(date)}`}>
                          <div>{formatDate(date, 'M/D(ddd)')}</div>
                        </R_Stack>
                      ),
                      cellValue: (
                        <Cell
                          {...{
                            userWorkStatus: userWorkStatusList?.[formatDate(date)] ?? '',
                            scheduleListOnDate,
                            setModalOpen,
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
        }).WithWrapper({className: `max-w-[calc(95vw-50px)] max-h-[85vh] `})
      ) : (
        <div>データがありません</div>
      )}
    </div>
  )
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
