'use client'
import {useParams, usePathname, useRouter, useSearchParams} from 'next/navigation'

import {useCallback, useMemo} from 'react'

import {HREF, makeGlobalQuery, makeQuery} from 'src/cm/lib/methods/urls'

import {anyObject} from '@cm/types/types'

export default function useMyNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pathname = usePathname() ?? ''
  const rootPath = useMemo(() => pathname?.split('/')[1], [pathname])
  const dynamicRoutingParams = useParams()

  const shallowPush = href => {
    history.pushState({}, '', href)
  }

  const asPath = useMemo(() => pathname + '?' + searchParams?.toString(), [pathname, searchParams])

  const query = useMemo(() => {
    return makeQuery(searchParams)
  }, [searchParams])

  const getGlobalQuery = useCallback(() => makeGlobalQuery(query), [query])

  const addQuery = useCallback(
    (additionalQuery = {}, method = 'push', shallow = false) => {
      const newQuery = {...query, ...additionalQuery}
      const path = HREF(pathname, newQuery, makeGlobalQuery(newQuery))
      if (shallow) {
        shallowPush(path)
      } else {
        router[method](path)
      }
    },
    [query, pathname]
  )
  const shallowAddQuery = query => addQuery(query, `push`, true)

  const getRouterLinkProps = (nextQuery: anyObject, nextPath: string = pathname) => {
    const newQuery = {...query, ...nextQuery}
    const path = HREF(nextPath, newQuery, makeGlobalQuery(newQuery))
    return {href: path, router}
  }

  const useMyNavigationDependencies = [pathname, query, asPath]
  return {
    router,
    pathname,
    query,
    asPath,
    getGlobalQuery,
    rootPath,
    searchParams,
    addQuery,
    dynamicRoutingParams,
    getRouterLinkProps,
    useMyNavigationDependencies,
    shallowPush,
    shallowAddQuery,
  }
}

// dynamicRoutingParamsと同じ値があった場合は、そのキーに変換して配列を返す
export const getPathnameSplitArr = ({pathnameSplit, dynamicRoutingParams}) => {
  return pathnameSplit.map(item => {
    // const matched = Object.keys(dynamicRoutingParams ?? {}).find(key => {
    //   return dynamicRoutingParams[key] === item
    // })

    return item
    // return matched ? matched : item
  })
}
