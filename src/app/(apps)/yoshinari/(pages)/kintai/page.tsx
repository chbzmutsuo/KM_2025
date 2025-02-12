import Redirector from '@components/utils/Redirector'

import React from 'react'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

import {getUserYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import {Center, FitMargin, Padding} from '@components/styles/common-components/common-components'
import KintaiSheetCC from '@app/(apps)/yoshinari/(pages)/kintai/KintaiSheetCC/KintaiSheetCC'
import {getYoshinariRedirectPath} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import prisma from '@lib/prisma'
import {TextRed} from '@components/styles/common-components/Alert'

export default async function Page(props) {
  const query = await props.searchParams
  const {session} = await initServerComopnent({query})
  const UserWorkTimeHistoryMidTable = await prisma.userWorkTimeHistoryMidTable.findMany({
    where: {userId: session?.id},
  })

  if (UserWorkTimeHistoryMidTable.length === 0) {
    return (
      <Center>
        <TextRed>ユーザーの 勤務パターン履歴が設定されていません</TextRed>
      </Center>
    )
  }

  const {whereQuery, redirectPath} = getYoshinariRedirectPath({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  const {yukyuGroupedBy} = await getUserYukyuAgg()

  const {YoshinariUsers} = await YoshinariUserClass.getUserAndYukyuHistory({userId: session.id})

  return (
    <Padding>
      <FitMargin>
        <KintaiSheetCC {...{yukyuGroupedBy, YoshinariUser: YoshinariUsers[0], query, whereQuery}} />
      </FitMargin>
    </Padding>
  )
}
