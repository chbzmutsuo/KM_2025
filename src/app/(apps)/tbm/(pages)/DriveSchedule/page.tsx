import DriveScheduleCC from '@app/(apps)/tbm/(pages)/DriveSchedule/DriveScheduleCC'
import {Days, formatDate, getMidnight, toUtc} from '@class/Days'
import Redirector from '@components/utils/Redirector'

import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {endOfMonth} from 'date-fns'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {firstDayOfMonth} = Days.getMonthDatum(new Date())
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({
    query,
    defaultWhere: {
      mode: 'DRIVER',
      month: formatDate(firstDayOfMonth),
    },
  })

  if (redirectPath) return <Redirector {...{redirectPath}} />

  const theDate = whereQuery?.gte ?? getMidnight()
  const MONTH = Days.getMonthDatum(theDate)

  const tbmBase = await prisma.tbmBase.findUnique({where: {id: tbmBaseId}})
  const theMonth = toUtc(query.from || query.month)
  const dateWhere = {
    gte: theMonth,
    lte: getMidnight(endOfMonth(theMonth)),
  }
  const calendar = await prisma.tbmCalendar.findMany({
    where: {tbmBaseId: tbmBase?.id, date: dateWhere},
    orderBy: {date: 'asc'},
  })

  return (
    <>
      <DriveScheduleCC {...{tbmBase, days: MONTH.days, tbmBaseId, whereQuery, calendar}} />
    </>
  )
}
