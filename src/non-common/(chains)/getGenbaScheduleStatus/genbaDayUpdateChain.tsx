'use server'

import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import prisma from '@lib/prisma'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {getAllAssignedNinkuTillThisDay} from 'src/non-common/(chains)/getGenbaScheduleStatus/getAllAssignedNinkuTillThisDay'
import {getGenbaScheduleStatus} from 'src/non-common/(chains)/getGenbaScheduleStatus/getGenbaScheduleStatus'

export type genbaStatusType = '完了' | '不要' | '済' | '未完了'

export type GenbaDayProps = {
  id: any
  Genba: {
    GenbaDay: Array<{
      GenbaDayTaskMidTable: Array<{genbaTaskId: number}>
      finished: boolean
      date: Date
    }>
  }
  status: genbaStatusType
  GenbaDayTaskMidTable: Array<{genbaTaskId: number}>
  date: Date
  finished: boolean
}
export type groupByTaskType = {[key: string]: ({taskName: string} & GenbaDayProps)[]}

export const genbaDayUpdateChain = async ({genbaId}) => {
  const allGenbaDay = await calcGenbaDayStatus({genbaId})

  const groupByTask = allGenbaDay.reduce((acc, curr) => {
    curr.GenbaDayTaskMidTable.forEach(mid => {
      const taskName = mid.GenbaTask.name
      const taskId = [mid.genbaTaskId, taskName].join(`_`)
      if (!acc[taskId]) {
        acc[taskId] = []
      }

      acc[taskId].push({taskName, ...curr})
    })
    return acc
  }, {})

  const transactionQueryList: transactionQuery[] = []

  // タスクごとにループ
  Object.keys(groupByTask).forEach(taskId => {
    const genbaDays = groupByTask[taskId]

    genbaDays.forEach(GenbaDay => {
      const {isLastFullfilledDay, status, active, ninkuFullfilled, allAssignedNinkuTillThisDay, allRequiredNinku} = GenbaDay

      transactionQueryList.push({
        model: `genbaDay`,
        method: `update`,
        queryObject: {
          where: {id: GenbaDay.id},
          data: {
            isLastFullfilledDay: isLastFullfilledDay,
            status,
            active,
            ninkuFullfilled,
            allAssignedNinkuTillThisDay,
            allRequiredNinku,
          },
        },
      })
    })
  })

  const res = await fetchTransactionAPI({transactionQueryList})
}

export const calcGenbaDayStatus = async ({genbaId}) => {
  let result: any[] = []
  const allGenbaDay = await prisma.genbaDay.findMany({
    where: {genbaId: genbaId},
    include: {
      Genba: {
        include: {
          GenbaDay: {
            include: {GenbaDayTaskMidTable: {}},
            orderBy: {date: 'asc'},
          },
          GenbaDayShift: {include: {GenbaDay: {include: {GenbaDayTaskMidTable: {}}}}},
        },
      },
      GenbaDayShift: {
        include: {GenbaDay: {}, User: {include: {SohkenCar: {}}}},
      },
      GenbaDaySoukenCar: {include: {SohkenCar: {}}},
      GenbaDayTaskMidTable: {include: {GenbaTask: {}}},
    },
    orderBy: {date: 'asc'},
  })

  console.debug(`${allGenbaDay.length}件のGenbaDayを更新します。`)

  result = allGenbaDay.map(GenbaDay => {
    const {allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled} = getAllAssignedNinkuTillThisDay({GenbaDay})
    return {...GenbaDay, allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled}
  })

  //最後に人工が埋まった日を取得
  const lastFullfilledGenbaDay = result.find(GenbaDay => {
    return GenbaDay.ninkuFullfilled
  })

  result = result.map(GenbaDay => {
    const {status} = getGenbaScheduleStatus({GenbaDay})
    const active = !lastFullfilledGenbaDay || GenbaDay.date.getTime() <= lastFullfilledGenbaDay.date.getTime()
    const isLastFullfilledDay = lastFullfilledGenbaDay?.id === GenbaDay.id

    return {
      ...GenbaDay,
      isLastFullfilledDay,
      status,
      active,
    }
  })

  return result

  const groupByTask: groupByTaskType = allGenbaDay.reduce((acc, curr) => {
    curr.GenbaDayTaskMidTable.forEach(mid => {
      const taskName = mid.GenbaTask.name
      const taskId = [mid.genbaTaskId, taskName].join(`_`)
      if (!acc[taskId]) {
        acc[taskId] = []
      }

      acc[taskId].push({taskName, ...curr})
    })
    return acc
  }, {})

  const transactionQueryList: transactionQuery[] = []

  // タスクごとにループ
  Object.keys(groupByTask).map(taskId => {
    // 日付ごとにソート, 人工が埋まった日を取得
    const genbaDays = groupByTask[taskId]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(GenbaDay => {
        const {allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled} = getAllAssignedNinkuTillThisDay({GenbaDay})
        return {...GenbaDay, allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled}
      })
    console.debug({taskId})

    //最後に人工が埋まった日を取得
    const lastFullfilledGenbaDay = genbaDays.find(GenbaDay => {
      return GenbaDay.ninkuFullfilled
    })

    //ステータスを付与し、データを更新
    const result = genbaDays
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(GenbaDay => {
        const {status} = getGenbaScheduleStatus({GenbaDay})
        const {taskName, allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled, ...genbaDay} = GenbaDay

        const active = !lastFullfilledGenbaDay || genbaDay.date.getTime() <= lastFullfilledGenbaDay.date.getTime()

        console.debug(GenbaDay.date, {
          finished: GenbaDay.finished,
          active: active ? 'アクティブ' : '',
          status,
        })

        const isLastFullfilledDay = lastFullfilledGenbaDay?.id === GenbaDay.id

        return {
          isLastFullfilledDay,
          status,
          active,
          ninkuFullfilled,
          allAssignedNinkuTillThisDay,
          allRequiredNinku,
        }
      })
    return result
  })
}
