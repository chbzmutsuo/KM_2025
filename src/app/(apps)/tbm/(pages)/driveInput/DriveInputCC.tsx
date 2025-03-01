'use client'

import useHaishaTableEditorGMF from '@app/(apps)/tbm/(globalHooks)/useHaishaTableEditorGMF'
import useOdometerInputGMF from '@app/(apps)/tbm/(globalHooks)/useOdometerInputGMF'
import {Arr} from '@class/Arr'
import {formatDate, toUtc} from '@class/Days'
import {TextBlue, TextGreen, TextOrange, TextRed} from '@components/styles/common-components/Alert'
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
  const HK_OdometerInputGMF = useOdometerInputGMF()
  const allVehicleIdList = Arr.uniqArray(driveScheduleList.map(d => d.tbmVehicleId))

  const theDate = toUtc(query.from)
  const TextBtnClass = ` cursor-pointer text-lg font-bold hover:bg-gray-300 rounded-md p-1`
  return (
    <div>
      <C_Stack className={` gap-8`}>
        <div>
          <h2>あなたの運行予定</h2>
          <div className="rounded-lg bg-white p-4 shadow">
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
          <div className="rounded-lg bg-white p-4 shadow">
            {allVehicleIdList.map((id, i) => {
              const vehicle = driveScheduleList.map(item => item.TbmVehicle).find(vehicle => vehicle.id === id)

              const OdometerInput = vehicle?.OdometerInput[0]
              const {odometerStart = 0, odometerEnd = 0} = OdometerInput ?? {}
              const handleOpenEditGMF = () => {
                HK_OdometerInputGMF.setGMF_OPEN({
                  OdometerInput: {date: theDate, odometerStart, odometerEnd, TbmVehicle: vehicle},
                })
              }
              return (
                <div key={i} className="rounded p-1 ">
                  <R_Stack className="justify-between   border-b">
                    <C_Stack className="w-[80px] justify-between gap-1 font-semibold">
                      <span>{vehicle?.name}</span>
                      <small>({vehicle?.plate})</small>
                    </C_Stack>

                    <R_Stack className={`gap-3`}>
                      <C_Stack className={` w-[120px] gap-0`}>
                        <div>
                          <span>乗車:</span>
                          {odometerStart ? (
                            <TextGreen className={TextBtnClass}>{odometerStart}</TextGreen>
                          ) : (
                            <TextRed {...{onClick: handleOpenEditGMF}} className={TextBtnClass}>
                              未
                            </TextRed>
                          )}
                        </div>
                        <div>
                          <span>降車:</span>
                          {odometerEnd ? (
                            <TextGreen className={TextBtnClass}>{odometerEnd}</TextGreen>
                          ) : (
                            <TextRed {...{onClick: handleOpenEditGMF}} className={TextBtnClass}>
                              未
                            </TextRed>
                          )}
                        </div>
                      </C_Stack>
                      <div className={` w-[45px] `}>
                        <TextOrange className={TextBtnClass}>給油</TextOrange>
                      </div>
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
