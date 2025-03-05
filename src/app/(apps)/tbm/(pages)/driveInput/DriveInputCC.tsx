'use client'

import useGasolineGMF from '@app/(apps)/tbm/(globalHooks)/useGasolineGMF'
import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import useOdometerInputGMF from '@app/(apps)/tbm/(globalHooks)/useOdometerInputGMF'
import {Arr} from '@class/Arr'
import {Days, formatDate, toUtc} from '@class/Days'
import {DH} from '@class/DH'
import {TextBlue, TextGray, TextGreen, TextOrange, TextRed} from '@components/styles/common-components/Alert'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {OdometerInput, TbmBase, TbmDriveSchedule, TbmRouteGroup, TbmVehicle} from '@prisma/client'
import React from 'react'

export default function DriveInputCC({
  driveScheduleList,
}: {
  driveScheduleList: (TbmDriveSchedule & {
    TbmBase: TbmBase
    TbmRouteGroup: TbmRouteGroup
    TbmVehicle: TbmVehicle & {OdometerInput: OdometerInput[]}
  })[]
}) {
  const {toggleLoad, session, query} = useGlobal()
  const HK_useHaishaTableEditorGMF = useHaishaTableEditorGMF()
  const HK_GasolineGMF = useGasolineGMF()
  const HK_OdometerInputGMF = useOdometerInputGMF()
  const allVehicleIdList = Arr.uniqArray(driveScheduleList.map(d => d.tbmVehicleId))

  const theDate = toUtc(query.from)
  const TextBtnClass = ` cursor-pointer text-lg font-bold hover:bg-gray-300 rounded-md p-1`

  return (
    <div>
      <C_Stack className={` gap-8`}>
        <div>
          <h2>あなたの運行予定</h2>
          <div className="rounded-lg bg-white p-2.5 shadow">
            {!driveScheduleList.length && <TextGray>予定がありません</TextGray>}
            {driveScheduleList.map(d => {
              const {finished} = d
              return (
                <div key={d.id} className="rounded border-b  p-2 py-4 ">
                  <R_Stack className="gap-4">
                    <C_Stack>
                      <span
                        {...{
                          className: `onHover`,
                          onClick: async () => {
                            toggleLoad(async () => {
                              await fetchUniversalAPI(`tbmDriveSchedule`, `update`, {
                                where: {id: d.id},
                                data: {finished: !finished},
                              })
                            })
                          },
                        }}
                      >
                        {finished ? (
                          <TextGreen className={TextBtnClass}>完了</TextGreen>
                        ) : (
                          <TextRed className={TextBtnClass}>未</TextRed>
                        )}
                      </span>
                      <small>{formatDate(d.date)}</small>
                    </C_Stack>
                    <C_Stack>
                      <strong>{d.TbmRouteGroup?.name}</strong>
                      <TextBlue
                        {...{
                          className: TextBtnClass,
                          onClick: async item => {
                            HK_useHaishaTableEditorGMF.setGMF_OPEN({
                              tbmDriveSchedule: d,
                              user: session,
                              date: d.date,
                              tbmBase: d.TbmBase,
                            })
                          },
                        }}
                      >
                        {d.TbmVehicle?.plate}
                      </TextBlue>
                    </C_Stack>
                  </R_Stack>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2>あなたの利用予定の車両</h2>
          <div className="rounded-lg bg-white p-2.5 shadow">
            {!allVehicleIdList.length && <TextGray>予定がありません</TextGray>}
            {allVehicleIdList.map((id, i) => {
              const TbmVehicle = driveScheduleList.map(item => item.TbmVehicle).find(vehicle => vehicle.id === id)

              const TodayMeter = TbmVehicle?.OdometerInput.find(item => {
                return Days.isSameDate(item.date, theDate)
              })

              const {odometerStart = 0, odometerEnd = 0} = TodayMeter ?? {}

              const LastMeter = TbmVehicle?.OdometerInput.find(item => {
                return item.date.getDate() < theDate.getDate()
              })

              const lastOdometerEnd = LastMeter?.odometerEnd ?? 0

              const handleOpenEditGMF = () => {
                HK_OdometerInputGMF.setGMF_OPEN({
                  OdometerInput: {date: theDate, odometerStart, odometerEnd, TbmVehicle},
                })
              }

              return (
                <div key={i} className="rounded p-1 ">
                  <R_Stack className="justify-between   border-b">
                    <C_Stack className="w-[80px] justify-between gap-1 font-semibold">
                      <span>{TbmVehicle?.name}</span>
                      <small>({TbmVehicle?.plate})</small>
                    </C_Stack>

                    <R_Stack className={`gap-3`}>
                      <C_Stack className={` w-[180px] gap-0`}>
                        <small className={`flex gap-1`}>
                          <span>最終:</span>
                          <span>{formatDate(LastMeter?.date, 'MM/DD(ddd)')}</span>
                          <TextOrange>{DH.toPrice(lastOdometerEnd ?? 0)}km</TextOrange>
                        </small>
                        <div>
                          <span>乗車:</span>
                          {odometerStart ? (
                            <TextGreen {...{onClick: handleOpenEditGMF, className: TextBtnClass}}>
                              {DH.toPrice(odometerStart)}
                            </TextGreen>
                          ) : (
                            <TextRed {...{onClick: handleOpenEditGMF, className: TextBtnClass}}>未</TextRed>
                          )}
                        </div>
                        <div>
                          <span>降車:</span>
                          {odometerEnd ? (
                            <TextGreen {...{onClick: handleOpenEditGMF, className: TextBtnClass}}>{odometerEnd}</TextGreen>
                          ) : (
                            <TextRed {...{onClick: handleOpenEditGMF, className: TextBtnClass}}>未</TextRed>
                          )}
                        </div>
                      </C_Stack>

                      {/* 給油 */}
                      <C_Stack className={`  w-[45px] gap-0 `}>
                        <TextBlue
                          {...{
                            className: TextBtnClass,
                            onClick: item =>
                              HK_GasolineGMF.setGMF_OPEN({
                                TbmVehicle,
                                lastOdometerEnd,
                              }),
                          }}
                        >
                          給油
                        </TextBlue>
                        <TextBlue
                          {...{
                            className: TextBtnClass,
                            onClick: item =>
                              HK_GasolineGMF.setGMF_OPEN({
                                TbmVehicle,
                                lastOdometerEnd,
                              }),
                          }}
                        >
                          洗車
                        </TextBlue>
                      </C_Stack>
                    </R_Stack>
                  </R_Stack>
                </div>
              )
            })}
          </div>
        </div>
      </C_Stack>
    </div>
  )
}
