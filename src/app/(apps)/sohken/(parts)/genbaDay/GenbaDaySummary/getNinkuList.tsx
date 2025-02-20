'use client'

import {formatDate} from '@class/Days'

import {GenbaDayTaskMidTable, GenbaTask} from '@prisma/client'

import {DH} from '@class/DH'

export const GetNinkuList = ({
  GenbaDay,
  theDay,
  GenbaDayTaskMidTable,
}: {
  GenbaDay
  theDay: string
  GenbaDayTaskMidTable: (GenbaDayTaskMidTable & {GenbaTask: GenbaTask})[]
}) => {
  const PreviousShiftByDateObj = {}

  // 日付順にソート
  const allShiftForGenba = GenbaDay.Genba.GenbaDayShift.sort((a, b) => {
    return new Date(a.GenbaDay.date).getTime() - new Date(b.GenbaDay.date).getTime()
  })

  allShiftForGenba.forEach(shift => {
    const date = shift.GenbaDay.date
    const isBefore = new Date(date).getTime() <= new Date(theDay).getTime()

    const taskMidTableOnGenba: GenbaDayTaskMidTable[] = shift.GenbaDay.GenbaDayTaskMidTable

    const isSameTaskAssigned = taskMidTableOnGenba.some(mid => {
      return GenbaDay.GenbaDayTaskMidTable.some(mid2 => {
        return mid.genbaTaskId === mid2.genbaTaskId
      })
    })

    if (isBefore && isSameTaskAssigned) {
      const dateKey = formatDate(date)
      DH.makeObjectOriginIfUndefined(PreviousShiftByDateObj, dateKey, [])
      PreviousShiftByDateObj[dateKey].push(shift)
    }

    // }
  })

  const ninkuList = Object.keys(PreviousShiftByDateObj).map(dateKey => {
    const shifts = PreviousShiftByDateObj[dateKey]
    return shifts.length
  })
  let ninkuListSum = ninkuList.reduce((acc, curr) => acc + curr, 0) ?? 3

  const result: any = Object.fromEntries(
    GenbaDayTaskMidTable.map(d => {
      return [d?.GenbaTask?.name, []]
    })
  )

  GenbaDayTaskMidTable.sort((a, b) => -a.sortOrder - b.sortOrder).forEach(d => {
    const {from, to, color} = d.GenbaTask
    const name = d.GenbaTask?.name ?? ''
    const requiredNinku: number = d.GenbaTask?.requiredNinku ?? 5

    if (ninkuListSum >= requiredNinku) {
      result[name].push(requiredNinku)
      ninkuListSum -= requiredNinku
    } else if (ninkuListSum < requiredNinku) {
      const countToAdd = ninkuListSum
      result[name].push(countToAdd)
      ninkuListSum -= countToAdd
    }
  })

  return {ninkuList, result}
}
