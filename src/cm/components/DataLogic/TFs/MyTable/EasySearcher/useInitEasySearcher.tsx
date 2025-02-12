'use client'

import { useCallback} from 'react'

import {DH} from 'src/cm/class/DH'
import {useState, useEffect} from 'react'
import {EasySearchObject, makeEasySearchGroupsProp} from 'src/cm/class/builders/QueryBuilderVariables'

import {sleep} from '@lib/methods/common'

import {EsGroupClientPropType} from '@components/DataLogic/TFs/MyTable/EasySearcher/EsGroupClient'

export default function useInitEasySearcher({
  availableEasySearchObj,
  easySearchPrismaDataOnServer,
  dataCountObject,
  useGlobalProps,
}) {
  const [excrusiveGroups, setexcrusiveGroups] = useState({})
  useEffect(() => {
    const excrusiveGroups = {}
    Object.keys(availableEasySearchObj).map(key => {
      const exclusiveGroup: makeEasySearchGroupsProp = availableEasySearchObj[key]?.exclusiveGroup

      const {groupIndex, rowGroupIdx} = exclusiveGroup

      const GROUPKEY_ROWGROUPIDX = `${groupIndex}_${rowGroupIdx}`
      DH.makeObjectOriginIfUndefined(excrusiveGroups, GROUPKEY_ROWGROUPIDX, {
        name: exclusiveGroup?.name,
        searchBtnDataSources: [],
      })

      excrusiveGroups[GROUPKEY_ROWGROUPIDX].searchBtnDataSources.push({
        queryKey: key,
        ...availableEasySearchObj[key],
        rowGroupIdx,
      })
    })

    setexcrusiveGroups(excrusiveGroups)
  }, [easySearchPrismaDataOnServer])

  const {query, addQuery, toggleLoad} = useGlobalProps

  const activeExGroup: EsGroupClientPropType[] = []
  const nonActiveExGroup: EsGroupClientPropType[] = []

  const splitByRow: any = {}
  Object.keys(excrusiveGroups).map((key, groupIdx) => {
    const [idx, rowIdx] = key.split('_')
    const data = excrusiveGroups[key]
    DH.makeObjectOriginIfUndefined(splitByRow, rowIdx, [])

    splitByRow[rowIdx].push(data)
  })

  const RowGroups: EsGroupClientPropType[][] = Object.values(splitByRow).map((EsGroupClientPropList: any, i) => {
    return EsGroupClientPropList.map((EsGroupClientProp, j) => {
      const {name: groupName} = EsGroupClientProp

      const searchBtnDataSources = EsGroupClientProp.searchBtnDataSources.map((dataSource, j) => {
        const {queryKey, keyValueList, id} = dataSource
        const count = dataCountObject[queryKey]
        const isUrgend = count > 0
        const isActive = query[id]

        const conditionMatched = keyValueList?.reduce((flag, curr) => {
          const {key, value} = curr
          if (query?.[key] !== value?.toString()) {
            flag = false
          }
          return flag
        }, true)

        return {
          count,
          isUrgend,
          isActive,
          conditionMatched,
          dataSource,
        }
      })

      const isActiveExGroup = searchBtnDataSources.some(d => d.isActive || d.dataSource.defaultOpen !== false)

      const isRefreshTarget = searchBtnDataSources.some(d => d.dataSource.refresh)

      const isLastBtn = j === EsGroupClientPropList.length - 1

      const result = {groupName, isRefreshTarget, isLastBtn, searchBtnDataSources}

      if (isActiveExGroup > 0) {
        activeExGroup.push(result)
      } else {
        nonActiveExGroup.push(result)
      }

      return result
    })
  })

  const handleEasySearch = useCallback(
    async (props: {dataSource: EasySearchObject}) => {
      const {exclusiveGroup, keyValueList, refresh} = props.dataSource
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
      toggleLoad(async () => {
        await sleep(100)
        await addQuery(newQuery)
      })
    },
    [query, addQuery, toggleLoad]
  )

  return {
    nonActiveExGroup,
    activeExGroup,
    RowGroups,
    handleEasySearch,
  }
}
