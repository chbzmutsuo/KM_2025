import DriveScheduleCC from '@app/(apps)/tbm/(pages)/DriveSchedule/DriveScheduleCC'
import {Days, getMidnight} from '@class/Days'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  const theDate = whereQuery?.gte ?? getMidnight()
  const MONTH = Days.getMonthDatum(theDate)

  const {result: tbmBase} = await fetchUniversalAPI(`tbmBase`, `findUnique`, {where: {id: tbmBaseId}})

  return (
    <>
      <DriveScheduleCC {...{tbmBase, days: MONTH.days, tbmBaseId, whereQuery}} />
    </>
  )
}
