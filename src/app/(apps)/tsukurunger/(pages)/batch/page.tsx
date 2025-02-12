'use client'

import {Absolute} from 'src/cm/components/styles/common-components/common-components'
import {CssString} from 'src/cm/components/styles/cssString'
import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'

import {cl} from 'src/cm/lib/methods/common'
import React from 'react'

import {addMonths} from 'date-fns'
import {Days} from '@class/Days'
// import {getMaterialData} from '@app/(apps)/tsukurunger/(pages)/batch/server-actions'

export default function Page() {
  const {toggleLoad} = useGlobal()
  const today = addMonths(new Date(), 0)
  const {firstDayOfMonth} = Days.getMonthDatum(today)
  const {lastDayOfMonth: lastDateOfLasteMonth} = Days.getMonthDatum(addMonths(today, -1))

  const btnClass = cl(`  font-bold`)

  const actions = [
    {
      label: `マスターデータ更新`,
      description: ``,
      purpose: ``,
      onClick: async () => {
        // const res = await getMaterialData()
      },
    },
  ]
  const {paddingTd, borderCerlls} = CssString.table
  return (
    <Absolute>
      <div className={`t-paper `}>
        <table className={cl(paddingTd, borderCerlls, `w-[1000px]`)}>
          <thead>
            <tr>
              <th>バッチ処理</th>
              <th>詳細</th>
              <th>用途</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action, idx) => {
              return (
                <tr key={idx} className={`  `}>
                  <td className={btnClass}>{action.label}</td>
                  <td className={``}>
                    <MarkDownDisplay>{action.description}</MarkDownDisplay>
                  </td>
                  <td className={``}>
                    <MarkDownDisplay>{action.purpose}</MarkDownDisplay>
                  </td>
                  <td>
                    <button
                      className={`t-link w-[100px] text-2xl`}
                      onClick={async () => {
                        toggleLoad(async () => await action.onClick())
                      }}
                    >
                      実行
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Absolute>
  )
}
