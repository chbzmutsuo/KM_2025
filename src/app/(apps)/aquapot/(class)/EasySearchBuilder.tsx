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
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

export const EasySearchBuilder = async () => {
  const aqSaleRecord = async (props: easySearchType) => {
    'use server'

    type exclusiveKeyStrings = 'foo' | `support`
    type CONDITION_TYPE = Prisma.AqSaleRecordWhereInput
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings, CONDITION_TYPE>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {whereQuery} = easySearchExtraProps ?? {}

    type keys = {
      [key in string]: EasySearchObject
    }

    const {result: AqSupportGroupMaster} = await fetchUniversalAPI(`aqSupportGroupMaster`, `findMany`, {})

    const Ex_test: exclusiveGroups = {
      foo: {
        label: ``,
        CONDITION: {},
      },
    }
    const Ex_SupportOrganization: exclusiveGroups = Object.fromEntries(
      AqSupportGroupMaster.map(org => {
        const key = `support-${org.id}`

        // const periodWhere=
        const value = {
          label: org.name,
          CONDITION: {
            AqCustomer: {
              AqCustomerSupportGroupMidTable: {
                some: {
                  // from: whereQuery.gte,
                  // to: whereQuery.lt,
                },
              },
            },
          } as CONDITION_TYPE,
        }

        return [key, value]
      })
    )

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [
      //
      {exclusiveGroup: Ex_exclusive0, name: `全て`, additionalProps: {refresh: true}},
      {exclusiveGroup: Ex_SupportOrganization, name: `支援団体別`, additionalProps: {refresh: true}},
    ])
    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }
  const aqCustomer = async (props: easySearchType) => {
    'use server'

    type exclusiveKeyStrings = 'normal' | 'fromBase'
    type CONDITION_TYPE = Prisma.AqCustomerWhereInput
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings, CONDITION_TYPE>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {whereQuery} = easySearchExtraProps ?? {}

    type keys = {
      [key in string]: EasySearchObject
    }

    const Ex_SupportOrganization: exclusiveGroups = {
      normal: {label: `通常`, CONDITION: {fromBase: false}},
      fromBase: {label: `BASEから`, CONDITION: {fromBase: true}},
    }

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [
      //
      {exclusiveGroup: Ex_exclusive0, name: `全て`, additionalProps: {refresh: true}},
      {exclusiveGroup: Ex_SupportOrganization, name: `区分`, additionalProps: {refresh: true}},
    ])
    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }
  return {
    aqSaleRecord,
    aqCustomer,
  }
}
