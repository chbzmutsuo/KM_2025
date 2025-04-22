'use client'
import {useEffect} from 'react'
import {redirect as nextRedirect, useRouter} from 'next/navigation'

export default function useRedirect(mustRedirect, redirectUrl = '/404', shouldRedirect = true) {
  const router = useRouter()

  const doRedirect = mustRedirect && shouldRedirect && redirectUrl
  useEffect(() => {
    if (doRedirect) {
      nextRedirect(redirectUrl)
    }
  }, [doRedirect, redirectUrl, router])

  return {
    isValidUser: !mustRedirect,
  }
}
