import YsDailyCC from '@app/(apps)/yoshinari/(pages)/daily/YsDailyCC'

import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {Days} from '@class/Days'

import Redirector from '@components/utils/Redirector'
import {getApRequestIncludes} from '@lib/ApprovementRequest/lib'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import React from 'react'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {getUserYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import {getYoshinariRedirectPath} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import prisma from '@lib/prisma'
import {Center} from '@components/styles/common-components/common-components'
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
  //
  const {yukyuGroupedBy} = await getUserYukyuAgg()

  const {YoshinariUsers} = await YoshinariUserClass.getUserAndYukyuHistory({userId: session.id, whereQuery: whereQuery})

  const {result: ApRequestTypeMaster} = await fetchUniversalAPI(`apRequestTypeMaster`, `findMany`, {
    include: getApRequestIncludes().apRequestTypeMaster.include,
  })

  const {result: ysHoliday} = await fetchUniversalAPI(`ysHoliday`, `findMany`, {})

  const {days} = Days.getIntervalDatum(whereQuery.gte, whereQuery.lte)

  return <YsDailyCC {...{yukyuGroupedBy, YoshinariUser: YoshinariUsers[0], days, ApRequestTypeMaster, ysHoliday}} />
}
