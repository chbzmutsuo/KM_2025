'use client'

import {DistributionListByModel} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/DistributionListByModel'
import {Circle, R_Stack} from '@components/styles/common-components/common-components'
import {Days} from '@class/Days'
import {formatDate} from '@class/Days'

import React from 'react'

export default function Sub({records, GenbaDay, editable, commonProps, PC}) {
  const {GenbaDayShift, allShiftBetweenDays = []} = GenbaDay

  const ArrayData = GenbaDayShift?.map(v => {
    const {User, from, to, important, directGo, directReturn} = v

    const shiftsOnOtherGembaOnSameDate = allShiftBetweenDays
      .filter(shift => {
        return (
          shift.userId === User.id &&
          Days.isSameDate(shift.GenbaDay.date, GenbaDay.date) &&
          shift.GenbaDay.genbaId !== GenbaDay.genbaId &&
          shift.from
        )
      })
      .sort((a, b) => {
        const aTime = new Date(formatDate(a.GenbaDay.date) + ' ' + a.from)
        const bTime = new Date(formatDate(b.GenbaDay.date) + ' ' + b.from)
        return aTime.getTime() - bTime.getTime()
      })

    const nextShift = shiftsOnOtherGembaOnSameDate.find(shift => {
      const date1 = new Date(formatDate(GenbaDay.date) + ' ' + from)
      const date2 = new Date(formatDate(shift.GenbaDay.date) + ' ' + shift.from)

      return from && shift.from && date1 <= date2
    })

    const currentShiftDisplay = (
      <R_Stack className={`gap-[1px]`}>
        {directGo && <small>{'直行)'}</small>}
        {directReturn && <small>{'直帰)'}</small>}
        <span className={`  font-extrabold text-blue-500`}>{User?.name}: </span>

        {from && (
          <>
            <span>{from}</span>
          </>
        )}
        {(from || to) && <small>~</small>}
        {to && (
          <>
            <span>{to}</span>
          </>
        )}
      </R_Stack>
    )

    const nextShiftIndex = nextShift ? records.findIndex(genbaday => genbaday.id === nextShift?.genbaDayId) : null

    const nextShiftDisplay = nextShift ? (
      <R_Stack className={`gap-[1px]`}>
        <span>➡︎</span>
        <Circle width={18}>{nextShiftIndex + 1}</Circle>
        {nextShift?.from && (
          <>
            <span>{nextShift?.from}</span>
          </>
        )}

        {(nextShift?.from || nextShift?.to) && <small>~</small>}
        {nextShift?.to && (
          <>
            <span>{nextShift?.to}</span>
          </>
        )}
      </R_Stack>
    ) : null

    return {
      ...v,
      name: (
        <div className={important ? 'texwh rounded bg-yellow-400 px-1' : ''}>
          <div>{currentShiftDisplay}</div>
          <div>{nextShiftDisplay}</div>
        </div>
      ),
    }
  }).sort((a, b) => {
    return b.User.sortOrder - a.User.sortOrder
  })
  const {GenbaDaySoukenCar} = GenbaDay

  return (
    <div className={`items-stretch ${PC ? 'row-stack' : 'col-stack'} `}>
      <DistributionListByModel
        {...{
          editable,
          ...commonProps,
          baseModelName: `user`,
          RelationalModel: `genbaDayShift`,
          iconBtn: {text: `人員配置`, color: `yellow`},
          ArrayData,
        }}
      />
      <DistributionListByModel
        {...{
          editable,
          ...commonProps,
          baseModelName: `sohkenCar`,
          RelationalModel: `genbaDaySoukenCar`,
          iconBtn: {text: `車両`, color: `blue`},
          ArrayData: GenbaDaySoukenCar.map(v => ({...v, name: v?.SohkenCar?.name})),
        }}
      />
    </div>
  )
}
