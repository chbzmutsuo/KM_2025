'use client'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {useParams} from 'next/navigation'
import path from 'path'
import React from 'react'
export default function Template({children}) {
  const {PC, session, pathname, appbarHeight, accessScopes} = useGlobal()
  const params = useParams()

  const validateAccess = () => {
    const allowedPathList = [
      path.join(`/`, `tsukurunger`),
      path.join(`/`, `tsukurunger`, `daily`),
      path.join(`/`, `tsukurunger`, `daily`, '*', `input`),
    ]

    const {subConRole} = accessScopes().getTsukurungerScopes()

    // パス名をスラッシュで分割
    const pathnameSplit = pathname.split(`/`)
    // 許可されたパスリストの中に現在のパスが含まれているかを確認
    const accessAllowd = !!allowedPathList.some(allowedPath => {
      // 各許可されたパスと現在のパスを比較
      const isHit = allowedPath.split(`/`).every((allowedPathPart, i) => {
        const pathPart = pathnameSplit[i]

        // パスの各部分が一致するか、またはワイルドカードであるかを確認
        const hitBySplitSegments = allowedPathPart === pathPart || allowedPathPart === `*`
        // パスの長さが一致するかを確認
        const hitBySplitLength = pathnameSplit.length === allowedPath.split(`/`).length
        return hitBySplitSegments && hitBySplitLength
      })
      return isHit
    })

    const inValidAccess = subConRole && !accessAllowd
    return {
      inValidAccess,
      accessAllowd,
    }
  }
  const {accessAllowd, inValidAccess} = validateAccess()

  if (inValidAccess) {
    return <div>このページは存在しません</div>
  }

  return (
    <div>
      {/* {accessAllowd === false && isDev && (
        <div className={`text-error-main  text-center font-bold`} color={`red`}>
          下請業者アカウントの場合はアクセス不可
        </div>
      )} */}

      {children}
    </div>
  )
}
