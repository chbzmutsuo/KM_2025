import {google} from 'googleapis'
import {NextRequest, NextResponse} from 'next/server'
import {serialize} from 'cookie'
import {basePath} from 'src/cm/lib/methods/common'
import {redirectUri} from '@app/api/google/lib/constants'
import {getClientConfig} from '@app/api/google/lib/server-actions'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') ?? ``

  const clientConfig = await getClientConfig()

  if (clientConfig === undefined) {
    return NextResponse.json({error: 'Invalid client_id'}, {status: 400})
  }

  const oAuth2Client = new google.auth.OAuth2(clientConfig.clientId, clientConfig.clientSecret, redirectUri)

  try {
    const {tokens} = await oAuth2Client.getToken(code)

    oAuth2Client.setCredentials(tokens)

    const googleUser = await google
      .oauth2(`v2`)
      .userinfo.get({auth: oAuth2Client})
      .then(res => res.data)

    if (googleUser.email) {
      const data = {
        email: googleUser.email,
        tokenJSON: JSON.stringify(tokens),
        expiry_date: new Date(Number(tokens.expiry_date)),
      }

      const {result} = await fetchUniversalAPI(`googleAccessToken`, `upsert`, {
        where: {email: googleUser.email},
        create: data,
        update: data,
      })

      console.info(`accessToken of${result.email} was refreshed`)
    }

    const response = NextResponse.redirect(basePath)
    response.headers.set(
      'Set-Cookie',
      serialize('googleAuthToken', JSON.stringify(tokens), {path: `/${process.env.NEXT_PUBLIC_ROOTPATH}`})
    )
    return response
  } catch (error) {
    console.error(error.message)
    return NextResponse.json({error, msg: 'Failed to retrieve tokens'}, {status: 500})
  }
}
