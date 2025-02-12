import SalesNewCC from '@app/(apps)/aquapot/(pages)/sale/register/SalesNewCC/SalesNewCC'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams;
  const {session} = await initServerComopnent({query})
  const {result: user} = await fetchUniversalAPI(`user`, `findUnique`, {
    where: {id: session.id},
  })
  if (!user) {
    return <div>ユーザーが見つかりません</div>
  }
  return <SalesNewCC />
}
