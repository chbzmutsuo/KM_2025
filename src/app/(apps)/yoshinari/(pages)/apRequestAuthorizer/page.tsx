//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

import {P_ApRequestTypeMaster} from 'scripts/generatedTypes'

import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import {getApRequestIncludes} from '@lib/ApprovementRequest/lib'

import {ApRequestClass} from '@class/ApRequestClass/ApRequestClass'
import ApRequestAuthorizerCC from '@app/(apps)/yoshinari/(pages)/apRequestAuthorizer/ApRequestAuthorizerCC'
export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const ApRequestTypeConfigs = Yoshinari.constants().getApRequestTypeConfigs()
  const {session, scopes} = await initServerComopnent({query})
  const {isSuperUser} = scopes.getYoshinariScopes()

  const includes = getApRequestIncludes()
  const queryObj: Prisma.ApRequestFindManyArgs = {
    // orderBy: [{createdAt: `desc`}],
    include: includes.apRequest.include,
    where: isSuperUser
      ? {
          status: query.status,
        }
      : {
          status: query.status,
          ApReceiver: {some: {userId: isSuperUser ? undefined : session?.id}},
        },
  }

  let apRequest = await (await fetchUniversalAPI(`apRequest`, `findMany`, queryObj)).result
  apRequest = apRequest.map(ap => {
    return new ApRequestClass(ap).ApRequest
  })

  apRequest = apRequest.sort((a, b) => {
    const nameCompare = String(a?.ApSender?.User?.name).localeCompare(String(b?.ApSender?.User?.name))

    const dateCompare = new Date(a.cf[`日付`].value).getTime() - new Date(b.cf[`日付`].value).getTime()

    return nameCompare || dateCompare * -1
  })

  const ApRequestType: P_ApRequestTypeMaster[] = await (
    await fetchUniversalAPI(`apRequestTypeMaster`, `findMany`, {include: {ApCustomField: {}}})
  ).result

  return (
    <div>
      <div className={`print-target`}>
        <ApRequestAuthorizerCC {...{apRequest, ApRequestType, ApRequestTypeConfigs, isSuperUser}} />
      </div>
    </div>
  )
}
