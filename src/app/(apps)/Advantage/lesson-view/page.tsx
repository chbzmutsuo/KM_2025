import {QueryBuilder} from '@app/(apps)/Advantage/(utils)/class/QueryBuilder'
import LessonList from '@app/(apps)/Advantage/(utils)/Detail/LessonList'
import NotAvailable from '@cm/components/utils/NotAvailable'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import prisma from '@cm/lib/prisma'

export default async function LessonView(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {isCoach} = scopes.getAdvantageProps()
  const include = QueryBuilder.getInclude({query}).bigCategory?.include
  const bigCategories = await prisma.bigCategory.findMany({
    include,
    orderBy: [{sortOrder: `asc`}],
  })

  return (
    <>
      <NotAvailable {...{isAvailable: !isCoach, reason: <div className={`text-[40px]`}>生徒専用ページです</div>}}>
        <LessonList {...{bigCategories}} />
      </NotAvailable>
    </>
  )
}
