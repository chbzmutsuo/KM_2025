import {DH} from 'src/cm/class/DH'

export class Arr {
  static SplitInto_N_Group = (arr: any[], n) => {
    const result: any[] = []
    const originArr = [...arr]
    for (let i = 0; i < originArr.length; i += n) {
      result.push(originArr.slice(i, i + n))
    }
    return result
  }
  static uniqArray(array) {
    const knownElements = new Set()
    for (const elem of array) {
      knownElements.add(elem) // 同じ値を何度追加しても問題ない
    }
    return Array.from(knownElements) as any
  }

  /**オブジェクト配列のソート */
  static sortByKey(array: any[], key = 'sortOrder', order = 'asc') {
    return array.sort((x, y) => {
      const xValue = x?.[key] ?? x
      const yValue = y?.[key] ?? y

      // xValue / yValueともに数値の時
      if (!isNaN(Number(xValue)) && !isNaN(Number(yValue))) {
        if (order === 'asc') {
          return Number(xValue) - Number(yValue)
        } else {
          return Number(yValue) - Number(xValue)
        }
      } else {
        //文字列の時はlocaleCompareを使う
        if (order === 'asc') {
          return String(xValue).localeCompare(String(yValue))
        }
        return String(yValue).localeCompare(String(xValue))
      }
    })
  }
  static randomSort = array => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  static getTwoDimentionalArray = (timeSlotsArr, sectionCount) => {
    const timeSections: number[][] = []
    const timesSplitCount = sectionCount
    for (let i = 0; i < timeSlotsArr.length; i += timesSplitCount) {
      timeSections.push(timeSlotsArr.slice(i, i + timesSplitCount))
    }
    return timeSections
  }

  /**新規、更新、削除の配列を作成 */
  static createUpdateDelete(oldArr, latestArr) {
    const createArr: any[] = []
    const updateArr: any[] = []
    const deleteArr: any[] = []

    latestArr?.forEach(obj => {
      const {id} = obj
      const foundAsNew = !oldArr?.find(obj => obj.id === id)
      if (foundAsNew) {
        createArr.push(obj)
      }
    })

    oldArr?.forEach(obj => {
      const {id} = obj
      const exist = latestArr?.find(obj => obj.id === id) //最新データにある場合
      if (exist) {
        updateArr.push(exist)
      } else {
        deleteArr.push(obj)
      }
    })
    return {createArr, updateArr, deleteArr}
  }

  static transpose(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
  }

  static addOrRemoveitem(oldArray, itemToAddOrRemove) {
    const array = [...oldArray]
    // find the index of the item in the array, if it exists
    const index = array.findIndex(item => item.id === itemToAddOrRemove.id)

    if (index === -1) {
      array.push(itemToAddOrRemove)
    }
    // otherwise, remove it
    else {
      array.splice(index, 1)
    }

    return array
  }

  // static customSort(array, keys) {
  //   return [...array].sort((a, b) => {
  //     for (const item of keys) {
  //       let key, priority

  //       if (typeof item === 'string') {
  //         key = item
  //       } else if (typeof item === 'object') {
  //         key = item.key
  //         priority = item.priority ?? []
  //       } else {
  //         throw new Error(`Invalid key format: "${item}"`)
  //       }

  //       const aValue = a[key]
  //       const bValue = b[key]

  //       if (aValue === undefined || aValue === null || aValue === '') {
  //         if (bValue !== undefined && bValue !== null && bValue !== '') return 1
  //         continue
  //       }
  //       if (bValue === undefined || bValue === null || bValue === '') return -1

  //       if (priority) {
  //         const aIndex = priority.findIndex(p => String(aValue).match(p))
  //         const bIndex = priority.findIndex(p => String(bValue).match(p))

  //         if (aIndex !== -1 || bIndex !== -1) {
  //           if (aIndex === -1) return 1
  //           if (bIndex === -1) return -1

  //           return aIndex - bIndex
  //         }
  //       }

  //       if (typeof aValue === 'number' && typeof bValue === 'number') {
  //         if (aValue !== bValue) return aValue - bValue
  //       } else if (aValue instanceof Date && bValue instanceof Date) {
  //         if (aValue.getTime() !== bValue.getTime()) return aValue.getTime() - bValue.getTime()
  //       } else if (typeof aValue === 'string' && typeof bValue === 'string') {
  //         const compareResult = aValue.localeCompare(bValue)
  //         if (compareResult !== 0) return compareResult
  //       } else {
  //         throw new Error(`Unsupported data type for key "${key}"`)
  //       }
  //     }
  //     return 0 // If all keys are the same or undefined
  //   })
  // }
  static customSort(array, keys) {
    //グルーピングロジック
    const sortByKey = ({array, item}) => {
      const grouped = {}
      const nullGruuped = {}

      const key = typeof item === `object` ? item.key : item
      array.forEach(data => {
        const groupKey = data[key]

        if (groupKey) {
          DH.makeObjectOriginIfUndefined(grouped, groupKey, [])
          grouped[groupKey].push(data)
        } else {
          DH.makeObjectOriginIfUndefined(nullGruuped, groupKey, [])
          nullGruuped[groupKey].push(data)
        }
      })

      const result = Object.assign(grouped, nullGruuped)

      return result
    }

    // 配列をgroupごとにまとめ上げていく
    const recursiveSortByKey = (currentArray, currentKeys, index = 0) => {
      if (index >= currentKeys.length) return currentArray
      const result = sortByKey({array: currentArray, item: currentKeys[index]})
      Object.keys(result).forEach(key => {
        result[key] = recursiveSortByKey(result[key], currentKeys, index + 1)
      })

      return result
    }

    const nestedGroupObject = recursiveSortByKey(array, keys)

    const data: any[] = []
    const recursiveFlatten = (groupedObject, currentKeys, index = 0) => {
      if (index >= currentKeys.length) {
        data.push(...groupedObject)
        return
      }

      Object.keys(groupedObject).forEach(key => {
        recursiveFlatten(groupedObject[key], currentKeys, index + 1)
      })
    }

    recursiveFlatten(nestedGroupObject, keys)

    const checkData = data.map(row => {
      const {floor, buildingName, constructionNumber, group} = row
      return {
        buildingName,
        floor,
        constructionNumber,
        group: row.group,
      }
    })

    return data
  }
  static findCommonValues = (arr1: any[], arr2: any[]) => {
    const commonValues: any[] = []
    arr1.forEach(value1 => {
      arr2.forEach(value2 => {
        if (value1 === value2) {
          commonValues.push(value1)
        }
      })
    })
    if (commonValues.length > 0) {
      return commonValues
    } else {
      return null
    }
  }

  static filterAndSplice(sourceArr, filterFunc) {
    const resultArr: any[] = []
    const splicedArr = sourceArr.reduce((acc, record) => {
      filterFunc(record) ? resultArr.push(record) : acc.push(record)
      return acc
    }, [])

    return {splicedArr, resultArr}
  }
}
