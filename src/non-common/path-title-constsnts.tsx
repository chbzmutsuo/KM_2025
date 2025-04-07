import {anyObject} from '@cm/types/types'
import {getPathnameSplitArr} from '@hooks/globalHooks/useMyNavigation'

import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {getYoshinari_PAGES} from 'src/non-common/getPages/getYoshinari_PAGES'
import {getAdvantage_PAGES} from 'src/non-common/getPages/getAdvantagePages'
import {aquapot_PAGES} from 'src/non-common/getPages/aquapot_PAGES'
import {getTbm_PAGES} from 'src/non-common/getPages/getTbm_PAGES'
import {sohken_PAGES} from 'src/non-common/getPages/sohken_PAGES'
import {shinsei_PAGES} from 'src/non-common/getPages/shinsei_PAGES'

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

export const apex_PAGES = (props: PageGetterType) => {
  const {roles, query, session, rootPath, pathname} = props
  const scopes = getScopes(session, {query, roles})

  const publicPaths = []

  const adminPaths = []
  const pathSource = []

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
  apex_PAGES,
  layoutMapping_PAGES,
  Grouping_PAGES,
  Advantage_PAGES: getAdvantage_PAGES,
  tbm_PAGES: getTbm_PAGES,
  KM_PAGES,
  sohken_PAGES: sohken_PAGES,
  MasterKey_Pages,
  yoshinari_PAGES: getYoshinari_PAGES,
  aquapot_PAGES: aquapot_PAGES,
  shinsei_PAGES: shinsei_PAGES,
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
