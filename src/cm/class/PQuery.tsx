import {SearchQuery} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/SearchHandler/search-methods'

import {getRelationalModels} from 'src/cm/lib/methods/prisma-schema'
import {additionalPropsType, anyObject, MyTableType} from '@cm/types/types'

import {DH} from './DH'
export const defaultOrderByArray: any[] = [
  //
  {sortOrder: 'asc'},
  {id: `asc`},
]

export class P_Query {
  /**whereに関連するクエリキーを生成する */
  static create_where_colId_searchType_dataType_key = (col, modelName: string, searchType: string) => {
    const colId = col.id

    const convertedDataType = DH.switchColType({type: col.type})

    return `where-${modelName}-${colId}-${searchType}-${convertedDataType}`
  }

  /**whereに関連するクエリを取得する */
  static getwhereRelatedQueries = (query, dataModelName) => {
    let whereRelatedQueries = Object.keys(query)
      .filter(key => {
        return key.includes('where-') && key.includes(dataModelName)
      })
      .map(key => {
        const [_, dataModelName, colId, searchType, dataType] = key.split('-')
        return {
          dataModelName,
          colId,
          searchType,
          value: query[key],
          dataType,
        }
      })
    // 常にid検索に対応できるようにしておく

    if (query?.[`where-${dataModelName}-${'id'}-${'equals'}-${'number'}`]) {
      whereRelatedQueries = [
        ...whereRelatedQueries,
        {
          dataModelName,
          colId: 'id',
          searchType: 'equals',
          value: query?.[`where-${dataModelName}-${'id'}-${'equals'}-${'number'}`],
          dataType: 'number',
        },
      ]
    }

    return whereRelatedQueries
  }

  static getPaginationPropsByQuery = ({query, tableId = '', countPerPage}) => {
    countPerPage = countPerPage ?? 20

    const page = Number(query?.[`${tableId}_P`] ?? 1)
    const take = Number(query?.[`${tableId}_T`] ?? countPerPage)
    const skip = Number(query?.[`${tableId}_S`] ?? 0)
    return {take, skip, page, countPerPage}
  }

  /**個別サーチとesaysearchを組み合わせたやつ */
  static createFlexQuery = (props: {
    tableId?: string
    query: anyObject
    dataModelName: string
    additional?: additionalPropsType
    myTable?: MyTableType
    take: number
    skip: number
    page: number
  }) => {
    const {tableId = '', dataModelName, additional, take, skip, page} = props
    let query = props?.query
    query = {...query, ...additional?.where}

    const AND: any = SearchQuery.createWhere({dataModelName, query: query})

    Object.keys(additional?.where ?? {}).forEach(key => {
      AND.push({[key]: additional?.where?.[key]})
    })

    const orderBy = [
      //
      ...(additional?.orderBy ?? []),
      ...defaultOrderByArray,
    ]
    if (query?.orderBy) {
      orderBy.splice(0, 0, {
        [query.orderBy]: {
          sort: query.orderDirection,
          nulls: `last`,
        },
      })
    }

    const from = (page - 1) * take + 1

    return {AND, orderBy, page, take, skip, from}
  }

  static setDefaultOrderByInIncludeObject(includeObject: any) {
    let count = 0
    const include = {...includeObject}
    /**デフォルトのorderByを決める */
    Object.keys(include).forEach(key => {
      const firstModel = include[key]

      setDefaultOrderBy(firstModel)

      function setDefaultOrderBy(targetModel) {
        count++

        for (const key in targetModel) {
          const value = targetModel[key]
          const isNorOrderProp = value?.['noOrder']

          if (value['noOrder']) {
            delete value['noOrder']
          }

          if (value['orderBy'] === undefined && !isNorOrderProp) {
            value['orderBy'] = {sortOrder: 'asc'}
          }

          // if (value?.["include"]) {
          setDefaultOrderBy(value['include'])
          // }
        }
      }
    })

    return include
  }

  static roopMakeRelationalInclude({parentName, parentObj, schemaAsObj, SORT}) {
    const {singleAttributeObj, hasManyAttributeObj, hasOneAttributeObj} = getRelationalModels({
      schemaAsObj,
      parentName,
    })

    const relationalObj = {...hasManyAttributeObj, ...hasOneAttributeObj}
    const hasInclude = parentObj.include
    if (hasInclude) {
      Object.keys(parentObj.include).forEach(key => {
        if (relationalObj[key]?.relationalType === 'hasMany') {
          if (parentObj.include[key].orderBy === undefined) {
            parentObj.include[key] = {...parentObj.include[key], ...SORT}
            P_Query.roopMakeRelationalInclude({
              parentName: key,
              parentObj: parentObj.include[key],
              schemaAsObj,
              SORT,
            })
          }
        }
      })
    }
    return parentObj
  }
  static searchTypeAndLabelMaster = {
    contains: {label: 'を含む'},
    equals: {label: 'と一致'},
    gte: {label: '以上'},
    lte: {label: '以下'},
  }
}
