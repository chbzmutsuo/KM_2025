'use client'
import {C_Stack} from '@cm/components/styles/common-components/common-components'


import {T_LINK} from '@components/styles/common-components/links'



import {GenbaCl} from '@app/(apps)/sohken/class/GenbaCl'
import React from 'react'



export default function GanbaName({GenbaDay, editable}) {
  const allShift = GenbaDay.GenbaDayShift

  const {Genba} = GenbaDay
  const {floorThisPlay} = new GenbaCl(GenbaDay.Genba)
  const defaultStartTime = Genba.defaultStartTime

  const SomeStuffIsNormal =
    allShift.some(s => {
      return !s.from
    }) || allShift.length === 0

  const isNormal = defaultStartTime === `通常`
  const lineThrough = isNormal && !SomeStuffIsNormal ? 'line-through' : ' '
  const LinkComponent = editable ? T_LINK : ({children}) => <>{children}</>

  return (
    <C_Stack className={`items-start gap-2 md:flex-row `}>
      <span className={lineThrough}>
        <span className={isNormal ? '' : ' text-red-600'}>{defaultStartTime}</span>
      </span>
      <span>{Genba?.PrefCity?.city}</span>
      <LinkComponent {...{href: `/sohken/genba/${Genba.id}`}}>
        {Genba.name}
        {`(${floorThisPlay})`}
      </LinkComponent>
    </C_Stack>
  )
}
