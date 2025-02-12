'use client'

import {CleansePathSource, PageGetterType} from 'src/non-common/path-title-constsnts'
import {getScopes} from 'src/non-common/scope-lib/getScopes'

export const getYoshinari_PAGES = (props: PageGetterType) => {
  const {session, rootPath, pathname, query, roles} = props
  const scopes = getScopes(session, {query, roles})

  const isValidUser = scopes.login

  const {admin} = scopes
  const {isApprover, isSuperUser} = scopes.getYoshinariScopes()

  const commonPaths = [{tabId: `daily`, label: '出退勤'}].map(item => ({
    ...item,
    exclusiveTo: isValidUser,
    ROOT: [rootPath],
  }))

  const excludesiveToPc = {exclusiveTo: window.innerWidth >= 800}
  const PCOnlyPaths = [
    {
      tabId: `kintai`,
      label: '勤怠表',
      exclusiveTo: excludesiveToPc.exclusiveTo && isValidUser,
    },
    {
      tabId: `yukyu`,
      label: '有給管理表 ',
      exclusiveTo: excludesiveToPc.exclusiveTo && isValidUser && isSuperUser,
    },
    {
      tabId: `beppyo`,
      label: '別表',
      exclusiveTo: excludesiveToPc.exclusiveTo && isValidUser && isSuperUser,
    },
  ].map(item => ({
    ...item,

    ROOT: [rootPath],
  }))

  const approverPaths = [
    //
    {tabId: `apRequestAuthorizer`, label: '稟議承認'},
  ].map(item => ({
    ...item,
    exclusiveTo: isValidUser && (isApprover || isSuperUser),
    ROOT: [rootPath],
    link: {query: isSuperUser ? {status: `確定待ち`} : isApprover ? {status: `保留`} : {}},
  }))

  const superUserPaths = [
    {
      label: '設定',
      children: [
        {tabId: `workType`, label: '勤務パターン'},
        {tabId: `user`, label: '社員'},
        {tabId: `roleMaster`, label: '権限管理'},
        {tabId: `batch`, label: '有給付与（バッチ）'},
      ],
    },
  ].map(item => ({...item, ROOT: [rootPath], exclusiveTo: isSuperUser || admin}))

  const developerPaths = [
    {
      tabId: ``,
      label: `開発者メニュー`,
      children: [
        {tabId: `payedLeaveType`, label: '有給付与パターン'},
        {tabId: `apRequestTypeMaster`, label: '稟議種類'},
      ],
    },
  ].map(item => ({...item, ROOT: [rootPath], exclusiveTo: admin}))

  const pathSource = [
    //
    {tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath]},
    {
      tabId: 'manu',
      label: 'マニュアル',
      target: '_blank',
      href: `https://docs.google.com/document/d/1kR60csy3vINaEwyHupXYuCt7LfygZzP_Og9O_3uhSbU/edit`,
      ROOT: [rootPath],
    },
    ...commonPaths,
    ...PCOnlyPaths,
    ...approverPaths,
    ...superUserPaths,
    ...developerPaths,
  ]

  const {cleansedPathSource, navItems, breads, allPathsPattenrs} = CleansePathSource({
    rootPath,
    pathSource,
    pathname,
    session,
  })

  return {
    allPathsPattenrs,
    pathSource: cleansedPathSource,
    navItems,
    breads,
  }
}
