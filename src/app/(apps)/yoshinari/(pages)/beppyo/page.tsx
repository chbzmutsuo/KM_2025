import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import React from 'react'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'

import {getUserYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import {Padding} from '@components/styles/common-components/common-components'
import {getNextMonthLastDate, toUtc} from '@class/Days'
import WorkRecordListCC from '@app/(apps)/yoshinari/(pages)/beppyo/WorkRecordListCC'
import {getYoshinariRedirectPath} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'

export default async function Page(props) {
  const query = await props.searchParams
  const {session} = await initServerComopnent({query})

  const {whereQuery, redirectPath} = getYoshinariRedirectPath({query})

  if (redirectPath) return <Redirector {...{redirectPath}} />

  const theSelectedDate = toUtc(query.month)

  const {YoshinariUsers: YoshinariUserList} = await YoshinariUserClass.getUserAndYukyuHistory({userId: undefined, whereQuery})

  const {result: YsManualUserRow} = await fetchUniversalAPI(`ysManualUserRow`, `findMany`, {
    where: {month: {gte: theSelectedDate, lt: getNextMonthLastDate(theSelectedDate, 1)}},
    orderBy: [{code: `asc`}],
  })

  const {yukyuGroupedBy} = await getUserYukyuAgg()

  return (
    <Padding>
      <WorkRecordListCC {...{YoshinariUserList, yukyuGroupedBy, month: theSelectedDate, YsManualUserRow}} />
    </Padding>
  )
}
