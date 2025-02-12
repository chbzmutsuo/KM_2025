import {fetchUserRole} from 'src/non-common/serverSideFunction'
import useSWR from 'swr'

export default function useUserRole({session}) {
  const {data} = useSWR(JSON.stringify(session), async () => {
    const result = await fetchUserRole({session})

    return result
  })

  const roles = data?.roles as any[]

  return {roles}
}
