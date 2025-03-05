import DriveDetailCC from '@app/(apps)/tbm/(pages)/DriveDetail/DriveDetailCC'
import {getMonthlyTbmDriveData} from '@app/(apps)/tbm/(server-actions)/getMonthlyTbmDriveData'
import {getMidnight} from '@class/Days'
import {FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import prisma from '@lib/prisma'
import {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup, User} from '@prisma/client'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />
  const theDate = whereQuery?.gte ?? getMidnight()
  const {monthlyTbmDriveData, ConfigForMonth} = await getMonthlyTbmDriveData({whereQuery, tbmBaseId})

  return (
    <FitMargin className={`p-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />

      <DriveDetailCC {...{monthlyTbmDriveData, ConfigForMonth}} />
    </FitMargin>
  )
}

export type MonthlyTbmDriveData = {
  rows: {
    schedule: TbmDriveSchedule & {User: User}
    ConfigForRoute: TbmMonthlyConfigForRouteGroup | undefined
    keyValue: {[key: string]: any}
  }[]
}
