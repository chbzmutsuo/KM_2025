import {JoinedQuery} from '@class/JoinedQuery'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {useParams} from 'next/navigation'

export default function useTargetMasterKeyClientIds() {
  const {query, session, addQuery} = useGlobal()
  const params = useParams()

  let masterKeyClientGroupId = session?.masterKeyClientGroupId
  if (session.role === `管理者`) {
    masterKeyClientGroupId = params?.id ? Number(params?.id) : 0
  }

  const {data: clients = []} = usefetchUniversalAPI_SWR(`masterKeyClient`, `findMany`, {
    where: {masterKeyClientGroupId: masterKeyClientGroupId ?? 0},
  })

  const ClientIdJQ = new JoinedQuery({
    query,
    queryKey: `masterKeyClientIds`,
    modelDataArr: clients,
    uniqueKeyOnModel: `id`,
    type: `add`,
  })
  const selectedClientIds = ClientIdJQ.extract()
    .array()
    .current.map(d => Number(d))

  return {
    selectedClientIds,
    clients,
    ClientIdJQ,
  }
}
