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
import {IsInShift} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/Stars'
import {IsInKyuka} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/Stars'
import {IsInKyukaTodoke} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/Stars'
import {Days} from '@class/Days'

type dayRemarksType = DayRemarks & {DayRemarksUser: (DayRemarksUser & {User: User})[]}
export const DayRemarkComponent = (props: {date; editable; type: 'top' | 'bottom'}) => {
  const {date, editable, type} = props
  const [dayRemarksState, setdayRemarksState] = useState<dayRemarksType | null>(null)
  const [users, setusers] = useState<any[]>([])
  const {Modal, handleOpen, handleClose, open, setopen} = useModal()

  const initState = async () => {
    const {result: users} = await fetchUniversalAPI(`user`, `findMany`, {
      include: {
        GenbaDayShift: {where: {GenbaDay: {date}}},
        DayRemarksUser: {
          include: {DayRemarks: true},
          where: {DayRemarks: {date}},
        },
      },
      where: {apps: {has: `sohken`}},
      orderBy: [{sortOrder: `asc`}],
    })

    setusers(users)

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
  }

  useEffect(() => {
    initState()
  }, [date])

  if (dayRemarksState === null) return <PlaceHolder />

  if (type === `top`) {
    return (
      <div className={`ml-8 text-lg font-bold`}>
        <label>
          <span className={` mr-2`}>#</span>
          <input
            className="w-[60px] rounded border p-1 text-center "
            value={dayRemarksState.ninkuCount ?? ''}
            type="number"
            onChange={async e => {
              const nextNinkuCount = e.target.value ? Number(e.target.value) : null
              setdayRemarksState({...dayRemarksState, ninkuCount: nextNinkuCount})
              await fetchUniversalAPI(`dayRemarks`, `upsert`, {
                where: {date},
                ...createUpdate({date, ninkuCount: nextNinkuCount}),
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

  const freeUser = users.filter(user => {
    const noShift = user.GenbaDayShift.length === 0

    const kyuka = user.DayRemarksUser.filter(item => {
      const bool = item.kyuka + item.kyukaTodoke

      return bool
    })

    const hasKyuka = kyuka.length > 0

    return noShift && !hasKyuka
  })

  return (
    <div>
      <Modal {...{handleClose}}>
        <UserListSelector
          {...{
            initState,
            users,
            date,
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
          <strong>
            倉庫
            <small>自動表示</small>
          </strong>
          <R_Stack>
            {freeUser
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(user => {
                return <div key={user.id}>{user?.name}</div>
              })}
          </R_Stack>
        </Paper>
        <Paper
          className={`onHover`}
          onClick={() => {
            if (editable) {
              setopen({dayRemarksState, dataKey: `kyuka`})
            }
          }}
        >
          <strong>
            <span className={`text-blue-600`}>■</span>
            休暇
            <small>手動変更</small>
          </strong>
          <R_Stack>
            {dayRemarksState.DayRemarksUser.sort((a, b) => a.User.sortOrder - b.User.sortOrder)
              .filter(item => item[`kyuka`])
              .map(item => {
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
          <strong>
            <span className={`text-yellow-600`}>⚫︎</span>
            休暇願い
            <small>手動変更</small>
          </strong>
          <R_Stack>
            {dayRemarksState.DayRemarksUser.sort((a, b) => a.User.sortOrder - b.User.sortOrder)
              .filter(item => item[`kyukaTodoke`])
              .map(item => {
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

const UserListSelector = ({users, date, setdayRemarksState, dayRemarksState, dataKey, dayRemarksId, initState}) => {
  return (
    <C_Stack>
      {users.map(item => {
        const DayRemark = item.DayRemarksUser.find(remark => {
          return Days.isSameDate(remark?.DayRemarks?.date, date)
        })

        const shiftsOnOtherGembaOnSameDate = item.GenbaDayShift

        const isTarget = dayRemarksState?.DayRemarksUser?.find(user => user.userId === item.id)?.[dataKey] === true

        console.log(DayRemark) //logs

        return (
          <R_Stack key={item.id} className={` justify-between  border-b text-lg`}>
            <R_Stack className={`items-start gap-0.5 leading-3`}>
              <div>{item.name}</div>
              <IsInShift {...{hasShift: shiftsOnOtherGembaOnSameDate.length}} />
              <IsInKyukaTodoke {...{DayRemark}} />
              <IsInKyuka {...{DayRemark}} />
            </R_Stack>
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

                  initState()
                  // setdayRemarksState(prev => {
                  //   const exist = prev.DayRemarksUser.find(user => newDayRemarksUser.id === user.id)

                  //   if (exist) {
                  //     return {
                  //       ...prev,
                  //       DayRemarksUser: prev.DayRemarksUser.map(user => (user.id === exist.id ? newDayRemarksUser : user)).sort(
                  //         (a, b) => a.User.sortOrder - b.User.sortOrder
                  //       ),
                  //     }
                  //   } else {
                  //     return {
                  //       ...prev,
                  //       DayRemarksUser: [...prev.DayRemarksUser, newDayRemarksUser].sort(
                  //         (a, b) => a.User.sortOrder - b.User.sortOrder
                  //       ),
                  //     }
                  //   }

                  //   const newData = prev.DayRemarksUser.map(user => {
                  //     if (user.userId === item.id) {
                  //       return newDayRemarksUser
                  //     }
                  //     return user
                  //   }).sort((a, b) => a.User.sortOrder - b.User.sortOrder)

                  //   return {
                  //     ...prev,
                  //     DayRemarksUser: newData,
                  //   }
                  // })
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
