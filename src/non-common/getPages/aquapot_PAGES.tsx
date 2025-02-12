import {PageGetterType, CleansePathSource} from 'src/non-common/path-title-constsnts'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {Arr} from '@class/Arr'
import {getAqLoginType} from '@app/(apps)/aquapot/(lib)/customerLoginLib'

export const aquapot_PAGES = (props: PageGetterType) => {
  const {roles = []} = props

  const isSystemAdmin = !!Arr.findCommonValues(
    ['管理者'],
    roles.map(d => d.name)
  )

  const {session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})

  const publicPaths = [
    {
      tabId: 'myPage',
      label: 'マイページ',
      ROOT: [rootPath],
      // exclusiveTo: !!getAqLoginType({session}).asCustomer
    },
  ]
  const adminPaths = [
    {
      tabId: '',
      label: '売上',
      children: [
        {tabId: 'sale/register', label: '売上登録'},
        {tabId: 'sale/list', label: '売上一覧'},
      ],
    },
    {
      tabId: '',
      label: '在庫管理',
      children: [
        //
        {tabId: 'aqInventoryRegister', label: '仕入れ登録'},
        {tabId: 'inventory', label: '棚卸し'},
      ],
    },

    {
      tabId: '',
      label: 'マスタ',
      children: [
        {tabId: 'aqProduct', label: '商品'},
        {tabId: 'aqCustomer', label: '顧客'},
        {tabId: 'user', label: '従業員'},
        {
          tabId: 'aqCustomerRecord',
          label: '対応履歴',
          link: {query: {customerStatus: '対応中'}},
        },
      ],
    },
    {
      tabId: '',
      label: '選択肢',
      children: [
        {tabId: 'aqSupportGroupMaster', label: '支援ボトル対象団体'},
        {tabId: 'aqProductCategoryMaster', label: '商品カテゴリ'},
        {tabId: 'aqServiecTypeMaster', label: 'ご利用サービス'},
        {tabId: 'aqDealerMaster', label: '担当販売店'},
        {tabId: 'aqDeviceMaster', label: 'ご利用機種'},
      ],
    },
    {tabId: `roleMaster`, label: '権限管理'},

    // {tabId: 'inventory', label: '在庫一覧'},
  ].map(item => ({...item, exclusiveTo: !!getAqLoginType({session}).asUser, ROOT: [rootPath]}))

  const systemAdminPaths = [{tabId: 'roleMaster', label: '権限管理'}].map(item => ({
    ...item,
    exclusiveTo: isSystemAdmin,
    ROOT: [rootPath],
  }))

  const pathSource = [
    {tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath]},
    ...publicPaths,
    ...adminPaths,
    systemAdminPaths,
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
