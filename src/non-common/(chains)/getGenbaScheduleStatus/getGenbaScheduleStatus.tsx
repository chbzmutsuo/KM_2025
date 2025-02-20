'use server'

import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import prisma from '@lib/prisma'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'

type genbaStatusType = '完了' | '不要' | '済' | '未完了'
type GenbaDayProps = {
  id: any
  Genba: {
    GenbaDay: Array<{
      GenbaDayTaskMidTable: Array<{genbaTaskId: number}>
      finished: boolean
      date: Date
    }>
  }
  GenbaDayTaskMidTable: Array<{genbaTaskId: number}>
  date: Date
  finished: boolean
}

const getGenbaScheduleStatus = (props: {GenbaDay: GenbaDayProps}) => {
  const allScheduleListOnGenba = props.GenbaDay.Genba.GenbaDay.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  let vanished = false
  let doneInFuture = false
  props.GenbaDay.GenbaDayTaskMidTable.every(mid => {
    const sameTaskHasFinishedOnThisDay = allScheduleListOnGenba.find(d => {
      const hasSameTask = d.GenbaDayTaskMidTable.some(mid2 => {
        return mid2.genbaTaskId === mid.genbaTaskId
      })
      const finished = d.finished
      return hasSameTask && finished
    })

    const isBefore =
      sameTaskHasFinishedOnThisDay &&
      new Date(sameTaskHasFinishedOnThisDay.date).getTime() < new Date(props.GenbaDay.date).getTime()
    if (sameTaskHasFinishedOnThisDay) {
      if (isBefore) {
        vanished = true
      } else {
        doneInFuture = true
      }
    }
  })

  const status: genbaStatusType = props.GenbaDay.finished ? '完了' : vanished ? '不要' : doneInFuture ? '済' : '未完了'

  return {status}
}

const getAllAssignedNinkuTillThisDay = ({GenbaDay}) => {
  let allAssignedNinkuTillThisDay = 0
  GenbaDay.Genba.GenbaDayShift.forEach(shift => {
    const isBefore = new Date(shift.GenbaDay.date).getTime() <= new Date(GenbaDay.date).getTime()
    const forSameTask = shift.GenbaDay.GenbaDayTaskMidTable.some(mid => {
      return mid.genbaTaskId === GenbaDay.GenbaDayTaskMidTable.find(mid => mid.genbaTaskId === mid.genbaTaskId)?.genbaTaskId
    })

    if (isBefore && forSameTask) {
      allAssignedNinkuTillThisDay++
    }
  })

  const allRequiredNinku = GenbaDay.GenbaDayTaskMidTable.reduce((acc, curr) => acc + curr.GenbaTask.requiredNinku, 0)

  return {allAssignedNinkuTillThisDay, allRequiredNinku}
}

export const genbaDayUpdateChain = async ({genbaId}) => {
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
  })

  console.debug(`${allGenbaDay.length}件のGenbaDayを更新します。`)

  type groupByTaskType = {
    [key: string]: ({taskName: string} & GenbaDayProps)[]
  }

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
  Object.keys(groupByTask).forEach(taskId => {
    const genbaDays = groupByTask[taskId].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    console.debug(taskId)
    const lastFullfilledGenbaDay = genbaDays.find(GenbaDay => {
      const {allAssignedNinkuTillThisDay, allRequiredNinku} = getAllAssignedNinkuTillThisDay({GenbaDay})
      const ninkuFullfilled =
        allRequiredNinku !== null && allAssignedNinkuTillThisDay !== null && allRequiredNinku - allAssignedNinkuTillThisDay <= 0

      return ninkuFullfilled
    })

    genbaDays
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(GenbaDay => {
        const {status} = getGenbaScheduleStatus({GenbaDay})

        const {taskName, ...genbaDay} = GenbaDay
        const {allAssignedNinkuTillThisDay, allRequiredNinku} = getAllAssignedNinkuTillThisDay({GenbaDay})
        const ninkuFullfilled =
          allRequiredNinku !== null && allAssignedNinkuTillThisDay !== null && allRequiredNinku - allAssignedNinkuTillThisDay <= 0
        const active = !lastFullfilledGenbaDay || genbaDay.date.getTime() <= lastFullfilledGenbaDay.date.getTime()
        console.debug(GenbaDay.date, {
          active: active ? 'アクティブ' : '',
          status,
        })
        transactionQueryList.push({
          model: `genbaDay`,
          method: `update`,
          queryObject: {
            where: {id: GenbaDay.id},
            data: {status, active, ninkuFullfilled, allAssignedNinkuTillThisDay, allRequiredNinku},
          },
        })
      })
  })

  const res = await fetchTransactionAPI({transactionQueryList})
}
