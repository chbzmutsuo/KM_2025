import {PrismaModelNames} from '@cm/types/prisma-types'
import {anyObject} from '@cm/types/types'
import {getPathnameSplitArr} from '@hooks/globalHooks/useMyNavigation'

import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {isDev} from '@lib/methods/common'
import {getYoshinari_PAGES} from 'src/non-common/getPages/getYoshinari_PAGES'
import {getAdvantage_PAGES} from 'src/non-common/getPages/getAdvantagePages'
import {aquapot_PAGES} from 'src/non-common/getPages/aquapot_PAGES'
import {getTbm_PAGES} from 'src/non-common/getPages/getTbm_PAGES'

export const layoutMapping_PAGES = (props: PageGetterType) => {
  const {roles} = props

  const {session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})
  const {admin} = scopes
  const loginPath = [
    {
      tabId: '',
      label: 'マスタ',
      children: [
        {tabId: 'lmLocation', label: '施設'},
        // {tabId: 'pdf', label: 'PDF'},
      ],
    },
  ].map(item => ({...item, exclusiveTo: scopes.login, ROOT: [rootPath]}))

  const systemAdminPaths = [{tabId: 'roleMaster', label: '権限管理'}].map(item => ({
    ...item,
    exclusiveTo: admin,
    ROOT: [rootPath],
  }))

  const pathSource = [{tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath]}, ...loginPath, systemAdminPaths]

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

export const sohken_PAGES = (props: PageGetterType) => {
  const {session, query, rootPath, pathname, roles} = props
  const {login} = getScopes(session, {query, roles})

  const pathSource: pathItemType[] = [
    {tabId: rootPath, label: 'TOP', ROOT: [], hide: true},

    {tabId: 'myPage', label: 'マイページ', ROOT: [rootPath]},
    {
      tabId: `schedule`,
      label: `スケジュール`,
      children: [
        {tabId: 'calendar', label: '日付選択', ROOT: [rootPath]},
        // {tabId: 'genbaDayTwoLine', label: '日別スケジュール', ROOT: [rootPath]},
      ],
    },

    {
      tabId: '',
      label: '設定',
      ROOT: [rootPath],
      children: [
        {tabId: 'genba', label: '現場一覧'},
        {tabId: 'user', label: '社員一覧'},
        {tabId: 'sohkenCar', label: '車両一覧'},
        {tabId: 'genbaTaskMaster', label: '共通タスクマスタ'},
        {tabId: 'prefCity', label: '市区町村一覧'},
      ],
    },
  ]

  return {
    ...CleansePathSource({
      rootPath,
      pathSource,
      pathname,
      session,
    }),
  }
}

