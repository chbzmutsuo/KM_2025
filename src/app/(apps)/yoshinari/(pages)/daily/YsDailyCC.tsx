'use client'
import React from 'react'

import {Days, formatDate, getMidnight} from '@class/Days'

import {CssString} from '@components/styles/cssString'
import useModal from '@components/utils/modal/useModal'

import {cl, getColorStyles} from '@lib/methods/common'

import {WorkRecordForm} from '@app/(apps)/yoshinari/(pages)/daily/WorkRecordForm'
import {P_ApRequestTypeMaster, P_YsWorkRecord} from 'scripts/generatedTypes'

import SecondaryTd from '@app/(apps)/yoshinari/(pages)/daily/SecondaryTd'
import ThidTd from '@app/(apps)/yoshinari/(pages)/daily/ThidTd'

import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import {YoshinariUser, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {TableWrapper} from '@components/styles/common-components/Table'
import {InformationCircleIcon} from '@heroicons/react/20/solid'
import UserMonthSummary from '@app/(apps)/yoshinari/(parts)/User/UserMonthSummary'
import {R_Stack} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {TimeCardHistory} from '@prisma/client'
import {atomTypes} from '@hooks/useJotai'

export default function YsDailyCC(props: {
  yukyuGroupedBy
  days
  YoshinariUser: YoshinariUser
  ApRequestTypeMaster: P_ApRequestTypeMaster[]
}) {
  const {Modal, open: WorkLogForm, handleOpen} = useModal()
  const {accessScopes} = useGlobal()
  const {isSuperUser} = accessScopes().getYoshinariScopes()
  const {yukyuGroupedBy, YoshinariUser, days, ApRequestTypeMaster} = props

  const UserCl = new YoshinariUserClass(YoshinariUser)

  UserCl.mpaYsWorkRecord({days})
  UserCl.takeInYukyuAgg({yukyuGroupedBy})

  const today = getMidnight()

  const {Modal: WorkLogHistoryModal, setGMF_OPEN} = useGlobalModalForm<atomTypes[`workLogHistoryGMF`]>(
    `workLogHistoryGMF`,
    null,
    {
      mainJsx: props => <WorkLogHistory {...{GMF_OPEN: props.GMF_OPEN}} />,
    }
  )
  return (
    <>
      <small></small>
      <WorkLogHistoryModal />
      <InputFormModalBtn {...{WorkLogForm, Modal}} />
      <R_Stack {...{className: `w-fit flex-nowrap mx-auto  `}}>
        <NewDateSwitcher {...{monthOnly: true}} />
        <WorkSummaryModalBtn {...{days, UserCl}} />
      </R_Stack>

      <div className={`mx-auto w-full max-w-sm`}>
        <TableWrapper className={` mx-2  text-center`}>
          <table className={cl(CssString.table.borderCerlls)}>
            <thead>
              <tr>
                <th>日付</th>
                <th>詳細</th>
                <th>申請</th>
              </tr>
            </thead>
            <tbody>
              {UserCl.workRecordsByDate.map((obj, dayIdx) => {
                const {date, YsWorkRecord: theWorkLog, HolidayCl, kyujitsuShukkin} = obj

                const isToday = Days.isSameDate(date, today)
                const toIsRequried = !!(theWorkLog?.from && !theWorkLog?.to)
                //休暇申請

                return (
                  <tr
                    key={dayIdx}
                    className={cl(toIsRequried ? 'bg-red-100' : isToday ? 'bg-yellow-main' : '', `text-responsive [&_td]:!p-1`)}
                  >
                    <td
                      style={{
                        fontSize: 12,
                        ...getColorStyles(HolidayCl?.attributes?.color),
                        color: HolidayCl?.attributes?.color ? 'white' : '',
                      }}
                      className={`onHover t-link w-[60px]`}
                      onClick={() => handleOpen({date, theWorkLog})}
                    >
                      <span className={`underline`}>{formatDate(date, 'M/D(ddd)')}</span>
                    </td>

                    <td>
                      <R_Stack className={`flex-nowrap justify-between`}>
                        <SecondaryTd {...{UserCl, theWorkLog, date, kyujitsuShukkin}} />
                        <small {...{className: `t-link`, onClick: () => setGMF_OPEN({workLogId: theWorkLog?.id})}}>履歴</small>
                      </R_Stack>
                    </td>
                    <td className={`ApRequestStatus w-[70px] `}>
                      <ThidTd
                        {...{
                          kyujitsuShukkin,
                          UserCl: UserCl,
                          ApRequestTypeMaster,
                          date,
                          isSuperUser,
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </>
  )
}

const InputFormModalBtn = ({WorkLogForm, Modal}) => {
  const selectedRow: {
    date: Date
    theWorkLog: P_YsWorkRecord
    ApRequestRecordObj: {
      ApRequestType: P_ApRequestTypeMaster
      requestHistoryList: MappeadApRequest[]
      latestReuqest: MappeadApRequest
      requestStatus: {
        status: string
        color: string
      }
    }[]
  } = WorkLogForm
  return (
    <Modal {...{alertOnClose: false}}>
      <WorkRecordForm {...{selectedRow}} />
    </Modal>
  )
}

const WorkSummaryModalBtn = ({days, UserCl}) => {
  const {open, Modal, handleOpen} = useModal()
  return (
    <div>
      <InformationCircleIcon className={`onHover h-8 w-8 scale-150 text-yellow-500`} onClick={handleOpen} />
      <Modal>
        <UserMonthSummary {...{days, UserCl, widthProps: {}}} />
      </Modal>
    </div>
  )
}

const WorkLogHistory = ({GMF_OPEN}) => {
  const {theWorkLog} = GMF_OPEN
  const {data = []} = usefetchUniversalAPI_SWR(`timeCardHistory`, `findMany`, {where: {ysWorkRecordId: theWorkLog?.id}})

  return (
    <div>
      {CsvTable({
        headerRecords: [
          {
            csvTableRow: [
              {cellValue: '入力時刻'},
              {cellValue: '出勤'},
              {cellValue: '退勤'},
              {cellValue: '休憩'},
              {cellValue: '緯度'},
              {cellValue: '経度'},
              {cellValue: '地図'},
            ],
          },
        ],
        bodyRecords: data.map((history: TimeCardHistory, idx) => {
          const {lng = 35, lat = 100} = history
          return {
            csvTableRow: [
              formatDate(history.createdAt, 'YYYY/MM/DD HH:mm'),
              formatDate(history.from, 'HH:mm'),
              formatDate(history.to, 'HH:mm'),
              history.breakTime,
              history.lat,
              history.lng,
              <a
                {...{
                  className: `t-link`,
                  href: `https://www.bing.com/maps?cp=${lat}%7E${lng}&lvl=20.2`,
                  target: `_blank`,
                }}
              >
                地図
              </a>,
            ].map(d => ({cellValue: d})),
          }
        }),
      }).WithWrapper({size: 'lg'})}
    </div>
  )
}
