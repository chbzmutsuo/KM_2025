'use client'
import { R_Stack} from '@cm/components/styles/common-components/common-components'

import {T_LINK} from '@components/styles/common-components/links'

import {GenbaCl} from '@app/(apps)/sohken/class/GenbaCl'
import React from 'react'

export default function GanbaName({GenbaDay, editable}) {
  const allShift = GenbaDay.GenbaDayShift

  const {Genba} = GenbaDay
  const {floorThisPlay} = new GenbaCl(GenbaDay.Genba)
  const defaultStartTime = Genba.defaultStartTime

  const forceNormal = allShift.some(s => {
    return !s.from
  })

  const LinkComponent = editable ? T_LINK : ({children}) => <>{children}</>

  const displayNormal = forceNormal || Genba.defaultStartTime === `通常`

  return (
    <R_Stack className={`items-start gap-x-2 gap-y-0 leading-6 md:flex-row `}>
      <span>
        {!forceNormal ? (
          <>---</>
        ) : (
          <span className={' font-bold ' + (defaultStartTime === '通常' ? 'text-blue-600' : ' text-pink-600')}>
            {defaultStartTime}
            {/* {displayNormal ? '通常' : defaultStartTime} */}
          </span>
        )}
      </span>
      <span>{Genba?.PrefCity?.city}</span>
      <LinkComponent {...{href: `/sohken/genba/${Genba.id}`}}>
        <span>{Genba.name}</span>
        <span>{`(${floorThisPlay})`}</span>
      </LinkComponent>
      <small>{Genba.construction}</small>
    </R_Stack>
  )
}
