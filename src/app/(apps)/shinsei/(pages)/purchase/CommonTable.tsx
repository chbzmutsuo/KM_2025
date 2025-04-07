'use client'

import {APPROVAL_STATUS_OPTIONS} from '@app/(apps)/shinsei/(constants)/options'
import {ColoredText} from '@components/styles/common-components/colors'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Approval, Product, User} from '@prisma/client'
import {useEffect, useState} from 'react'
import {Button} from 'src/components/ui/button'

interface PurchaseRequest {
  id: string
  purchaseType: string
  Product: Product
  quantity: number
  reason: string
  createdAt: string
  Approval: (Approval & {User: User})[]
}

export default function CommonTable({dataFetchProps = {}}) {
  const useGlobalProps = useGlobal()
  const {session} = useGlobalProps

  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const {result} = await fetchUniversalAPI(`purchaseRequest`, `findMany`, {
        orderBy: {createdAt: 'desc'},
        include: {Product: {}, Approval: {include: {User: {}}}},
        ...dataFetchProps,
      })
      setRequests(result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-6">読み込み中...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My発注履歴</h1>
        <Button onClick={() => (window.location.href = '/shinsei/purchase/create')}>新規申請</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">申請日時</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">購入区分</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">商品</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">数量</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">理由</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">承認者</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">結果</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">コメント</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => {
              const Approval: Approval & {User: User} = request.Approval[0]
              const COLOR = APPROVAL_STATUS_OPTIONS.find(item => item.value === Approval.status)?.color

              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="border-b px-6 py-4 text-sm">{new Date(request.createdAt).toLocaleString('ja-JP')}</td>
                  <td className="border-b px-6 py-4 text-sm">{request.purchaseType}</td>
                  <td className="border-b px-6 py-4 text-sm">{request.Product.name}</td>
                  <td className="border-b px-6 py-4 text-sm">{request.quantity}</td>
                  <td className="border-b px-6 py-4 text-sm">{request.reason}</td>
                  <td className="border-b px-6 py-4 text-sm">{Approval.User.name}</td>
                  <td className="border-b px-6 py-4 text-sm">
                    <ColoredText bgColor={COLOR}>{Approval.status}</ColoredText>
                  </td>
                  <td className="border-b px-6 py-4 text-sm">{Approval.comment}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
