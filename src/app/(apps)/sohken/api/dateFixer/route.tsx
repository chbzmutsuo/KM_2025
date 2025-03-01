import {toUtc} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {NextResponse} from 'next/server'

export const POST = async () => {
  const {result: genbaDay} = await fetchUniversalAPI(`genbaDay`, `findMany`, {})

  await Promise.all(
    genbaDay.map(async d => {
      if (String(d.date).includes(`00:00:00`)) {
        const unique_date_genbaId = {
          date: d.date,
          genbaId: d.genbaId,
        }

        await fetchUniversalAPI(`genbaDay`, `update`, {
          where: {unique_date_genbaId},
          data: {date: toUtc(d.date)},
        })
      }
    })
  )

  return NextResponse.json({})
}
