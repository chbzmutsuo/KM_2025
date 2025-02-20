import {CleansePathSource} from 'src/non-common/path-title-constsnts'
import {PageGetterType} from 'src/non-common/path-title-constsnts'
import {getScopes} from 'src/non-common/scope-lib/getScopes'

export const getTbm_PAGES = (props: PageGetterType) => {
  const {roles = []} = props

  const {session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})

  const publicPaths = []
  const loginPath = [
    {tabId: 'DriveSchedule', label: '運行計画'},
    {
      tabId: '',
      label: 'マイページ',
      children: [
        //
        {tabId: 'driveInput', label: '運行入力'},
        {tabId: 'driveInput', label: '実績確認'},
      ],
    },
    {tabId: 'tbmOperationGroup', label: '運行履歴'},
    {tabId: 'tbmBase', label: '営業所・コース管理'},

    {
      tabId: '',
      label: 'マスタ',
      children: [
        {tabId: 'calendar', label: 'カレンダー'},
        {tabId: 'user', label: 'ドライバー'},
        {tabId: 'tbmVehicle', label: '車両'},
        {tabId: 'tbmBillingAddress', label: '請求先支社'},

        // {tabId: 'tbmRouteGroup', label: 'ルートグループ'},
        // {tabId: 'tbmRoute', label: 'ルート'},
      ],
    },
  ].map(item => ({...item, exclusiveTo: scopes.login, ROOT: [rootPath]}))

  const pathSource = [{tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath]}, ...publicPaths, ...loginPath]

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
