'use server'
import {
  EasySearchObject,
  EasySearchObjectExclusiveGroup,
  easySearchType,
  Ex_exclusive0,
  makeEasySearchGroups,
  makeEasySearchGroupsProp,
  toRowGroup,
} from '@cm/class/builders/QueryBuilderVariables'

export const EasySearchBuilder = async () => {
  const tmp = async (props: easySearchType) => {
    'use server'
    type exclusiveKeyStrings = 'reset'
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {enginerringProcesses} = easySearchExtraProps ?? {}

    type keys = {
      [key in exclusiveKeyStrings]: EasySearchObject
    }

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [{exclusiveGroup: Ex_exclusive0, name: ``, additionalProps: {refresh: true}}])
    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }
  return {
    tmp,
  }
}
