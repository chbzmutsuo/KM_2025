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

import {getMidnight, toUtc} from '@class/Days'
import {addDays} from 'date-fns'

export const EasySearchBuilder = async () => {
  const sankoshaProcess = async (props: easySearchType) => {
    'use server'
    type exclusiveKeyStrings = 'reset' | '未検品' | '見積書未' | '発注書未' | '検品済' | '7日前' | '超過' | '完了' | '出荷完了'
    type exclusiveGroups = EasySearchObjectExclusiveGroup<exclusiveKeyStrings>
    const {session, query, dataModelName, easySearchExtraProps} = props
    const {enginerringProcesses} = easySearchExtraProps ?? {}

    const taskRemaining = {
      inspectionOk: {not: null},
      estimateIssueDate: {not: null},
      orderFormArrivalDate: {not: null},
    }

    const today = toUtc(getMidnight())

    const notFinished = {completionDate: null}
    const finished = {completionDate: {not: null}}
    const shipmentFinished = {shipmentCompletionDate: {not: null}}

    const overDeadLine = {AND: [{...notFinished}, {plannedDeliveryDate: {lt: today}}, {plannedDeliveryDate: {not: null}}]}

    const daysBefore7 = {
      AND: [
        {...notFinished},

        {
          plannedDeliveryDate: {
            not: null,
            gt: addDays(today, 1).toISOString(),
            lt: addDays(today, 7).toISOString(),
          },
        },
      ],
    }

    const estimateClear = {
      AND: [{estimateIssueDate: null}, {OR: [{estimateIssueDateIsEmpty: null}, {estimateIssueDateIsEmpty: false}]}],
    }
    const orderClear = {
      AND: [{orderFormArrivalDate: null}, {OR: [{orderFormArrivalDateisEmpty: null}, {orderFormArrivalDateisEmpty: false}]}],
    }
    const exclusive1: exclusiveGroups = {
      未検品: {
        label: '未検品',
        notify: true,
        CONDITION: {inspectionOk: null},
      },
      見積書未: {
        label: '見積書未',
        notify: true,
        description: '見積書発行日が未設定のもの',
        CONDITION: estimateClear,
      },
      発注書未: {
        label: '発注書未',
        notify: true,
        description: '発注書到着日が未設定のもの',
        CONDITION: orderClear,
      },

      検品済: {
        label: '検品済',
        notify: true,
        description: '検品済のもの',
        CONDITION: {inspectionOk: {not: null}},
      },
      '7日前': {
        label: '7日前',
        notify: true,
        description: '予定納期が7日前のもの',
        CONDITION: daysBefore7,
      },
      超過: {
        label: '超過',
        notify: true,
        description: '予定納期が過ぎているもの',
        CONDITION: {
          AND: [
            {
              ...overDeadLine,
              completionDate: null,
              shipmentCompletionDate: null,
            },
          ],
        },
      },

      完了: {
        label: '洗浄完了',
        notify: true,
        CONDITION: {
          AND: [{...finished}, {shipmentCompletionDate: null}],
        },
        description: '検品 / 見積書 / 発注書の全てをクリアし、かつ、完了日が入力されているもの',
      },
      出荷完了: {
        label: '出荷完了',
        notify: true,
        CONDITION: {...shipmentFinished},
        description: '検品 / 見積書 / 発注書の全てをクリアし、かつ、出荷完了日が入力されているもの',
      },
    }

    const keyValuedExclusive1 = {}

    Object.keys(exclusive1).forEach(key => {
      const globalKey = `g_${key}`
      const content = exclusive1[key]
      keyValuedExclusive1[globalKey] = content
    })

    const dataArr: makeEasySearchGroupsProp[] = []
    toRowGroup(1, dataArr, [
      {exclusiveGroup: Ex_exclusive0, name: ``, additionalProps: {refresh: true}},
      {exclusiveGroup: keyValuedExclusive1, name: `ステータス`},
    ])
    type keys = {
      [key in exclusiveKeyStrings]: EasySearchObject
    }

    const result = makeEasySearchGroups(dataArr) as keys

    return result
  }
  return {
    sankoshaProcess,
  }
}
