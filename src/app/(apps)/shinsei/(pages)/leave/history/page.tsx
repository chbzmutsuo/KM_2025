'use client'

import LeaveHistoryTable from '@app/(apps)/shinsei/(pages)/leave/LeaveHistoryTable'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

export default function PurchaseHistoryPage() {
  const useGlobalProps = useGlobal()
  const {session} = useGlobalProps
  const userId = session.id

  return <LeaveHistoryTable {...{dataFetchProps: {where: {userId}}}} />
}
