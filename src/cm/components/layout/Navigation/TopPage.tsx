'use client'

import {useEffect, useState} from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {C_Stack} from '@components/styles/common-components/common-components'
import {PAGES, pathItemType} from 'src/non-common/path-title-constsnts'
import {HREF} from '@lib/methods/urls'

const TopPage = () => {
  const {router, session, rootPath, pathname, query, roles} = useGlobal()
  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      const pageGetterMethod = PAGES[`${rootPath}_PAGES`]
      const {navItems} = pageGetterMethod({
        session,
        rootPath,
        pathname,
        query,
        dynamicRoutingParams: {},
        roles,
      })
      setNavItems(navItems)
    }
  }, [session])

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <C_Stack className={` gap-[80px] `}>
        {navItems
          .filter(category => {
            return category?.children?.length > 0
          })
          .map(category => (
            <div key={category.label} className={` border-b pb-8 `}>
              <h2 className="mb-4 text-2xl font-bold text-gray-600">{category.label}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.children
                  .filter(data => {
                    return data.exclusiveTo !== false
                  })
                  ?.map((data: pathItemType, i) => {
                    const {tabId, label, ROOT, href} = data

                    return (
                      <C_Stack
                        key={i}
                        onClick={() => handleCardClick(HREF(href, {}, query))}
                        className=" cursor-pointer flex-col items-center  rounded-lg bg-white p-4 py-6 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        <div className=" flex  items-center justify-center text-xl font-bold text-blue-600">{data.label}</div>
                      </C_Stack>
                    )
                  })}
              </div>
            </div>
          ))}
      </C_Stack>
    </div>
  )
}

export default TopPage
