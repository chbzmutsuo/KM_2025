// JoinedQueryインスタンスの型を取得
export type JoinedQueryInstanceType = InstanceType<typeof JoinedQuery>

import {anyObject} from '@cm/types/types'

export type JoinedQueryConstructorType = {
  query: anyObject
  queryKey: string
  modelDataArr: ({id: any} & anyObject)[]
  uniqueKeyOnModel: string
  type: `add` | `switch`
}

export class JoinedQuery {
  private query: anyObject
  private queryKey: string
  private modelDataArr: ({id: any} & anyObject)[]
  private uniqueKeyOnModel: string
  type?: string

  constructor(props: JoinedQueryConstructorType) {
    const {query, queryKey, modelDataArr, uniqueKeyOnModel, type} = props

    this.query = query
    this.queryKey = queryKey
    this.modelDataArr = modelDataArr
    this.uniqueKeyOnModel = uniqueKeyOnModel
    this.type = type
  }

  private sort = array => array.sort((a, b) => String(a).localeCompare(String(b)))
  extract = () => {
    const array = () => {
      const all = this.modelDataArr.map(d => {
        return String(d?.[this.uniqueKeyOnModel])
      })

      const current = this.query[this.queryKey] ? String(this.query[this.queryKey] ?? '')?.split(',') : []

      return {
        all: this.sort(all),
        current: this.sort(current),
      }
    }

    const string = () => {
      return {
        all: array().all.join(','),
        current: array().current.join(','),
      }
    }

    return {
      array,
      string,
    }
  }

  checkIsActive = ({modelData}) => {
    const current = this.extract().array().current

    const isActive = current.includes(String(modelData[this.uniqueKeyOnModel]))
    return isActive
  }

  buildQueryStr = ({modelData}) => {
    const swtichQuery = () => {
      const current = this.extract().array().current
      const ID = modelData[this.uniqueKeyOnModel]

      const isActive = this.checkIsActive({modelData})

      return isActive ? `` : ID
    }

    const addToQuery = () => {
      const current = this.extract().array().current
      const ID = modelData[this.uniqueKeyOnModel]

      const isActive = this.checkIsActive({modelData})

      const newQueryUserIdArr: string[] = isActive ? current.filter(id => String(id) !== String(ID)) : [...current, String(ID)]

      const toQueryStr = this.sort(newQueryUserIdArr).join(',')
      return toQueryStr
    }

    return this.type === `add` ? addToQuery() : swtichQuery()
  }
}
