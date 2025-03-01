import DriveInputCC from '@app/(apps)/tbm/(pages)/driveInput/DriveInputCC'
import {getMidnight} from '@class/Days'
import {C_Stack, FitMargin, Padding} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams
  const params = await props.params
  const {session, scopes} = await initServerComopnent({query})

  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query, defaultWhere: {from: getMidnight()}})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  // const {result: latestHistory} = await fetchUniversalAPI(`tbmOperationGroup`, `findMany`, {
  //   include: QueryBuilder.getInclude({}).tbmOperationGroup.include,
  //   where: {confirmed: false},
  // })

  // const latestOperation = latestHistory[0]

  const driveScheduleList = await getData({session, whereQuery})

  return (
    <Padding>
      <FitMargin>
        <C_Stack className={` h-full justify-between gap-6`}>
          <div className={` w-full`}>
            <NewDateSwitcher {...{}} />
          </div>
          {/* 入力欄 */}
          <div>
            <DriveInputCC {...{driveScheduleList}} />
          </div>
        </C_Stack>
      </FitMargin>
    </Padding>
  )
}

const getData = async ({session, whereQuery}) => {
  const driveScheduleList = await prisma.tbmDriveSchedule.findMany({
    where: {userId: session.id, date: {equals: whereQuery.gte}},
    orderBy: {sortOrder: `asc`},
    include: {
      TbmBase: {},
      TbmRouteGroup: {},
      TbmVehicle: {
        include: {
          OdometerInput: {
            where: {date: {equals: whereQuery.gte}},
          },
        },
      },
    },
  })
  return driveScheduleList
}
