'use client'
import React from 'react'

import {Days, formatDate} from '@class/Days'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import {PencilSquareIcon, PlusCircleIcon, TruckIcon} from '@heroicons/react/20/solid'
import {OdometerInput, TbmDriveSchedule, TbmRouteGroup, TbmVehicle, User, TbmBase, UserWorkStatus} from '@prisma/client'
import {TextRed, TextSub} from '@components/styles/common-components/Alert'
import Link from 'next/link'
import {HREF} from '@lib/methods/urls'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import useGlobal from '@hooks/globalHooks/useGlobal'

export const Cell = (props: {
  //
  fetchData
  scheduleListOnDate: TbmDriveSchedule[]
  setModalOpen
  user: User & {
    UserWorkStatus: UserWorkStatus[]
  }
  userWorkStatus: string
  date: Date
  tbmBase: TbmBase
}) => {
  const {query, toggleLoad} = useGlobal()
  const {fetchData, scheduleListOnDate, setModalOpen, user, date, tbmBase, userWorkStatus} = props

  return (
    <C_Stack className={` min-h-full justify-start `} {...{style: {width: 140}}}>
      <ConfigArea
        {...{
          fetchData,
          userWorkStatus,
          user,
          date,
          scheduleListOnDate,
          setModalOpen,
          tbmBase,
          toggleLoad,
          query,
        }}
      />

      <ScheduleArea
        {...{
          user,
          date,
          scheduleListOnDate,
          setModalOpen,
          tbmBase,
        }}
      />
    </C_Stack>
  )
}

const ScheduleArea = ({scheduleListOnDate, user, date, tbmBase, setModalOpen}) => {
  return (
    <section>
      <C_Stack>
        {scheduleListOnDate.map(
          (
            tbmDriveSchedule: TbmDriveSchedule & {
              TbmRouteGroup: TbmRouteGroup
              TbmVehicle: TbmVehicle & {
                OdometerInput: OdometerInput[]
              }
            }
          ) => {
            const {TbmRouteGroup, TbmVehicle, finished} = tbmDriveSchedule

            const OdometerInputOnDate = TbmVehicle?.OdometerInput?.find(item => Days.isSameDate(item.date, date))
            const {odometerStart, odometerEnd} = OdometerInputOnDate ?? {}
            const carInputCompleted = odometerStart && odometerEnd

            const RouteDisplay = finished ? TextSub : TextRed
            const CarDispaly = carInputCompleted ? TextSub : TextRed

            return (
              <R_Stack className={`  justify-between gap-1  pb-1 `} key={tbmDriveSchedule.id}>
                <C_Stack className={`t-paper gap-1.5  rounded-sm  `}>
                  <RouteDisplay className={` text-[12px] `}>{TbmRouteGroup.name}</RouteDisplay>
                  <R_Stack className={` justify-end `}>
                    <CarDispaly className={`text-end text-sm`}>({TbmVehicle?.vehicleNumber})</CarDispaly>
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
          }
        )}
      </C_Stack>
    </section>
  )
}

const ConfigArea = ({fetchData, userWorkStatus, user, date, setModalOpen, tbmBase, scheduleListOnDate, query}) => {
  return (
    <section>
      <R_Stack className={` w-full  items-center justify-between`}>
        <R_Stack>
          {/* 勤怠 */}
          <div>
            <select
              defaultValue={userWorkStatus}
              className={` w-[40px] rounded  border`}
              {...{
                onChange: async e => {
                  const unique_userId_date = {userId: user.id, date: date}

                  const res = await fetchUniversalAPI(`userWorkStatus`, `upsert`, {
                    where: {unique_userId_date},
                    ...createUpdate({...unique_userId_date, workStatus: e.target.value}),
                  })

                  fetchData()
                },
              }}
            >
              <option value=""></option>
              <option value="勤">勤</option>
              <option value="怠">怠</option>
              <option value="有">有</option>
            </select>
          </div>

          {/* 入力ページ */}
          <div>
            {!!scheduleListOnDate.length && (
              <Link target="_blank" href={HREF('/tbm/driveInput', {g_userId: user.id, from: formatDate(date)}, query)}>
                <TruckIcon className={`text-yellow-main w-5`} />
              </Link>
            )}
          </div>
        </R_Stack>

        {/* 追加ボタン */}
        <div>
          <PlusCircleIcon
            {...{
              className: ` onHover  text-gray-500 h-5 w-5 text-end`,
              onClick: async () => setModalOpen({user, date, tbmBase}),
            }}
          >
            追加
          </PlusCircleIcon>
        </div>
      </R_Stack>
    </section>
  )
}
