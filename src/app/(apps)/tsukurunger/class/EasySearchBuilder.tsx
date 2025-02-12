'use server'

import { materialTypes} from '@app/(apps)/tsukurunger/class/constants'

import {
  EasySearchObject,
  EasySearchObjectExclusiveGroup,
  easySearchType,
  Ex_exclusive0,
  makeEasySearchGroups,
  makeEasySearchGroupsProp,
  toRowGroup,
} from '@cm/class/builders/QueryBuilderVariables'
import {Prisma} from '@prisma/client'

export const EasySearchBuilder = async () => {
  const user = async (props: easySearchType) => {
    'use server'
    type exclusiveKeyStrings = 'admin' | 'subcon' | 'normal'
    type CONDITION_TYPE = Prisma.UserWhereInput
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings, CONDITION_TYPE>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {enginerringProcesses} = easySearchExtraProps ?? {}

    type keys = {
      [key in exclusiveKeyStrings]: EasySearchObject
    }

    const isShitauke = {UserRole: {some: {RoleMaster: {name: '下請'}}}}
    const isAdmin = {UserRole: {some: {RoleMaster: {name: '管理者'}}}}

    const Ex_exclusive1: exclusiveGroups = {
      normal: {label: '管理者', CONDITION: isAdmin},
      subcon: {label: '外注', CONDITION: isShitauke},
      admin: {
        label: '一般',
        CONDITION: {
          NOT: {OR: [isAdmin, isShitauke]},
        },
      },
    }

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [
      {exclusiveGroup: Ex_exclusive0, name: `全て`, additionalProps: {refresh: true}},
      {exclusiveGroup: Ex_exclusive1, name: `権限別`, additionalProps: {refresh: true}},
    ])

    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }

  const tsMaterial = async (props: easySearchType) => {
    'use server'
    type exclusiveKeyStrings = 'reset' | any
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {enginerringProcesses} = easySearchExtraProps ?? {}

    type keys = {
      [key in exclusiveKeyStrings]: EasySearchObject
    }

    const Ex_materialType = Object.fromEntries(
      materialTypes.map(materialTypeStr => {
        const value = {
          label: materialTypeStr,
          CONDITION: {materialType: materialTypeStr},
        }

        return [materialTypeStr, value]
      })
    )

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [
      {exclusiveGroup: Ex_exclusive0, name: ``, additionalProps: {refresh: true}},
      {exclusiveGroup: Ex_materialType, name: `区分`},
    ])

    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }
  return {
    tsMaterial,
    user,
  }
}
