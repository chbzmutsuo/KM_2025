'use client'

import { redirectUri} from '@app/api/google/lib/constants'
import {getClientConfig} from '@app/api/google/lib/server-actions'
import {C_Stack, Padding} from 'src/cm/components/styles/common-components/common-components'
import {Button} from 'src/cm/components/styles/common-components/Button'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'

import Link from 'next/link'

import useSWR from 'swr'

export function GoogleAuthorizer(props: {connected: JSX.Element}) {
  const {connected = null} = props
  const {session, toggleLoad} = useGlobal()

  const {data: clientConfig} = useSWR(`/`, async () => {
    return await getClientConfig()
  })

  if (clientConfig === undefined) return <div>loading...</div>

  const query = {
    client_id: `${clientConfig?.clientId}`,
    redirect_uri: redirectUri,
    access_type: 'offline',
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),

    userId: session.id,
  }
  const href = `https://accounts.google.com/o/oauth2/auth` + `?` + new URLSearchParams(query).toString()

  return (
    <Padding>
      <C_Stack>
        <Link href={href}>{connected ?? <Button color={`red`}>Googleカレンダーと連携</Button>}</Link>
      </C_Stack>
    </Padding>
  )
}
