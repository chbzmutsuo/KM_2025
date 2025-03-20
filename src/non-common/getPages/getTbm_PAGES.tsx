import {CleansePathSource} from 'src/non-common/path-title-constsnts'
import {PageGetterType} from 'src/non-common/path-title-constsnts'
import {getScopes} from 'src/non-common/scope-lib/getScopes'

export const getTbm_PAGES = (props: PageGetterType) => {
  const {roles = []} = props

  const {session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})

  const publicPaths = []
  const loginPath = [
    {
      tabId: '',
      label: '管理者',
      children: [
        //

        {tabId: 'DriveSchedule', label: '運行計画'},
        {tabId: 'meisai', label: '運行明細'},
        {tabId: 'nempiKanri', label: '燃費管理'},
        {tabId: 'ruiseki', label: '累積距離記帳'},
        {tabId: 'eigyosho', label: '営業所別売上'},
      ],
    },
    {
      tabId: '',
      label: 'マイページ',
      children: [
        //
        {tabId: 'driveInput', label: '運行入力'},
        {tabId: 'driveInput', label: '実績確認'},
      ],
    },
    // {tabId: 'tbmOperation', label: '運行履歴'},

    {
      tabId: '',
      label: 'マスタ',
      children: [
        {tabId: 'calendar', label: 'カレンダー'},
        {tabId: 'tbmBase', label: '営業所・コース管理'},
        // {tabId: 'user', label: 'ドライバー'},
        // {tabId: 'tbmProduct', label: '商品'},
        // {tabId: 'tbmVehicle', label: '車両'},
        // {tabId: 'tbmBillingAddress', label: '請求先支社'},

        // {tabId: 'tbmRouteGroup', label: 'ルートグループ'},
        // {tabId: 'tbmRoute', label: 'ルート'},
      ],
    },
    {
      tabId: '',
      label: '履歴',
      children: [
        //

        {tabId: 'tbmDriveSchedule', label: '走行履歴'},
        {tabId: 'tbmRefuelHistory', label: '給油履歴'},
        {tabId: 'tbmCarWashHistory', label: '洗車履歴'},
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
