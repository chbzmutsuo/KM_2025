'use client'

import CommonTable from '@app/(apps)/applicationForms/(pages)/purchase/CommonTable'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function PurchaseHistoryPage() {
  const useGlobalProps = useGlobal()
  const {session} = useGlobalProps
  const userId = session.id

  return <CommonTable {...{dataFetchProps: {where: {userId}}}} />
}
