import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {HREF} from '@lib/methods/urls'
import useMyNavigation from '@hooks/globalHooks/useMyNavigation'

export default function useRedirect(mustRedirect, redirectUrl = '/404', redirect = true) {
  const router = useRouter()
  const {query} = useMyNavigation()
  useEffect(() => {
    if (mustRedirect && redirect && redirectUrl) {
      router.replace(redirectUrl)
    }
  }, [])

  return {
    isValidUser: !mustRedirect,
  }
}
