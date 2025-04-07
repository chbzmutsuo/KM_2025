export class OB {
  static filter = <T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> => {
    const filteredObject = {} as Pick<T, K>
    Object.keys(object).forEach(key => {
      if (keys.includes(key as K)) {
        filteredObject[key as K] = object[key] as any
      }
    })

    return filteredObject as any
  }

  static toArray = object => {
    return Object.keys(object).map(key => {
      return {
        key,
        ...object[key],
      }
    })
  }

  // static foo = (sourceObj, newKeyVal) => {
  //   Object.keys(newKeyVal).forEach(key => {
  //     const newValue = newKeyVal[key]
  //     const oldValue = sourceObj?.[key]

  //     const valueIsObject = typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)
  //     const oldValueIsObject = typeof oldValue === 'object' && oldValue !== null && !Array.isArray(oldValue)

  //     if (valueIsObject && oldValueIsObject) {
  //       // 条件が変更されました
  //       this.foo(newValue, oldValue) // 再帰的にマージします
  //       newKeyVal[key] = {...oldValue, ...newValue} // マージ結果を保存します
  //     } else {
  //       newKeyVal[key] = newValue // 新しい値を設定します
  //     }
  //   })
  // }
}
