'use client'

import { CenterScreen} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {HREF} from '@lib/methods/urls'
import Link from 'next/link'

const navigationItems = [
  {
    title: '発注申請',
    description: '新規発注申請の作成',
    href: '/applicationForms/purchase/create',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'My発注履歴',
    description: '発注申請の履歴を確認',
    href: '/applicationForms/purchase/history',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: '発注結果入力',
    description: '発注申請の承認/却下',
    href: '/applicationForms/purchase/result',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: '有給申請',
    description: '新規有給申請の作成',
    href: '/applicationForms/leave',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'My申請履歴',
    description: '有給申請の履歴を確認',
    href: '/applicationForms/leave/history',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: '有給結果入力',
    description: '有給申請の承認/却下',
    href: '/applicationForms/leave/result',
    color: 'bg-green-500 hover:bg-green-600',
  },
]

export default function ApplicationFormsPage() {
  const {query} = useGlobal()

  return <CenterScreen className={` text-2xl font-bold`}>メニューを選択してください</CenterScreen>
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">申請フォーム</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {navigationItems.map(item => (
          <Link
            key={item.href}
            href={HREF(item.href, query, {})}
            className={`block rounded-lg p-6 text-white ${item.color} transition-colors duration-200`}
          >
            <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
            <p className="text-white/80">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
