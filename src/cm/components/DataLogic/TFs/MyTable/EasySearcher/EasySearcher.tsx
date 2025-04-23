'use client'

import React, {useCallback} from 'react'

import useGlobal, {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobal'
import {Center, C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {PrismaModelNames} from '@cm/types/prisma-types'

import {HK_USE_RECORDS_TYPE} from '@components/DataLogic/TFs/PropAdjustor/usePropAdjustorProps'

import GlobalModal from '@components/utils/modal/GlobalModal'

import useInitEasySearcher from '@components/DataLogic/TFs/MyTable/EasySearcher/useInitEasySearcher'

import EsGroupClient from '@components/DataLogic/TFs/MyTable/EasySearcher/EsGroupClient'
import {CircledIcon} from '@components/styles/common-components/IconBtn'
import {ArrowTopRightOnSquareIcon} from '@heroicons/react/20/solid'
import {Wrapper} from '@components/styles/common-components/paper'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import {easySearchDataSwrType} from '@class/builders/QueryBuilderVariables'

export default function EasySearcher(props: {
  easySearchPrismaDataOnServer: easySearchDataSwrType
  useGlobalProps: useGlobalPropType
  dataModelName: PrismaModelNames
  HK_USE_RECORDS?: HK_USE_RECORDS_TYPE
  // prismaDataExtractionQuery: prismaDataExtractionQueryType
}) {
  const {dataModelName, useGlobalProps, easySearchPrismaDataOnServer} = props
  const {dataCountObject, availableEasySearchObj} = easySearchPrismaDataOnServer

  const {activeExGroup, nonActiveExGroup, RowGroups} = useInitEasySearcher({
    availableEasySearchObj,
    easySearchPrismaDataOnServer,
    dataCountObject,
    useGlobalProps,
  })

  const {query, shallowAddQuery, toggleLoad} = useGlobal()

  const handleEasySearch = useCallback(
    async ({dataSource}) => {
      const {exclusiveGroup, keyValueList, refresh} = dataSource
      const friends = Object.keys(availableEasySearchObj).filter(key => {
        const obj = availableEasySearchObj[key]

        return exclusiveGroup?.groupIndex === obj.exclusiveGroup?.groupIndex && obj.refresh !== true
      })

      const others = Object.keys(availableEasySearchObj).filter(key => {
        const obj = availableEasySearchObj[key]

        return exclusiveGroup?.groupIndex !== obj.exclusiveGroup?.groupIndex && obj.refresh !== true
      })

      const refreshes = Object.keys(availableEasySearchObj).filter(key => {
        const {refresh} = availableEasySearchObj[key]
        return refresh === true
      })
      let newQuery = {}
      if (refresh) {
        const resetQuery = Object.fromEntries(Object.keys(availableEasySearchObj).map(key => [key, undefined]))
        newQuery = {...resetQuery}
      } else {
        friends.forEach(key => (newQuery[key] = ''))
        others.forEach(key => (newQuery[key] = query[key]))
      }

      refreshes.forEach(key => (newQuery[key] = undefined))

      //関連のあるキーを挿入
      keyValueList.forEach(obj => {
        const {key, value} = obj

        const isSet = query[key] ?? '' === String(value)
        const newValue = isSet ? '' : String(value)
        newQuery[key] = newValue
      })
      newQuery['P'] = 1
      newQuery['S'] = undefined

      await shallowAddQuery(newQuery)
    },
    [query, shallowAddQuery, toggleLoad, availableEasySearchObj]
  )

  if (activeExGroup.length === 0) return <PlaceHolder />

  return (
    <div>
      <R_Stack className={` items-stretch  gap-0.5`}>
        <ShowAllFilterBtn {...{dataModelName, RowGroups, activeExGroup, handleEasySearch, nonActiveExGroup}} />
        <Main {...{RowGroups, activeExGroup, handleEasySearch}} />
      </R_Stack>
    </div>
  )
}

const Main = ({RowGroups, activeExGroup, hideNonActives = true, handleEasySearch}) => {
  const ShownRowGroups = RowGroups.filter((EsGroupClientPropList, i) => {
    return (
      EsGroupClientPropList.filter((EsGroupClientProp, j) => {
        const isActive = activeExGroup.some(g => {
          return g.groupName === EsGroupClientProp.groupName
        })
        const show = hideNonActives === false || isActive
        return show
      }).length > 0
    )
  })

  return (
    <div>
      <C_Stack className={` w-full `}>
        {ShownRowGroups.map((EsGroupClientPropList, i) => {
          return (
            <R_Stack key={i} className={`   w-fit  items-stretch justify-start gap-0 gap-y-1`}>
              {EsGroupClientPropList.map((EsGroupClientProp, j) => {
                const {isRefreshTarget, isLastBtn} = EsGroupClientProp

                return (
                  <R_Stack key={j}>
                    {/* <R_Stack className={`${border}  relative pr-6 `}> */}
                    <Wrapper>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 px-1">
                          <div className={` `}>
                            <EsGroupClient {...{EsGroupClientProp, handleEasySearch}} />
                          </div>
                        </div>
                      </div>
                    </Wrapper>
                  </R_Stack>
                )
              })}
            </R_Stack>
          )
        })}
      </C_Stack>
    </div>
  )
}

const ShowAllFilterBtn = ({dataModelName, RowGroups, activeExGroup, handleEasySearch, nonActiveExGroup}) => {
  if (nonActiveExGroup.length === 0) {
    return null
  }
  return (
    <Wrapper>
      <Center>
        <GlobalModal
          id={`${dataModelName}-Es-Modal`}
          btnComponent={
            <span className={`t-link pb-1 text-xs `}>
              <CircledIcon>
                <ArrowTopRightOnSquareIcon />
              </CircledIcon>
            </span>
          }
        >
          <Main
            {...{
              dataModelName,
              nonActiveExGroup,
              RowGroups,
              activeExGroup,
              handleEasySearch,
              hideNonActives: false,
            }}
          />
        </GlobalModal>
      </Center>
    </Wrapper>
  )
}
