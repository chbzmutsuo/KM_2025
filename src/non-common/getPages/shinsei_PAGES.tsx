import {getScopes} from 'src/non-common/scope-lib/getScopes'

import {CleansePathSource, PageGetterType, pathItemType} from 'src/non-common/path-title-constsnts'

export const shinsei_PAGES = (props: PageGetterType) => {
  const {session, query, rootPath, pathname, roles} = props
  const {login, admin} = getScopes(session, {query, roles})

  const isKanrisha = session.name === `管理者`

  const systemAdmin = roles.find(r => r.name === `管理者`)

  const pathSource: pathItemType[] = [
    {tabId: rootPath, label: 'TOP', ROOT: [], hide: true},
    {
      tabId: '',
      label: '発注',
      ROOT: [rootPath],
      children: [
        {tabId: 'purchase/create', label: '新規発注'},
        {tabId: 'purchase/history', label: '発注履歴'},
        {tabId: 'purchase/result', label: '発注承認'},
      ],
    },
    {
      tabId: '',
      label: '休暇',
      ROOT: [rootPath],
      children: [
        {tabId: 'leave/create', label: '新規休暇申請'},
        {tabId: 'leave/history', label: '休暇申請履歴'},
        {tabId: 'leave/result', label: '休暇申請承認'},
      ],
    },
    {
      tabId: '',
      label: '管理',
      ROOT: [rootPath],
      children: [
        {tabId: 'user', label: 'ユーザー一覧'},
        {tabId: `roleMaster`, label: '権限管理'},
      ],
    },
  ].map(item => ({...item, exclusiveTo: !isKanrisha}))

  return {
    ...CleansePathSource({
      rootPath,
      pathSource,
      pathname,
      session,
    }),
  }
}
