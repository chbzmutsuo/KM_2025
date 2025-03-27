'use client'
//classを切り替える

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'

import React, {useEffect, useState} from 'react'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {DayRemarks, DayRemarksUser, User} from '@prisma/client'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import useModal from '@components/utils/modal/useModal'

export const DayRemarkComponent = (props: {date; editable; type: 'top' | 'bottom'}) => {
  const {date, editable, type} = props

  type dayRemarksType = DayRemarks & {DayRemarksUser: (DayRemarksUser & {User: User})[]}

  const {Modal, handleOpen, handleClose, open, setopen} = useModal()

  const [dayRemarksState, setdayRemarksState] = useState<dayRemarksType | null>(null)

  useEffect(() => {
    const include = {DayRemarksUser: {include: {User: true}}}
    fetchUniversalAPI(`dayRemarks`, `findUnique`, {where: {date}, include}).then(async res => {
      if (!res.result) {
        const {result} = await fetchUniversalAPI(`dayRemarks`, `upsert`, {
          where: {date},
          create: {date},
          update: {date},
          include,
        })
        setdayRemarksState(result ?? {})
      } else {
        setdayRemarksState(res.result ?? {})
      }
    })
  }, [date])

  if (dayRemarksState === null) return <PlaceHolder />

  if (type === `top`) {
    return (
      <div className={`ml-8 text-lg font-bold`}>
        <label>
          <span className={` mr-2`}>#</span>
          <input
            className="w-[60px] rounded border p-1 text-center "
            value={dayRemarksState.ninkuCount || ''}
            type="number"
            onChange={async e => {
              setdayRemarksState({...dayRemarksState, ninkuCount: Number(e.target.value)})
              await fetchUniversalAPI(`dayRemarks`, `upsert`, {
                where: {date},
                ...createUpdate({date, ninkuCount: Number(e.target.value)}),
              })
            }}
          />
        </label>
      </div>
    )
  }
  const TextArea = ({label, dataKey, dayRemarksState, defaultValue}) => {
    const [value, setvalue] = useState(dayRemarksState?.[dataKey] ?? defaultValue)

    return (
      <Paper>
        <strong>{label}</strong>
        <br />
        <textarea
          disabled={!editable}
          className={`h-[180px] w-full max-w-[95vw] border p-1`}
          {...{
            onBlur: async e => {
              await fetchUniversalAPI(`dayRemarks`, `upsert`, {
                where: {date},
                ...createUpdate({date, [dataKey]: e.target.value}),
              })
              setdayRemarksState({...dayRemarksState, [dataKey]: e.target.value})
            },
            onChange: e => setvalue(e.target.value),
          }}
          value={value}
        ></textarea>
      </Paper>
    )
  }

  return (
    <div>
      <Modal {...{handleClose}}>
        <UserListSelector
          {...{
            setdayRemarksState,
            dayRemarksId: dayRemarksState.id,
            dayRemarksState,
            dataKey: open.dataKey,
          }}
        />
      </Modal>

      <C_Stack className={`w-[500px] max-w-[95vw] p-2`}>
        <Paper
          className={`onHover`}
          onClick={() => {
            if (editable) {
              setopen({dayRemarksState, dataKey: `kyuka`})
            }
          }}
        >
          <strong>休暇</strong>
          <R_Stack>
            {dayRemarksState.DayRemarksUser.filter(item => item[`kyuka`]).map(item => {
              return <div key={item.id}>{item?.User?.name}</div>
            })}
          </R_Stack>
        </Paper>
        <Paper
          className={`onHover`}
          onClick={() => {
            if (editable) {
              setopen({dayRemarksState, dataKey: `kyukaTodoke`})
            }
          }}
        >
          <strong>休暇願い</strong>
          <R_Stack>
            {dayRemarksState.DayRemarksUser.filter(item => item[`kyukaTodoke`]).map(item => {
              return <div key={item.id}>{item?.User?.name}</div>
            })}
          </R_Stack>
        </Paper>
        <Paper>
          <TextArea
            {...{
              defaultValue: '',
              label: `備考欄`,
              dataKey: `bikou`,
              dayRemarksState,
            }}
          />
        </Paper>
        <Paper>
          <TextArea
            {...{
              defaultValue: `吉野:\n菅原:\n佳恵:\n`,
              label: `申請業務`,
              dataKey: `shinseiGyomu`,
              dayRemarksState,
            }}
          />
        </Paper>
      </C_Stack>
    </div>
  )
}

const UserListSelector = ({setdayRemarksState, dayRemarksState, dataKey, dayRemarksId}) => {
  const {data: users = []} = usefetchUniversalAPI_SWR(`user`, `findMany`, {
    where: {apps: {has: `sohken`}},
    orderBy: [{sortOrder: `asc`}],
  })
  return (
    <C_Stack>
      {users.map(item => {
        const isTarget = dayRemarksState?.DayRemarksUser?.find(user => user.userId === item.id)?.[dataKey] === true

        return (
          <R_Stack key={item.id} className={` justify-between  border-b text-lg`}>
            <div>{item.name}</div>
            <div>
              <input
                onChange={async e => {
                  const {result: newDayRemarksUser} = await fetchUniversalAPI(`dayRemarksUser`, `upsert`, {
                    include: {User: true},
                    where: {
                      unique_dayRemarksId_userId: {
                        dayRemarksId: dayRemarksState.id,
                        userId: item.id,
                      },
                    },
                    ...createUpdate({
                      userId: item.id,
                      dayRemarksId,
                      [dataKey]: e.target.checked,
                    }),
                  })

                  setdayRemarksState(prev => {
                    const exist = prev.DayRemarksUser.find(user => newDayRemarksUser.id === user.id)

                    if (exist) {
                      return {
                        ...prev,
                        DayRemarksUser: prev.DayRemarksUser.map(user => (user.id === exist.id ? newDayRemarksUser : user)).sort(
                          (a, b) => a.User.sortOrder - b.User.sortOrder
                        ),
                      }
                    } else {
                      return {
                        ...prev,
                        DayRemarksUser: [...prev.DayRemarksUser, newDayRemarksUser].sort(
                          (a, b) => a.User.sortOrder - b.User.sortOrder
                        ),
                      }
                    }

                    const newData = prev.DayRemarksUser.map(user => {
                      if (user.userId === item.id) {
                        return newDayRemarksUser
                      }
                      return user
                    }).sort((a, b) => a.User.sortOrder - b.User.sortOrder)

                    return {
                      ...prev,
                      DayRemarksUser: newData,
                    }
                  })
                }}
                type="checkbox"
                className={`h-6 w-6`}
                defaultChecked={isTarget}
              />
            </div>
          </R_Stack>
        )
      })}
    </C_Stack>
  )
}