export const tsukurunger_PAGES = (props: PageGetterType) => {
  const {roles, session, rootPath, pathname, query} = props

  const scopes = getScopes(session, {query, roles})
  const {adminRole, subConRole} = scopes.getTsukurungerScopes()

  const getMasterModels = () => {
    const masterModels: {
      label: string
      model: PrismaModelNames
    }[] = [
      {label: `元請け業者`, model: `tsMainContractor`},
      {label: `常用下請け業者`, model: `tsRegularSubcontractor`},
      {label: `下請け業者`, model: `tsSubcontractor`},
      {label: `使用機械`, model: `tsMachinery`},
      {label: `使用材料`, model: `tsMaterial`},
    ]

    if (isDev) {
      masterModels.push({label: `現場`, model: `tsConstruction`})
    }
    return masterModels
  }

  const tsukurungerPaths: pathItemType[] = [
    {tabId: `nippo-history`, label: '月別日報履歴'},
    {
      tabId: ``,
      label: 'マスタ',
      children: [
        {tabId: `user`, label: `ユーザー`},
        ...getMasterModels().map(model => {
          return {
            tabId: model.model,
            label: model.label,
          }
        }),
      ],
    },
    {tabId: `roleMaster`, label: '権限管理', ROOT: [rootPath]},
  ].map(item => ({...item, exclusiveTo: adminRole}))

  const subConPaths = [{tabId: `daily`, label: '日報入力'}].map(item => ({
    ...item,
    exclusiveTo: scopes.login,
  }))

  const pathSource = [
    //
    {tabId: 'top', label: 'トップ', hide: true},
    ...subConPaths,
    ...tsukurungerPaths,
  ].map(d => ({...d, ROOT: [rootPath]}))

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

export const MasterKey_Pages = (props: PageGetterType) => {
  const {roles, session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})

  const pabulicPaths = [{tabId: '', label: 'TOP', hide: true, ROOT: [rootPath]}]
  const adminRoot = [rootPath, 'admin']

  const adminPaths: pathItemType[] = [
    {
      ...{tabId: '', label: '各種マスタ', ROOT: adminRoot},
      children: [{tabId: 'masterKeyClientGroup', label: '取引先'}],
    },
  ].map(item => ({...item, exclusiveTo: scopes.login}))

  const pathSource = [...adminPaths]

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
export const sankosha_PAGES = (props: PageGetterType) => {
  const {roles, session, rootPath, pathname, query} = props
  const scopes = getScopes(session, {query, roles})

  const pabulicPaths = [{tabId: '', label: 'TOP', hide: true, ROOT: [rootPath]}]
  const adminRoot = [rootPath, 'admin']

  const processPagePathCommonProps = {ROOT: adminRoot, tabId: 'sankoshaProcess', label: '商品管理'}

  const getProcessPagePath = () => {
    const inputModes = [
      {
        dataKey: 'storage',
        label: `入荷`,
        description: `入荷時に必要なデータのみを表示します`,
        color: `#FFC0CB`,
        query: {g_未検品: true},
      },
      {
        dataKey: 'inspection',
        label: `検品`,
        description: `入荷時および検品時のデータを表示します`,
        color: `#ADD8E6`,
        query: {g_未検品: true},
      },
      {
        dataKey: 'taskManagement',
        label: `タスク`,
        description: `入荷、検品も含めて全てのデータを表示します`,
        color: `#FFFFE0`,
        query: {g_未検品: null},
      },
    ]
    return {
      ...processPagePathCommonProps,
      link: {query: {inputMode: 'all'}},
      children: [
        ...inputModes.map(mode => {
          return {...processPagePathCommonProps, label: mode.label, link: {query: {inputMode: mode.dataKey, ...mode.query}}}
        }),
      ],
    }
  }

  const adminPaths: pathItemType[] = [
    getProcessPagePath(),
    {ROOT: adminRoot, tabId: 'user', label: 'ユーザー'},
    {
      ...{tabId: '', label: '取引先一覧', ROOT: adminRoot},
      children: [{tabId: 'sankoshaClientA', label: 'お客様'}],
    },
    {
      ...{tabId: '', label: 'マスタ', ROOT: adminRoot},
      children: [
        {tabId: 'sankoshaProductMaster', label: '商品'},
        {tabId: 'sankoshaSizeMaster', label: 'サイズ'},
        {tabId: 'sankoshaPriceMaster', label: '費用マスタ'},
      ],
    },
  ].map(item => ({...item, exclusiveTo: scopes.login}))

  const pathSource = [...pabulicPaths, ...adminPaths]

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

export const Grouping_PAGES = (props: PageGetterType) => {
  const {roles, session, rootPath, query, pathname, dynamicRoutingParams} = props

  const scopes = getScopes(session, {query, roles})

  const {admin} = scopes
  const {isSchoolLeader} = scopes.getGroupieScopes()

  const configROOTS = [rootPath]

  const pathSource: pathItemType[] = [
    {ROOT: [rootPath], tabId: '', label: 'TOP', exclusiveTo: 'always'},
    {
      ROOT: configROOTS,
      tabId: '',
      label: '各種設定',
      exclusiveTo: isSchoolLeader,
      children: [
        {tabId: 'school', label: '学校', link: {}, exclusiveTo: admin},
        {tabId: 'teacher', label: '教員', link: {}, exclusiveTo: isSchoolLeader},
        {tabId: 'classroom', label: 'クラス', link: {}, exclusiveTo: isSchoolLeader},
        {tabId: 'student', label: '児童・生徒', link: {}, exclusiveTo: isSchoolLeader},
        {tabId: 'subjectNameMaster', label: '教科', link: {}, exclusiveTo: isSchoolLeader},
        {tabId: 'csv-import', label: 'CSV取り込み', link: {}, exclusiveTo: isSchoolLeader},
      ],
    },
    {ROOT: [rootPath], tabId: 'public', label: '公開ページ', children: [{tabId: 'enter', label: '児童・生徒用', link: {}}]},
    {ROOT: [rootPath, `admin`], tabId: 'dataManagement', label: 'データ抽出（管理者用）', exclusiveTo: admin},
  ]
  const {cleansedPathSource, navItems, breads, allPathsPattenrs} = CleansePathSource({
    rootPath,
    pathSource,
    pathname,
    query,
    session,
    dynamicRoutingParams,
  })

  return {
    allPathsPattenrs,
    pathSource: cleansedPathSource,
    navItems,
    breads,
  }
}

export const demo_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname, dynamicRoutingParams} = props

  const scopes = getScopes(session, {query, roles})

  const pathSource: pathItemType[] = [
    {
      tabId: ``,
      label: 'TOP',
      ROOT: [],
      hide: true,
    },
    {tabId: 'demoUser', label: 'ユーザー', ROOT: [rootPath]},
    {tabId: 'demoDepartment', label: '部署・店舗', ROOT: [rootPath]},
    {tabId: 'demoTask', label: 'タスク', ROOT: [rootPath]},
    {tabId: 'demoTask1', label: '開閉店業務', ROOT: [rootPath]},
    {tabId: 'demoTask2', label: '集計', ROOT: [rootPath]},
  ]

  const {cleansedPathSource, navItems, breads, allPathsPattenrs} = CleansePathSource({
    rootPath,
    pathSource,
    pathname,
    session,
    dynamicRoutingParams,
  })

  return {
    allPathsPattenrs,
    pathSource: cleansedPathSource,
    navItems,
    breads,
  }
}

