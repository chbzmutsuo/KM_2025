'use client'

import PurchaseHistoryTable from '@app/(apps)/shinsei/(pages)/purchase/PurchaseHistoryTable'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

export default function PurchaseHistoryPage() {
  const useGlobalProps = useGlobal()
  const {session} = useGlobalProps
  const userId = session.id

  return <PurchaseHistoryTable {...{dataFetchProps: {where: {userId}}}} />
}
