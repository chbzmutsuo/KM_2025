import {google} from 'googleapis'
import {NextRequest, NextResponse} from 'next/server'
import {getClientConfig} from '@app/api/google/lib/server-actions'
import {requestResultType} from '@cm/types/types'
import {addHours} from 'date-fns'
import prisma from 'src/cm/lib/prisma'

const defaultEvent = {
  calendarId: 'primary',
  requestBody: {
    summary: 'Sample Event',
    description: 'This is a sample event created using Google Calendar API.',
    start: {dateTime: new Date().toISOString()},
    end: {dateTime: addHours(new Date(), 2).toISOString()},
  },
}

export async function POST(req: NextRequest) {
  let result: requestResultType = {success: false, message: ``, result: null}

  const {tokenId, email, eventCreateObjectProps = defaultEvent} = await req.json()
  const tokenData = await prisma.googleAccessToken.findUnique({
    where: {id: tokenId, email},
  })

  const token = JSON.parse(tokenData?.tokenJSON ?? `{}`)

  if (!token.access_token) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const clientConfig = await getClientConfig()

  if (clientConfig === undefined) {
    result = {success: false, message: `Invalid client_id`, result: null}
    return NextResponse.json(result, {status: 400})
  }

  const oAuth2Client = new google.auth.OAuth2(clientConfig.clientId, clientConfig.clientSecret)
  oAuth2Client.setCredentials(token)

  const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

  try {
    const response = await calendar.events.insert(eventCreateObjectProps)

    return NextResponse.json({success: true, message: `予定を作成しました。`, result: response.data})
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
