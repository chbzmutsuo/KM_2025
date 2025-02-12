/* eslint-disable no-irregular-whitespace */
import {anyObject, colTypeStr} from '@cm/types/types'
import {Days, formatDate, formatDateTimeOrDate} from './Days'
import {shorten, superTrim} from '@lib/methods/common'
import JsonFormatter from 'react-json-formatter'
import BasicModal from '@components/utils/modal/BasicModal'
export type baseColTypes =
  | `password`
  | `json`
  | 'text'
  | 'number'
  | 'date'
  | `datetime`
  | 'boolean'
  | 'rating'
  | 'time'
  | 'color'
  | 'array'
type swtichColTypeProps = (props: {type: string | undefined}) => baseColTypes

export class DH {
  /**---Idをもとに入れ子構造から探索し、その子要素を取得する */
  /**オブジェクトデータの作成 */
  static makeObjectOriginIfUndefined(PARENT: anyObject, keyToInsert: string | number, valuesOfChildren: any) {
    if (PARENT[keyToInsert]) return
    if (PARENT[keyToInsert] === undefined) {
      PARENT[keyToInsert] = valuesOfChildren
    }
  }

  static switchColType: swtichColTypeProps = ({type}) => {
    const dataTypeMaster: {
      [key in baseColTypes]: colTypeStr[]
    } = {
      password: ['password'],
      json: [`json`],
      text: ['text', 'textarea', 'email', 'password', 'string'],
      number: ['float', 'number', 'price', 'selectId', 'int', `ratio`],
      date: ['date', 'month', `year`, 'datetime-local'],
      datetime: ['datetime'],
      boolean: ['boolean', 'confirm'],
      rating: ['rating', `rate`],
      time: ['time'],
      color: ['color'],
      array: ['array'],
    }

    const obj = Object.keys(dataTypeMaster).find(key => {
      return dataTypeMaster[key].includes(type)
    })

    const result = (obj ?? 'text') as baseColTypes

    return result
  }

  /**postgres用にデータ方の変換 */
  static convertDataType(value: unknown, type?: string, convertFor?: string) {
    if (type) {
      return convertDataWithExplicitType(value, type, convertFor)
    } else {
      return convertDataImplicityly(value)
    }

    function convertDataWithExplicitType(value, type, convertFor = 'server') {
      let toNumber

      if (value === undefined || value === null) {
        return value
      }

      const convertedType = DH.switchColType({type})

      switch (convertedType) {
        case 'number':
          if (!isNaN(Number(value))) {
            return value ? Number(value) : undefined
          }
          return

        case 'rating':
          toNumber = Number(value)
          value = !isNaN(toNumber) ? toNumber : undefined
          return value

        case 'date': {
          let result

          if (convertFor === 'client') {
            result = value ? formatDate(value) : null
          } else {
            result = value ? formatDate(value, 'iso') : null
          }

          return result
        }

        case 'datetime': {
          if (convertFor === `client`) {
            return value ? formatDateTimeOrDate(value) : null
          } else {
            return value ? new Date(formatDateTimeOrDate(value)) : null
          }
        }

        case 'time':
          return value

        case 'json':
          if (value) {
            const shortHand = shorten(superTrim(JSON.stringify(value)), 80)

            return (
              <BasicModal
                {...{
                  alertOnClose: false,
                  btnComponent: <div>{shortHand}</div>,
                }}
              >
                <div className={` max-h-[70vh] overflow-auto`}>
                  <JsonFormatter json={value} />
                </div>
              </BasicModal>
            )
          } else {
            return null
          }

        case 'text':
          return value ? String(value) : null

        case 'array': {
          return value ? String(value).split(` / `) : ['']
        }
        //booleanを返す
        case 'boolean':
          return ['', 0, '0', undefined, null, false, 'false'].includes(value) ? false : true

        default:
          return value?.toString() ?? null
      }
    }

    function convertDataImplicityly(value: unknown) {
      switch (value) {
        case '':
        case null:
        case undefined:
          return value

        default: {
          const toNumber = Number(value)
          const isNumber = !isNaN(toNumber)
          if (isNumber) {
            return toNumber
          } else {
            return value
          }
        }
      }
    }
  }

  static addPlusMinus(num) {
    let prefix = ''

    if (num > 0) {
      prefix = '+'
    }
    if (num < 0) {
      prefix = ''
    }

    return prefix + num
  }

  static startsWithCapital = key => /^[A-Z]+$/.test(key.slice(0, 1))

  static separateFormData({latestFormData, additionalPayload}) {
    Object.keys(additionalPayload ?? {}).forEach(key => {
      if (latestFormData[key]) {
        delete additionalPayload[key]
      }
    })

    const prismaDataObject = {...latestFormData, ...additionalPayload}

    const relationIdOrigin = {...prismaDataObject}
    const modelBasicDaraOrigin = {...prismaDataObject}

    // const relationalModelObject = {}
    Object.keys(modelBasicDaraOrigin).forEach(key => {
      const isNonDateObject =
        typeof modelBasicDaraOrigin[key] === 'object' &&
        !Days.isDate(modelBasicDaraOrigin[key]) &&
        modelBasicDaraOrigin[key] !== null

      const isRelationalId = key.includes('Id')

      const firstLetter = key.slice(0, 1)
      const startsWithCapital = /^[A-Z]+$/.test(key.slice(0, 1)) && isNaN(Number(firstLetter))

      if (isNonDateObject || isRelationalId || startsWithCapital) {
        /**リレーション先の削除 */
        delete modelBasicDaraOrigin[key]
      }
    })

    const relationIds = {}
    Object.keys(relationIdOrigin).forEach(key => {
      if (key.match(/.+Id/)) {
        relationIds[key] = relationIdOrigin[key]
      }
    })

    const {id, ...modelBasicData} = modelBasicDaraOrigin

    return {
      id,
      modelBasicData,
      relationIds,
    }
  }

  static mergeDateAndTime({date, time}) {
    if (!date || !time) {
      return undefined
    }
  }

  static clean(original: any) {
    const obj = {...original}
    const propNames = Object.getOwnPropertyNames(obj)
    for (let i = 0; i < propNames.length; i++) {
      const propName = propNames[i]
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        obj[propName] === `undefined` ||
        obj[propName] === `null`
      ) {
        delete obj[propName]
      }
    }
    return obj
  }

  static toPrice(value) {
    if (value) {
      value = DH.convertDataType(value, 'price').toLocaleString()
      return value
    } else {
      return value
    }
  }
  static capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || !str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  static lowerCaseFirstLetter(str) {
    if (typeof str !== 'string' || !str) return str
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
}
