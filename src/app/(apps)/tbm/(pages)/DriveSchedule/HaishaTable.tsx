'use client'
import React from 'react'

import {Days, formatDate} from '@class/Days'
import {C_Stack, Center, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import {PencilSquareIcon} from '@heroicons/react/20/solid'
import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import {Button} from '@components/styles/common-components/Button'

export default function HaishaTable({userList, days, TbmDriveSchedule}) {
  const HK_HaishaTableEditor = useHaishaTableEditorGMF()
  const setModalOpen = HK_HaishaTableEditor.setGMF_OPEN
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
                      <span>{user.code}</span>
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
                    label: formatDate(date, 'M/D(ddd)'),
                    cellValue: <Cell {...{scheduleOnDate, setModalOpen, user, date}} />,

                    style: {minWidth: 160, minHeight: 160},
                  }
                }),
              ],
            }
          }),
        }).WithWrapper({className: `max-w-[calc(95vw-350px)]`})
      ) : (
        <div>データがありません</div>
      )}
    </div>
  )
}

const Cell = ({scheduleOnDate, setModalOpen, user, date}) => {
  return (
    <Center {...{style: {minWidth: 120, minHeight: 60}}}>
      <C_Stack className={`items-center gap-1`}>
        {scheduleOnDate.map(tbmDriveSchedule => {
          const {TbmRouteGroup, TbmVehicle} = tbmDriveSchedule
          return (
            <R_Stack className={` w-[160px] justify-between gap-0.5 border-b`} key={tbmDriveSchedule.id}>
              <div>
                <span>{TbmRouteGroup.name}</span>
                <span>({TbmVehicle.plate})</span>
              </div>
              <PencilSquareIcon
                className={`text-yellow-main onHover h-5 w-5`}
                onClick={() => {
                  setModalOpen({tbmDriveSchedule, user, date})
                }}
              />
            </R_Stack>
          )
        })}
        <div>
          <Button
            {...{
              size: `xs`,
              color: 'green',
              onClick: async () => setModalOpen({user, date}),
            }}
          >
            NEW
          </Button>
        </div>
      </C_Stack>
    </Center>
  )
}
