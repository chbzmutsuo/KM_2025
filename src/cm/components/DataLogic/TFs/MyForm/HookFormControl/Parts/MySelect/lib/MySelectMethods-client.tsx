import {DH} from 'src/cm/class/DH'
import {generarlFetchUniversalAPI} from '@lib/methods/api-fetcher'
import useSWR from 'swr'
import {anyObject, colType} from '@cm/types/types'

import {
  convertColIdToModelName,
  getSelectId,
} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/MySelectMethods-server'
import {Arr} from 'src/cm/class/Arr'
import {Days, formatDate} from 'src/cm/class/Days'

export const renewOptions = ({col, allOptions, setallOptionsState, newOptions}) => {
  if (setallOptionsState) {
    setallOptionsState(prev => {
      const selectId = getSelectId(col)
      const newAllOptions = {...allOptions}
      const optionsForThisSelectId = newAllOptions?.[selectId]
      const newUniqueOptions = Arr.uniqArray([...optionsForThisSelectId, ...(newOptions ?? [])])
      return {
        ...newAllOptions,
        [selectId]: newUniqueOptions,
      }
    })
  }
}

export const scaleUpWhereQueryForOptionSearch = ({where, select, searchNotationVersions}) => {
  const getAndQueryToSearchForOptions = ({where, OrQueryFromSearchedInput}) => {
    const AND: anyObject[] = []
    where ? AND.push(where) : '' //whereがあれば、それをANDに追加
    OrQueryFromSearchedInput.length > 0 ? AND.push({OR: OrQueryFromSearchedInput}) : '' //OrQueryFromSearchedInputがあれば、それをANDに追加
    return AND
  }

  //config.selectの中身を全部検索対象にする
  const OrQueryFromSearchedInput = getOrQueryFromSearchedInput({select, searchNotationVersions})

  //config.whereの中身を全部検索対象にする
  const AND = getAndQueryToSearchForOptions({where, OrQueryFromSearchedInput})

  return AND
}

/**ORを取得 */
export function getOrQueryFromSearchedInput({select, searchNotationVersions}) {
  const OR: anyObject[] = []

  if (select) {
    Object.keys(select).forEach(key => {
      if (key === `id`) return //idはテキスト型のため

      const dataType = DH.switchColType({type: select[key]})

      //全角、半角、大文字、文字などをORで繋ぐ
      searchNotationVersions.forEach(possibleInputNotation => {
        const {value} = possibleInputNotation
        let object: any = {[key]: {contains: value}}

        if (dataType === `number`) {
          const ToNumber = Number(value)
          object = {[key]: {equals: isNaN(ToNumber) ? 0 : ToNumber}}
        } else if (dataType === `date`) {
          if (Days.isDate(value)) {
            object = {[key]: {equals: formatDate(new Date(value), `iso`)}}
          } else {
            return
          }
        }

        OR.push(object)
      })
    })
  }

  return OR
}

// }

export const judgeOptionGetType = ({optionsOrOptionFetcher}) => {
  let type: 'array' | 'automatic' | 'custom' = 'automatic'
  if (Array.isArray(optionsOrOptionFetcher)) {
    type = 'array'
  } else if (optionsOrOptionFetcher) {
    type = 'custom'
  }
  return type
}

export const getRecord = (props: {col: colType; currentValue: any; options: any[]}) => {
  const {col, currentValue, options} = props
  let SWR_KEY = ''
  try {
    SWR_KEY = JSON.stringify({col, currentValue})
  } catch (error) {
    // console.error(error.stack) //////////
  }

  const {data, error} = useSWR(SWR_KEY, async () => {
    const OptionGetType = judgeOptionGetType({optionsOrOptionFetcher: col?.forSelect?.optionsOrOptionFetcher})

    let record
    if (currentValue === undefined) return ''

    if (OptionGetType == 'array') {
      record = options.find(obj => obj.id == currentValue) ?? {}
    } else {
      const modelName = convertColIdToModelName({col})
      const idIsNumber = !isNaN(Number(currentValue))
      if (idIsNumber) {
        const {result} = await generarlFetchUniversalAPI(modelName, 'findUnique', {
          where: {id: isNaN(Number(currentValue)) ? 0 : Number(currentValue)},
        })
        record = result
      }
    }

    return record
  })

  return data ?? ''
}
