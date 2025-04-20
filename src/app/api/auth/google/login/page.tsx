'use client'
import {getAuthUrl} from '@app/api/auth/google/getAuthUrl'

import {Absolute} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import Link from 'next/link'

import React from 'react'
import useSWR from 'swr'

export default function login() {
  const {router} = useGlobal()
  const {data: authUrl} = useSWR(`/googleAuthLogin`, async () => {
    return await getAuthUrl()
  })

  if (authUrl) {
    return (
      <Absolute>
        <Link href={authUrl ?? ''} className={` t-link`}>
          Google認証
        </Link>
      </Absolute>
    )
  }
}
