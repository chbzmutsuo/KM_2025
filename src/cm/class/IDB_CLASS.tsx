import {anyObject} from '@cm/types/types'
import {set, get, getMany, keys, update} from 'idb-keyval'

import {v4 as uuidv4} from 'uuid'

export type IDB_Single_Item = {
  id?: string | number
  updatedAt?: Date
} & anyObject

export type IDB_Model_Key = string | 'lightMaster'

export class IDB_CLASS {
  static single = {
    deleteById: async (key: IDB_Model_Key, id: string, setdatabase: any) => {
      const currentArray = await IDB_CLASS.array.read(key)
      const filteredArray = currentArray.filter(item => item.id !== id)
      // await IDB_CLASS.updateIDB(key, () => filteredArray)
      // setdatabase(prev => ({...prev, [key]: filteredArray}))
    },
  }
  static array = {
    save: async (key: IDB_Model_Key, data: IDB_Single_Item) => {
      const result = await set(key, data)
    },

    read: async (key: IDB_Model_Key) => {
      return await get(key)
    },

    //data は id が必須。idをもとに配列のindexを取得し、それを更新または新規追加する
    upsertItemInArray: async ({key, data, setdatabase}: {key: IDB_Model_Key; data: IDB_Single_Item; setdatabase: any}) => {
      const refreshedDataArr = await IDB_CLASS.updateIDB(key, old => {
        const theIndex = old.findIndex(item => item.id === data.id)
        const newObj = {...data, id: old[theIndex]?.id ?? data.id ?? uuidv4()}
        newObj.updatedAt = new Date() //ローカルでの更新がわかるように

        theIndex !== -1 ? (old[theIndex] = newObj) : old.push(newObj)

        return old
      })
      setdatabase(prev => ({...prev, [key]: refreshedDataArr}))
    },
  }

  static async getIDB_Keys() {
    try {
      return await keys()
    } catch (err) {
      console.error('Error reading from IndexedDB', err)
      return null
    }
  }

  static async getManyFromIDB(keys: IDB_Model_Key[]) {
    return await getMany(keys)
  }

  static async updateIDB(key: IDB_Model_Key, validator: any) {
    try {
      await update(key, validator)
      const refreshedData = await IDB_CLASS.array.read(key)
      return refreshedData
    } catch (err) {
      console.error('Error reading from IndexedDB', err)
      return null
    }
  }
}
