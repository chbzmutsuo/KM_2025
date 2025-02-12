'use client'

import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import BasicModal from '@components/utils/modal/BasicModal'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
import React from 'react'

export default function Template({children}) {
  const {accessScopes} = useGlobal()

  return (
    <div>
      {accessScopes().admin && <UnsetUserDetector />}

      {children}
    </div>
  )
}

const UnsetUserDetector = () => {
  const {data: user = []} = usefetchUniversalAPI_SWR(`user`, `findMany`, {
    where: {apps: {has: 'yoshinari'}},
    include: {
      UserWorkTimeHistoryMidTable: {},
      UserPayedLeaveTypeMidTable: {},
    },
  } as Prisma.UserFindManyArgs)
  const unSetUsers = user
    ?.map(user => {
      const hired = user.hiredAt
      const minimumDateOnWorkType =
        user.UserWorkTimeHistoryMidTable.length && new Date(Math.min(user.UserWorkTimeHistoryMidTable.map(d => d.from.getTime())))
      const minimumDateOnPayedLeaveType =
        user.UserPayedLeaveTypeMidTable.length && new Date(Math.min(user.UserPayedLeaveTypeMidTable.map(d => d.from.getTime())))

      // const validWorkTypeInitialDate = Days.isSameDate(minimumDateOnWorkType, hired)
      // const validPayedLeaveTypeInitialDate = Days.isSameDate(minimumDateOnPayedLeaveType, hired)

      return {
        ...user,
        minimumDateOnWorkType,
        minimumDateOnPayedLeaveType,
        // validWorkTypeInitialDate,
        // validPayedLeaveTypeInitialDate,
      }
    })
    .filter(user => {
      const {
        minimumDateOnWorkType,
        minimumDateOnPayedLeaveType,
        // validWorkTypeInitialDate,
        // validPayedLeaveTypeInitialDate,
      } = user

      const allSet = !!minimumDateOnWorkType && !!minimumDateOnPayedLeaveType && !!user.hiredAt
      return !allSet
      // return !allSet || !validWorkTypeInitialDate || !validPayedLeaveTypeInitialDate
    })

  return (
    <BasicModal
      {...{
        btnComponent: (
          <button className={`text-error-main font-bold`}>{unSetUsers.length}名のユーザーの設定が完了していません。</button>
        ),
      }}
    >
      {CsvTable({
        headerRecords: [
          {
            csvTableRow: [{cellValue: `名前`}, {cellValue: `勤務タイプ`}, {cellValue: `有給タイプ`}, {cellValue: `入社日`}],
          },
        ],
        bodyRecords: (unSetUsers ?? []).map(user => {
          const workTypeCount = user.UserWorkTimeHistoryMidTable.length
          const payedLeaveTypeCount = user.UserPayedLeaveTypeMidTable.length
          const {validWorkTypeInitialDate, validPayedLeaveTypeInitialDate} = user
          return {
            csvTableRow: [
              user.name,
              workTypeCount ? `${workTypeCount}件設定済み` : '未設定',
              payedLeaveTypeCount ? `${payedLeaveTypeCount}件設定済み` : '未設定',
              user.hiredAt ? '設定済み' : '未設定',
            ].map(d => ({cellValue: d, style: d === `未設定` ? {background: `crimson`, color: `white`} : ''})),
          }
        }),
      }).WithWrapper({size: `lg`})}
    </BasicModal>
  )
}
