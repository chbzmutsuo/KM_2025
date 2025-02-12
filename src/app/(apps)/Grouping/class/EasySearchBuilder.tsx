'use server'
import {
  EasySearchObjectExclusiveGroup,
  easySearchType,
  Ex_exclusive0,
  makeEasySearchGroups,
  makeEasySearchGroupsProp,
} from '@cm/class/builders/QueryBuilderVariables'

export const EasySearchBuilder = async () => {
  const tmp = async (props: easySearchType) => {
    'use server'
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {enginerringProcesses} = easySearchExtraProps ?? {}
    const exclusive1: EasySearchObjectExclusiveGroup = {}

    const keyValuedExclusive1 = {}

    Object.keys(exclusive1).forEach(key => {
      const globalKey = `g_${key}`
      const content = exclusive1[key]
      keyValuedExclusive1[globalKey] = content
    })

    const dataArr: makeEasySearchGroupsProp[] = [
      {exclusiveGroup: Ex_exclusive0, name: ``, additionalProps: {refresh: true}},
      {exclusiveGroup: keyValuedExclusive1, name: `ステータス`},
    ]

    const result = makeEasySearchGroups(dataArr)

    return result
  }
  return {
    tmp,
  }
}
