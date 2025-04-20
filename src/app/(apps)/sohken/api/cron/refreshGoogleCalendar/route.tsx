import {targetUsers} from '@app/(apps)/sohken/api/cron/targetUsers'
import {GoogleCalendar_Get} from '@app/api/google/actions/calendarAPI'
import { getMidnight} from '@class/Days'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {doTransaction, transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {addDays} from 'date-fns'
import {NextRequest, NextResponse} from 'next/server'


export const GET = async (req: NextRequest) => {
  await fetchUniversalAPI(`sohkenGoogleCalendar`, `deleteMany`, {where: {id: {gte: 0}}})
  // if ((await isCron({req})) === false) {
  //   const res = {success: false, message: `Unauthorized`, result: null}
  //   const status = {status: 401, statusText: `Unauthorized`}
  //   return NextResponse.json(res, status)
  // }
  const transactionQueryList: transactionQuery[] = []
  const UserSchedule = await Promise.all(
    targetUsers.map(async user => {
      try {
        const events = (await GoogleCalendar_Get({calendarId: user.email, from: addDays(new Date(), -90)}))?.events?.items

        events
          ?.filter(data => data.visibility !== 'private')
          .forEach(async data => {
            const eventId = data.id
            const startAt = data.start?.dateTime
            const endAt = data.end?.dateTime

            const date = getMidnight(new Date(data.start?.date ?? data.start?.dateTime ?? new Date()))
            const summary = data.summary

            const queryObject = {
              where: {eventId},
              ...createUpdate({
                calendarId: user.email,
                eventId,
                summary,
                startAt,
                endAt,
                date,
              }),
            }

            transactionQueryList.push({model: `sohkenGoogleCalendar`, method: `upsert`, queryObject})
          })
      } catch (error) {
        console.error(error) //////////

        return {
          user: {
            name: user.name,
            email: user.email,
          },
          events: [],
        }
      }
    })
  )

  await doTransaction({transactionQueryList})

  return NextResponse.json({})
}
