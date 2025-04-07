'use client'

import {useEffect, useState} from 'react'
import {Button} from 'src/components/ui/button'

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  leaveType: string
  reason: string | null
  result: string | null
  createdAt: string
}

export default function LeaveHistoryPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      // TODO: 認証情報から実際のユーザーIDを取得する
      const userId = 'dummy-user-id'
      const response = await fetch(`/api/leave-requests?userId=${userId}`)
      if (!response.ok) {
        throw new Error('データの取得に失敗しました')
      }
      const data = await response.json()
      setRequests(data)
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
        <h1 className="text-2xl font-bold">My申請履歴</h1>
        <Button onClick={() => (window.location.href = '/shinsei/leave')}>新規申請</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">申請日時</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">開始日</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">終了日</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">休暇区分</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">理由</th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-500">結果</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="border-b px-6 py-4 text-sm">{new Date(request.createdAt).toLocaleString('ja-JP')}</td>
                <td className="border-b px-6 py-4 text-sm">{new Date(request.startDate).toLocaleDateString('ja-JP')}</td>
                <td className="border-b px-6 py-4 text-sm">{new Date(request.endDate).toLocaleDateString('ja-JP')}</td>
                <td className="border-b px-6 py-4 text-sm">{request.leaveType}</td>
                <td className="border-b px-6 py-4 text-sm">{request.reason || '-'}</td>
                <td className="border-b px-6 py-4 text-sm">{request.result || '審査中'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