export const estimate_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname} = props

  const scopes = getScopes(session, {query, roles})

  const pathSource = [
    {tabId: 'admin', label: 'TOP', ROOT: [rootPath], hide: true, exclusiveTo: scopes.login},
    {tabId: '', label: '簡単見積', ROOT: [rootPath]},

    {
      tabId: 'config',
      label: '設定',
      ROOT: [rootPath, 'admin', 'config'],
      exclusiveTo: scopes.login,
      children: [
        {tabId: 'GasolinePrice', label: 'ガソリン単価', link: {}},
        {tabId: 'vehicle', label: '車両マスタ', link: {}},
        {tabId: 'commonCost', label: '共通諸費用', link: {}},
        {tabId: 'tabitakuMarkDown', label: '各種表記', link: {}, exclusiveTo: scopes.admin},
      ],
    },
    // getAccountPath({rootPath, login: scopes.login, session}),
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

export const KM_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname} = props
  const scopes = getScopes(session, {query, roles})

  const publicPaths = [
    // {tabId: 'greeting', label: 'ご挨拶'},
    {tabId: 'service', label: 'サービス'},
    {tabId: 'works', label: '実績'},
    {tabId: 'principle', label: '改善思想'},
    {tabId: 'contact', label: 'ご依頼・お問い合わせ'},
  ].map(item => ({...item, ...{ROOT: [rootPath, 'top']}}))

  const adminPaths = [
    {
      tabId: '',
      label: '設定',
      ROOT: [rootPath, 'admin'],
      exclusiveTo: scopes.admin,
      children: [
        {tabId: 'kaizenClient', label: '取引先'},
        {tabId: 'kaizenWork', label: '実績'},
        {tabId: 'KaizenCMS', label: 'CMS'},
      ],
    },
  ].map(item => ({
    ...item,
    exclusiveTo: scopes.admin,
  }))
  const pathSource = [{tabId: 'top', label: 'トップ', hide: true, ROOT: [rootPath]}, ...publicPaths, ...adminPaths]

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

export const PAGES: any = {
  layoutMapping_PAGES,
  Grouping_PAGES,
  Advantage_PAGES: getAdvantage_PAGES,
  demo_PAGES,
  tbm_PAGES: getTbm_PAGES,
  estimate_PAGES,
  KM_PAGES,
  sohken_PAGES,
  sankosha_PAGES,
  MasterKey_Pages,
  tsukurunger_PAGES,
  yoshinari_PAGES: getYoshinari_PAGES,
  aquapot_PAGES: aquapot_PAGES,
}

