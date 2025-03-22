'use client'
import {C_Stack, R_Stack} from '@cm/components/styles/common-components/common-components'

import {ColoredText} from '@components/styles/common-components/colors'

import {PlusCircleIcon} from '@heroicons/react/20/solid'
import React from 'react'
import {GetNinkuList} from 'src/non-common/(chains)/getGenbaScheduleStatus/getNinkuList'
import {formatDate} from '@class/Days'
import {Alert} from '@components/styles/common-components/Alert'

export const TaskWithNinku = ({GenbaDay, editable, setGenbaDayCardEditModal, GenbaDayTaskMidTable}) => {
  const {ninkuList, result} = GetNinkuList({GenbaDay, theDay: GenbaDay.date, GenbaDayTaskMidTable})
  const handleOnClick = ({taskMidTable = undefined}) => {
    if (editable) {
      setGenbaDayCardEditModal({
        taskMidTable,
        genbaId: GenbaDay.Genba.id,
        genbaDayId: GenbaDay.id,
      })
    }
  }

  return (
    <R_Stack className={`flex-nowrap  gap-1`}>
      {editable && (
        <button onClick={() => handleOnClick({})}>
          <PlusCircleIcon className={`w-6`} />
        </button>
      )}

      <C_Stack className={`w-full  `}>
        {GenbaDayTaskMidTable.length === 0 && (
          <Alert color="red" className={` !border-4`}>
            タスク未設定
          </Alert>
        )}
        {GenbaDayTaskMidTable.map((d, i) => {
          const {name, from, to, requiredNinku, color} = d.GenbaTask

          const overStuffed = result[name] > requiredNinku

          return (
            <R_Stack
              className={` gap-2`}
              key={i}
              {...{
                onClick: () => handleOnClick({taskMidTable: d}),
              }}
            >
              <C_Stack className={`items-center gap-0`}>
                <ColoredText {...{bgColor: color, className: ` text-sm px-1`}}>{name}</ColoredText>
              </C_Stack>
              <div>
                <small>{formatDate(from, 'M/D')}~</small>
                <small>{formatDate(to, 'M/D')}</small>
              </div>
              <R_Stack className={` gap-0.5`}>
                <span>#</span>
                <strong>{requiredNinku}</strong>
                <span>-</span>
                <span>{result[name]}</span>
                {overStuffed && <Alert color="red">超過</Alert>}
              </R_Stack>
            </R_Stack>
          )
        })}
      </C_Stack>
    </R_Stack>
  )
}
