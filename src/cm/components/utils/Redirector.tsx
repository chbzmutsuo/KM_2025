'use client'
import useRedirect from 'src/cm/hooks/useRedirect'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'

const Redirector = ({redirectPath}) => {
  useRedirect(redirectPath, redirectPath)
  return <PlaceHolder></PlaceHolder>
}

export default Redirector
