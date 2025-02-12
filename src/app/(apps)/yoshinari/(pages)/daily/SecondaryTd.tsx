import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {formatDate} from '@class/Days'
import {C_Stack, Circle, R_Stack} from '@components/styles/common-components/common-components'
import {IconBtn} from '@components/styles/common-components/IconBtn'
import React from 'react'

export default function SecondaryTd(props: {kyujitsuShukkin; UserCl: YoshinariUserClass; date; theWorkLog}) {
  const {kyujitsuShukkin, UserCl, date, theWorkLog} = props
  const {overwork, holiday, chikoku, soutai, gaishutsu, privateCar} = UserCl.getComponents({date})

  return (
    <C_Stack className={`items-start`}>
      <R_Stack className={`gap-1 text-sm`}>
        {theWorkLog?.from && (
          <div>
            <Circle width={20}>出</Circle>
            <span>{formatDate(theWorkLog?.from, 'HH:mm')}</span>
          </div>
        )}

        {theWorkLog?.breakTime !== undefined && (
          <>
            <Circle color="gray" width={20}>
              休
            </Circle>
            {theWorkLog?.breakTime}
          </>
        )}
        {theWorkLog?.to && (
          <>
            <Circle color="red" width={20}>
              退
            </Circle>
            <span>{formatDate(theWorkLog?.to, 'HH:mm')}</span>
          </>
        )}
      </R_Stack>
      <R_Stack className={`w-full justify-between gap-1 text-sm`}>
        <section>
          {overwork()}
          {holiday()}
          {chikoku()}
          {soutai()}
          {gaishutsu()}
          {privateCar()}
        </section>
        <section>
          {kyujitsuShukkin ? (
            <IconBtn color="yellow" {...{className: `text-xs  p-0.5`}}>
              休日出勤
            </IconBtn>
          ) : (
            ''
          )}
        </section>
      </R_Stack>
    </C_Stack>
  )
}
