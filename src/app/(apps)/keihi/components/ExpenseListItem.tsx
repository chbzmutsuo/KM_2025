'use client'

import ContentPlayer from '@cm/components/utils/ContentPlayer'
import {ExpenseRecord} from '../types'
import {formatAmount, formatDate} from '../utils'
import {T_LINK} from '@cm/components/styles/common-components/links'
import React from 'react'
import {toast} from 'react-toastify'
import {basePath} from '@cm/lib/methods/common'

interface ExpenseListItemProps {
  expense: ExpenseRecord
  isSelected: boolean
  onToggleSelect: (id: string) => void
  subjectColorMap?: Record<string, string>
}

export const ExpenseListItem = ({expense, isSelected, onToggleSelect, subjectColorMap = {}}: ExpenseListItemProps) => {
  const subjectColor = subjectColorMap[expense.subject] || subjectColorMap[expense.mfSubject || '']

  const summaryText = expense.summary || ''
  const keywordsText = expense.keywords?.slice(0, 5).join(', ')
  const insightText = expense.insight || ''
  const autoTagsText = expense.autoTags?.join(', ') || ''
  // For optimistic UI update of status
  const [localStatus, setLocalStatus] = React.useState(expense.status || '')

  const shortText = (text?: string, max = 50) => {
    return text || '-'
    // if (!text) return '-'
    // return text.length > max ? `${text.slice(0, max)}...` : text
  }

  // ステータスに応じた行の背景色を設定
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case '一次チェック済':
        return 'bg-blue-50'
      case 'MF連携済み':
        return 'bg-green-50'
      default:
        return ''
    }
  }

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${getStatusColor(localStatus)}`}>
      <td className="p-2 whitespace-nowrap text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(expense.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      <td className="p-2 align-middle">
        <select
          value={localStatus}
          onChange={async e => {
            const newStatus = e.target.value
            setLocalStatus(newStatus)
            try {
              const response = await fetch(`${basePath}/keihi/api/expense/updateExpenseRoute`, {
                method: 'POST',
                body: JSON.stringify({id: expense.id, data: {status: newStatus}}),
                headers: {'Content-Type': 'application/json'},
              })

              const result = await response.json()

              if (result.success) {
                toast.success(`ステータスを「${newStatus || '未設定'}」に更新しました`)
              } else {
                toast.error('ステータスの更新に失敗しました')
                setLocalStatus(expense.status || '') // エラー時は元の値に戻す
              }
            } catch (err) {
              console.error('status update failed', err)
              toast.error('ステータスの更新に失敗しました')
              setLocalStatus(expense.status || '') // エラー時は元の値に戻す
            }
          }}
          className="px-2 py-1 text-sm border rounded w-[100px]"
        >
          <option value="">未設定</option>
          <option value="一次チェック済">一次チェック済</option>
          <option value="MF連携済み">MF連携済み</option>
        </select>
      </td>

      <td className="p-2 align-middle font-semibold text-gray-900 whitespace-nowrap">
        <div className="text-xs text-gray-500">{expense.date && formatDate(expense.date)}</div>
        <div className="text-sm">
          <T_LINK href={`/keihi/expense/${expense.id}/edit`}>¥{formatAmount(expense.amount)}</T_LINK>
        </div>
      </td>

      <td className="p-2 align-middle">
        <div>
          <span
            className="inline-block px-2 py-1 text-xs rounded font-medium"
            style={{
              backgroundColor: subjectColor ? `${subjectColor}20` : '#F1F5F9',
              color: subjectColor ? subjectColor : '#0F172A',
            }}
          >
            {expense.subject}
          </span>
          {expense.location && <div className="text-xs text-gray-500 mt-1 truncate">📍 {expense.location}</div>}
        </div>
      </td>

      <td>
        {expense.counterpartyName || '-'}
        <br />
        {expense.conversationPurpose?.join(', ') || '-'}
      </td>

      <td>
        {shortText(summaryText)}
        <br />
        {shortText(insightText)}
        <br />
        {shortText(keywordsText)}
      </td>

      <td className="p-2 align-middle">
        {expense.KeihiAttachment && expense.KeihiAttachment.length > 0 ? (
          <div className="flex flex-col items-center ">
            <div className="w-14 h-10">
              <ContentPlayer
                src={expense.KeihiAttachment[0].url}
                styles={{thumbnail: {width: 56, height: 40, borderRadius: '6px'}}}
              />
            </div>
            <div className="text-[11px] text-gray-500 max-w-[120px] truncate">{expense.KeihiAttachment[0].originalName}</div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">画像なし</span>
        )}
      </td>

      <td>{expense.mfSubject || '-'}</td>

      <td>{expense.mfTaxCategory || '-'}</td>

      <td>{shortText(expense.mfMemo || '')}</td>
    </tr>
  )
}
