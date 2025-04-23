'use client'
import {useEffect} from 'react'
import {redirect as nextRedirect} from 'next/navigation'

export default function useRedirect(mustRedirect, redirectUrl = '/404', shouldRedirect = true) {
  const doRedirect = mustRedirect && shouldRedirect && redirectUrl
  useEffect(() => {
    if (doRedirect) {
      nextRedirect(redirectUrl)
    }
  }, [doRedirect, redirectUrl])

  return {
    isValidUser: !mustRedirect,
  }
}