export const CleansePathSource = (props: anyObject) => {
  const {rootPath, pathname, query, session, dynamicRoutingParams, roles} = props
  const {login} = getScopes(session, {query, roles})
  const {pathSource} = props

  const navItems: pathItemType[] = []
  const breads: any[] = []
  const allPathsPattenrs: object[] = []

  Object.keys(pathSource).forEach(key => {
    const item = pathSource[key]
    type roopCleansingProps = {
      parent: pathItemType
      item: pathItemType
      key?: string
    }
    /**exclusiveToによるデータクレンジング */
    const roopCleansing = (props: roopCleansingProps) => {
      const {parent, item, key} = props
      const {children} = parent
      if (children && children?.length > 0) {
        children.forEach(child => {
          roopCleansing({parent: item, item: child})
        })
      }
    }
    roopCleansing({parent: pathSource, item, key})
  })

  type constructItemProps = {
    item: pathItemType
    CURRENT_ROOT?: any[]
  }

  const constructItem = (props: constructItemProps) => {
    let {item} = props

    const {CURRENT_ROOT} = props
    const {tabId, link = {query: {}}, label, children, ROOT} = item

    const thisRoot = ROOT ? ROOT : CURRENT_ROOT ?? []
    let href: string | undefined = item?.href ?? undefined
    if (href === undefined) {
      if (thisRoot?.join('/').length > 0) {
        href = link
          ? '/' + thisRoot?.join('/') + '/' + tabId
          : // + addQuerySentence(query)
            undefined
      } else {
        href = link
          ? '/' + tabId
          : // + addQuerySentence(query)
            undefined
      }
    }

    item = {...item, href}

    /**bread crumbようの処理 */
    const pathObject: pathItemType = {
      ...item,
      href: `/${[...thisRoot, tabId].join('/')}`,
      joinedPath: [...(thisRoot ?? []), tabId].join('/'),
    }
    allPathsPattenrs.push(pathObject)

    if (item.children) {
      item.children.forEach((item, i) => {
        const newRoot = [...thisRoot, tabId]
        constructItem({item, CURRENT_ROOT: newRoot})
      })
    }

    return item
  }
  /**nav itemsを作る ( 部分的にbreadsの前処理を含む) */
  pathSource?.forEach((item: pathItemType) => {
    const recursive = (props: {item: pathItemType; result: pathItemType[]}) => {
      let {item} = props
      const {result} = props
      const {ROOT} = item
      item = {
        ...constructItem({item: item, CURRENT_ROOT: ROOT}),
        children: item.children?.map(child => {
          if (child?.exclusiveTo === undefined) {
            child.exclusiveTo = item.exclusiveTo
          }
          return constructItem({
            item: child,
            CURRENT_ROOT: ROOT,
          })
        }),
      }

      if (item.exclusiveTo !== false) {
        result.push(item)
        return result
      }
    }
    recursive({item, result: navItems})
  })

  /**breadsを作る */
  let pathnameSplit: string[] = String(pathname).split('/')
  pathnameSplit = getPathnameSplitArr({pathnameSplit, dynamicRoutingParams})

  const curr: any = []

  for (let i = 0; i < pathnameSplit.length; i++) {
    curr.push(pathnameSplit[i])
    const A = curr.join('/') //現在のパス

    const matched = getPathnameSplitArr({
      pathnameSplit: allPathsPattenrs,
      dynamicRoutingParams,
    }).find((path: {joinedPath: string}) => {
      const B = `/${path.joinedPath}` //ループ対象パス
      const isHit = A === B

      return isHit
    })
    if (matched) {
      breads.push(matched)
    }
  }

  return {cleansedPathSource: pathSource, navItems, breads, allPathsPattenrs}
}

export const identifyPathItem = ({allPathsPattenrs, pathname}) => {
  const pathnameSplitArr = String(pathname).split('/')
  const matchedPathItem = allPathsPattenrs.find(item => {
    const itemHrefArray = item?.href?.split('/')

    const check = itemHrefArray.reduce((acc, cur, i) => {
      const pathSegmentMatched = pathnameSplitArr[i] === cur
      return pathSegmentMatched ? (acc += 1) : acc
    }, 0)

    return check === pathnameSplitArr.length && pathnameSplitArr.length === itemHrefArray.length
  })

  return matchedPathItem as pathItemType
}

export type pathItemType = {
  tabId?: string | RegExp
  label?: string | JSX.Element
  icon?: string
  href?: string
  target?: `_blank` | undefined
  ROOT?: string[]
  hide?: boolean
  exclusiveTo?: boolean | 'always'
  children?: pathItemType[]
  link?: {
    query?: object
  }
  joinedPath?: any
}

export type breadType = {
  href: string
  label: string
  joinedPath: string
} & pathItemType

export type PageGetterType = {
  session: anyObject
  rootPath: string
  pathname: string
  query: anyObject
  dynamicRoutingParams: anyObject
  roles: any[]
}
