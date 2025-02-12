import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

export default function useRedirect(mustRedirect, redirectUrl = '/404', redirect = true) {
  const router = useRouter()

  useEffect(() => {
    if (mustRedirect && redirect && redirectUrl) {
      router.replace(redirectUrl)
    }
  }, [])

  return {
    isValidUser: !mustRedirect,
  }
}
