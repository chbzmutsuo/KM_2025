'use client'

import useGlobal from '@hooks/globalHooks/useGlobal'
import {CenterScreen} from '@components/styles/common-components/common-components'

import Redirector from '@components/utils/Redirector'
import LoginForm from '@app/(utils)/login/LoginForm'
import {getAqLoginType} from 'src/non-common/scope-lib/getScopes'

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
