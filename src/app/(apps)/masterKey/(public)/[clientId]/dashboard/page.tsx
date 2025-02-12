'use client'

import {C_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'

import React from 'react'

export default function DashBoardPage(props) {
  const {MasterKeyClient} = props ?? {}
  const DataFilter = () => {
    return (
      <div>
        <div>日付抽出条件設定</div>
        いつから、いつまでのデータを表示しますか？ デフォルトのスタート、エンドを決めたい(過去1年)
      </div>
    )
  }

  return (
    <C_Stack>
      <Paper className={`min-h-[200px]`}>
        <DataFilter />
      </Paper>
      <Paper className={`min-h-[200px]`}>
        <strong>全体実績サマリ</strong>
      </Paper>
      <Paper className={`min-h-[200px]`}>
        <strong>月度実績</strong>
      </Paper>
      <Paper className={`min-h-[200px]`}>
        <strong>月間分布表</strong>
      </Paper>
      <Paper className={`min-h-[200px]`}>
        <strong>累積分布表</strong>
      </Paper>
    </C_Stack>
  )
}
