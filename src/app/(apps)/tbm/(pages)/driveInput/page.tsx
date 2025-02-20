import {QueryBuilder} from '@app/(apps)/tbm/(builders)/QueryBuilder'
import { Padding} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams
  const params = await props.params
  const {session, scopes} = await initServerComopnent({query})

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  const {result: driveScheduleList} = await fetchUniversalAPI(`tbmDriveSchedule`, `findMany`, {
    where: {userId: session.id, date: {equals: whereQuery.gte}},
    include: {
      TbmRouteGroup: {},
      TbmVehicle: {},
    },
  })

  const {result: latestHistory} = await fetchUniversalAPI(`tbmOperationGroup`, `findMany`, {
    include: QueryBuilder.getInclude({}).tbmOperationGroup.include,
    where: {confirmed: false},
  })

  const latestOperation = latestHistory[0]

  return (
    <Padding>
      <NewDateSwitcher {...{}} />

      {driveScheduleList.map(d => {
        return <div key={d.id}>{/*  */}</div>
      })}

      {/* <Updator {...{latestOperation}}></Updator> */}
    </Padding>
  )
}
