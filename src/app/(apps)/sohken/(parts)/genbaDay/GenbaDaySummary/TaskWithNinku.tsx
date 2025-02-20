'use client'
import {C_Stack, R_Stack} from '@cm/components/styles/common-components/common-components'


import {ColoredText} from '@components/styles/common-components/colors'


import {PlusCircleIcon} from '@heroicons/react/20/solid'
import React from 'react'
import {GetNinkuList} from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/getNinkuList'

export const TaskWithNinku = ({GenbaDay, editable, setGenbaDayCardEditModal, GenbaDayTaskMidTable}) => {
  const {ninkuList, result} = GetNinkuList({GenbaDay, theDay: GenbaDay.date, GenbaDayTaskMidTable})
  const handleOnClick = ({taskMidTable = undefined}) =>
    setGenbaDayCardEditModal({
      taskMidTable,
      genbaId: GenbaDay.Genba.id,
      genbaDayId: GenbaDay.id,
    })

  return (
    <R_Stack className={`flex-nowrap  gap-1`}>
      {editable && (
        <button onClick={() => handleOnClick({})} className={`t-link`}>
          <PlusCircleIcon className={`w-6`} />
        </button>
      )}

      <C_Stack className={`w-full  `}>
        {GenbaDayTaskMidTable.map((d, i) => {
          const {name, from, to, requiredNinku, color} = d.GenbaTask

          return (
            <R_Stack
              className={`onHover gap-0.5`}
              key={i}
              {...{
                onClick: () => handleOnClick({taskMidTable: d}),
              }}
            >
              <ColoredText {...{bgColor: color, className: ` text-sm px-1`}}>{name}</ColoredText>
              <R_Stack className={` gap-0.5`}>
                <span>人工:</span>
                <strong>{requiredNinku}</strong>
                <span>{result[name].map(d => `- ${d}`)}</span>
              </R_Stack>
            </R_Stack>
          )
        })}
      </C_Stack>
    </R_Stack>
  )
}
