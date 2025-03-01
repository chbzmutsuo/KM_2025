'use client'
import React, {useEffect} from 'react'

import {Days, formatDate, getMidnight} from '@class/Days'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import {PencilSquareIcon, PlusCircleIcon} from '@heroicons/react/20/solid'
import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'

export default function HaishaTable({userList, days, TbmDriveSchedule, tbmBase}) {
  const HK_HaishaTableEditor = useHaishaTableEditorGMF()
  const setModalOpen = HK_HaishaTableEditor.setGMF_OPEN

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

  return (
    <div>
      {userList.length > 0 ? (
        CsvTable({
          records: userList.map(user => {
            return {
              csvTableRow: [
                // ユーザー情報
                {
                  label: [
                    //
                    `コード`,
                    `名前`,
                    // `出勤`,
                    // `休み`,
                    // `有給`,
                  ].join(` / `),
                  cellValue: (
                    <R_Stack>
                      {/* <span>{user.code}</span> */}
                      <span>{user.name}</span>
                      {/* <span>{`-`}</span>
                      <span>{`-`}</span>
                      <span>{`-`}</span> */}
                    </R_Stack>
                  ),
                  style: {minWidth: 200, left: 0, position: 'sticky', background: `#d8d8d8`},
                },

                //日付別
                ...days.map(date => {
                  const scheduleOnDate = TbmDriveSchedule.filter(schedule => {
                    return Days.isSameDate(schedule.date, date) && schedule.userId === user.id
                  })

                  return {
                    label: <div id={`#${formatDate(date)}`}>{formatDate(date, 'M/D(ddd)')}</div>,
                    cellValue: (
                      <div>
                        <Cell {...{scheduleOnDate, setModalOpen, user, date, tbmBase}} />
                      </div>
                    ),
                    // style: {minWidth: 160, minHeight: 160},
                  }
                }),
              ],
            }
          }),
        }).WithWrapper({className: `max-w-[calc(95vw-50px)]`})
      ) : (
        <div>データがありません</div>
      )}
    </div>
  )
}

const Cell = ({scheduleOnDate, setModalOpen, user, date, tbmBase}) => {
  return (
    <C_Stack className={` h-full justify-between gap-1`} {...{style: {width: 140, minHeight: 60}}}>
      <div>
        {scheduleOnDate.map(tbmDriveSchedule => {
          const {TbmRouteGroup, TbmVehicle} = tbmDriveSchedule
          return (
            <R_Stack className={`  justify-between gap-0.5 border-b pb-1`} key={tbmDriveSchedule.id}>
              <C_Stack className={`t-paper gap-1.5  rounded-sm `}>
                <span className={` text-[12px]`}>{TbmRouteGroup.name}</span>
                <R_Stack className={` justify-end`}>
                  <small className={` text-end`}>({TbmVehicle.plate})</small>
                  <PencilSquareIcon
                    className={`text-blue-main onHover h-5 w-5`}
                    onClick={() => {
                      setModalOpen({tbmDriveSchedule, user, date, tbmBase})
                    }}
                  />
                </R_Stack>
              </C_Stack>
            </R_Stack>
          )
        })}
      </div>

      <div className={`flex  justify-end`}>
        <PlusCircleIcon
          {...{className: ` onHover  text-gray-500 h-5 w-5 text-end`, onClick: async () => setModalOpen({user, date})}}
        >
          追加
        </PlusCircleIcon>
      </div>
    </C_Stack>
  )
}
