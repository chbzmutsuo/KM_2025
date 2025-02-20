import {QueryBuilder} from '@app/(apps)/tbm/(builders)/QueryBuilder'
import Updator from '@app/(apps)/tbm/(pages)/tbmOperationGroupCreate copy/Updator'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams
  const params = await props.params
  const {session, scopes} = await initServerComopnent({query})

  const {result: latestHistory} = await fetchUniversalAPI(`tbmOperationGroup`, `findMany`, {
    include: QueryBuilder.getInclude({}).tbmOperationGroup.include,
    where: {confirmed: false},
  })

  const latestOperation = latestHistory[0]

  return (
    <div>
      <Updator {...{latestOperation}}></Updator>
    </div>
  )
}
