'use client'

import useGlobal from '@hooks/globalHooks/useGlobal'
import { CenterScreen} from '@components/styles/common-components/common-components'
import {getAqLoginType} from '@app/(apps)/aquapot/(lib)/customerLoginLib'
import Redirector from '@components/utils/Redirector'
import LoginForm from '@app/(utils)/login/LoginForm'

export default function DynamicMasterPage(props) {
  const {session, accessScopes} = useGlobal()

  const {asCustomer, asUser} = getAqLoginType({session})
  if (asCustomer) return <Redirector redirectPath={`/aquapot/myPage/${session.id}`} />

  if (!asUser) return <Redirector redirectPath={`/404`} />

  return (
    <CenterScreen>
      <LoginForm />
    </CenterScreen>
  )
}
