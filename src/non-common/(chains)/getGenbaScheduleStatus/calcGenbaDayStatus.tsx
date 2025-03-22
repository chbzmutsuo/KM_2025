'use server'
import {GetNinkuList} from 'src/non-common/(chains)/getGenbaScheduleStatus/getNinkuList'
import prisma from '@lib/prisma'
import {GenbaDayProps} from 'src/non-common/(chains)/getGenbaScheduleStatus/genbaDayUpdateChain'

import {getAllAssignedNinkuTillThisDay} from 'src/non-common/(chains)/getGenbaScheduleStatus/getAllAssignedNinkuTillThisDay'
import {getGenbaScheduleStatus} from 'src/non-common/(chains)/getGenbaScheduleStatus/getGenbaScheduleStatus'
export const calcGenbaDayStatus = async ({genbaId}) => {
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

  const calculatedGenbaDayList = allGenbaDay.map(GenbaDay => {
    const {allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled} = getAllAssignedNinkuTillThisDay({GenbaDay})
    return {...GenbaDay, allAssignedNinkuTillThisDay, allRequiredNinku, ninkuFullfilled}
  })

  const fullfilledGenbaDayList = calculatedGenbaDayList.filter(GD => {
    const hitByFullfilled = GD.ninkuFullfilled
    const hitByAllRequiredNinku = GD.allRequiredNinku > 0

    return hitByFullfilled && hitByAllRequiredNinku
  })

  return calculatedGenbaDayList.map(GenbaDay => {
    //最後に人工が埋まった日を取得
    const {status} = getGenbaScheduleStatus({GenbaDay: GenbaDay as GenbaDayProps})

    const lastFullfilledGenbaDay = fullfilledGenbaDayList.find(GD => {
      const tasks = GenbaDay.GenbaDayTaskMidTable.map(d => d.GenbaTask.name)
      const allTasksMatch = GD.GenbaDayTaskMidTable.every(mid => {
        const match = GenbaDay.GenbaDayTaskMidTable.some(item => {
          return item.genbaTaskId === mid.genbaTaskId
        })
        return match
      })

      return allTasksMatch
    })

    const isBeforeOrEqualToLastFullfilledDay =
      lastFullfilledGenbaDay && GenbaDay.date.getTime() <= lastFullfilledGenbaDay.date.getTime()

    const {ninkuList, result} = GetNinkuList({
      GenbaDay,
      theDay: GenbaDay.date,
      GenbaDayTaskMidTable: GenbaDay.GenbaDayTaskMidTable,
    })

    const isAllNinkuFullfilled = GenbaDay.GenbaDayTaskMidTable.every(d => {
      const assinCount: number = result[d.GenbaTask.name ?? '']
      const requiredNinku: number = d.GenbaTask.requiredNinku ?? 0
      if (assinCount) {
        return assinCount >= requiredNinku
      }
      return false
    })

    const afterLastFullfilledDay = !isBeforeOrEqualToLastFullfilledDay

    let active
    if (afterLastFullfilledDay) {
      if (isAllNinkuFullfilled) {
        active = false
      } else {
        active = true
      }
    } else {
      !lastFullfilledGenbaDay
    }

    const isLastFullfilledDay = lastFullfilledGenbaDay?.id === GenbaDay.id

    return {
      ...GenbaDay,
      isLastFullfilledDay,
      status,
      active,
    }
  })
}
