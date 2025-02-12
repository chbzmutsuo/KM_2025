import MainContractorList from '@app/(apps)/tsukurunger/(pages)/daily/MainContractorList'
import {IsMyConstruction} from '@app/(apps)/tsukurunger/(roles)/roler-lib'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams;
  const {scopes, session} = await initServerComopnent({query})
  const {subConRole} = scopes.getTsukurungerScopes()

  const myConstructionWhere = IsMyConstruction({session})

  const {result: MainContractors} = await fetchUniversalAPI(`tsMainContractor`, `findMany`, {
    include: {
      TsConstruction: {
        where: subConRole ? myConstructionWhere : undefined,
        orderBy: [{sortOrder: `asc`}],
      },
    },
    where: subConRole ? {TsConstruction: {some: myConstructionWhere}} : undefined,
    orderBy: [{sortOrder: `asc`}],
  } as Prisma.TsMainContractorFindManyArgs)
  return <MainContractorList {...{MainContractors}} />
}
