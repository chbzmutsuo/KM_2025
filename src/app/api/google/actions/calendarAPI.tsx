'use server'

import {getAuth} from '@app/api/google/actions/getAuth'
import {google} from 'googleapis'

export const GoogleCalendar_Get = async (props: {calendarId: string; from?: Date; to?: Date}) => {
  const auth = getAuth()
  const Calendar = google.calendar({version: 'v3', auth})
  const targetCalendar = await Calendar.calendars.get({calendarId: props.calendarId})

  const {data, headers} = targetCalendar

  const events = await Calendar.events.list({
    calendarId: props.calendarId,
    timeMin: props.from ? props.from.toISOString() : undefined,
    timeMax: props.to ? props.to.toISOString() : undefined,
  })
  const {data: eventsData} = events

  eventsData.items?.forEach(item => {
    console.log(item)
  })

  return {events: eventsData}
}
