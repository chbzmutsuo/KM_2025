'use client'

import {CenterScreen} from 'src/cm/components/styles/common-components/common-components'
import {CssString} from 'src/cm/components/styles/cssString'
import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'

import {basePath, cl} from 'src/cm/lib/methods/common'
import React from 'react'

import {fetchAlt, toastByResult} from '@lib/methods/api-fetcher'

export default function Page() {
  const {toggleLoad} = useGlobal()

  const btnClass = cl(`  font-bold`)

  const actions = [
    {
      label: `有給付与`,
      description: `本日までの有給が発生しているユーザーに対し、有給を付与します。`,
      purpose: ``,
      onClick: {
        name: `kaonaviBatch`,
        main: async () => {
          const res = await fetchAlt(`${basePath}/yoshinari/api/cron/yukyu/grantPayedLeave`, {}, {method: `GET`})
          toastByResult(res)

          // const {result} = res

          // const messages = [
          //   ...result.map(record => {
          //     const {days, mins, user, PayedLeaveGrantList, rules} = record
          //     const totalMins = PayedLeaveGrantList.reduce((acc, grant) => (acc += grant.mins), 0)
          //     const {day, hour} = TimeClass.convertMin({mins: totalMins, hourDivideNum: rules.workHours})

          //     return [
          //       `==氏名:${user.name}  累計:${day}日(${hour}時間/${mins}分)==`,
          //       ...PayedLeaveGrantList.map((grant: PaidLeaveGrant) => {
          //         const {mins, grantedAt} = grant
          //         const {day, hour} = TimeClass.convertMin({mins, hourDivideNum: rules.workHours})

          //         return `${formatDate(grantedAt, 'YYYY/MM/DD(ddd)')} 付与: ${day}日(${hour}時間/${mins}分)`
          //       }),
          //       ``,
          //     ].flat()
          //   }),
          // ].flat()

          // alert(messages.join('\n'))

          return res
        },
      },
    },
  ]
  const {paddingTd, borderCerlls} = CssString.table
  return (
    <CenterScreen>
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
                        toggleLoad(async () => await action?.onClick?.main())
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
    </CenterScreen>
  )
}
