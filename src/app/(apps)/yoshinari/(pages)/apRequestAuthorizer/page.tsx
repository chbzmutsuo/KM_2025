//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import { Prisma} from '@prisma/client'

import { P_ApRequestTypeMaster} from 'scripts/generatedTypes'

import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import {getApRequestIncludes} from '@lib/ApprovementRequest/lib'

import {ApRequestClass} from '@class/ApRequestClass/ApRequestClass'
import ApRequestAuthorizerCC from '@app/(apps)/yoshinari/(pages)/apRequestAuthorizer/ApRequestAuthorizerCC'
export default async function DynamicMasterPage(props) {
  const query = await props.searchParams;
  const ApRequestTypeConfigs = Yoshinari.constants().getApRequestTypeConfigs()
  const {session, scopes} = await initServerComopnent({query})
  const {isSuperUser} = scopes.getYoshinariScopes()

  const includes = getApRequestIncludes()
  const queryObj: Prisma.ApRequestFindManyArgs = {
    orderBy: [{createdAt: `desc`}],
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

  const ApRequestType: P_ApRequestTypeMaster[] = await (
    await fetchUniversalAPI(`apRequestTypeMaster`, `findMany`, {include: {ApCustomField: {}}})
  ).result

  return <ApRequestAuthorizerCC {...{apRequest, ApRequestType, ApRequestTypeConfigs, isSuperUser}} />
}
