import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {NextResponse} from 'next/server'

export const GET = async () => {
  const {result: genbaList} = await fetchUniversalAPI(`genba`, `findMany`, {include: {GenbaDay: {take: 1}}})

  await Promise.all(
    genbaList.map(async genba => {
      const genbaDay = genba.GenbaDay[0]
      if (genbaDay) {
        console.log('バッチ:' + genba.name) //////logs

        const res = await fetchUniversalAPI(`genbaDay`, `update`, {where: {id: genbaDay.id}, data: {}})
      }
    })
  )

  return NextResponse.json({})
}
