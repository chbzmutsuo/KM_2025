import {Sub} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/search-methods'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {ColorBlock} from 'src/cm/components/styles/common-components/colors'
import {SearchedItem} from 'src/cm/components/styles/common-components/SearchedItem'
import React, {useEffect, useState} from 'react'
import {formatDate} from '@class/Days'

import {judgeColType} from '@class/Fields/lib/methods'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {PrismaModelNames} from '@cm/types/prisma-types'

export default function SearchedItemList(props: {
  Cached_Option_Props
  columns
  SearchQuery
  searchQueryKey
  dataModelName
  ResetBtnMemo
  query
}) {
  const {Cached_Option_Props, columns, SearchQuery, searchQueryKey, dataModelName, ResetBtnMemo, query} = props
  const AND = SearchQuery.createWhere({dataModelName, query})
  if (Object.keys(AND).length === 0) return null

  const [SearchedItems, setSearchedItems] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const SearchedItems = await Promise.all(
        Object.keys(AND).map(async (key, i) => {
          const value = AND[key]

          const labels = await Promise.all(
            Object.keys(value).map(async (colKey, i) => {
              const colObj = columns.flat().find(col => col.id === colKey)
              const colLabel = colObj?.label
              const searchFormats = Sub.getSearchFormats({col: colObj}).map(format => {
                const {label: searchTypeLabel, searchType} = format
                return {
                  searchType,
                  colLabel,
                  searchTypeLabel,
                }
              })

              const values = await Promise.all(
                Object.values(value).map(async (searchMethodsObj: any) => {
                  return await Promise.all(
                    Object.entries(searchMethodsObj).map(async (arr: any) => {
                      const [searchType, searchedValue] = arr
                      let searchedValueforDisplay = arr[1]

                      if (colObj?.type === `date`) {
                        searchedValueforDisplay = formatDate(searchedValue)
                      } else if (judgeColType(colObj) === `selectId`) {
                        const model = String(colObj?.id)?.split(`Id`)[0] as PrismaModelNames

                        const {result: theOption} = await fetchUniversalAPI(model, `findUnique`, {where: {id: searchedValue}})
                        searchedValueforDisplay = <ColorBlock bgColor={theOption?.color ?? ``}>{theOption?.name}</ColorBlock>
                      } else {
                        searchedValueforDisplay = searchedValue
                      }

                      const theFormat = searchFormats.find(format => format.searchType === searchType)
                      return {
                        colLabel,
                        searchTypeLabel: theFormat?.searchTypeLabel,
                        searchedValue: searchedValueforDisplay,
                      }
                    })
                  )
                })
              )

              return values.flat()
            })
          )

          return labels.flat()
        })
      )

      const result = SearchedItems.flat()
      setSearchedItems(result)
    }
    init()
  }, [])

  return (
    <div>
      {query[searchQueryKey] && (
        <R_Stack>
          {SearchedItems.map((d, i) => {
            const {colLabel, searchTypeLabel, searchedValue} = d

            return (
              <div key={i}>
                <SearchedItem
                  {...{
                    onClick: () => {
                      return
                    },
                    value: (
                      <R_Stack className={`gap-0 `}>
                        <div className={`font-bold`}>{colLabel}</div>
                        <small>が</small>
                        <div className={`font-bold`}>{searchedValue}</div>
                        <div className={`font-bold`}>{searchTypeLabel}</div>
                      </R_Stack>
                    ),
                  }}
                />
              </div>
            )
          })}
        </R_Stack>
      )}
    </div>
  )
}
