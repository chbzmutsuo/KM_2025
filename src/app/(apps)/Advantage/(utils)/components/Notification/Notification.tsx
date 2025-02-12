'use client '
import CoachNotification from '@app/(apps)/Advantage/(utils)/components/Notification/CoachNotification'

import {makePortal} from '@cm/lib/methods/portal'
import useGlobal from '@hooks/globalHooks/useGlobal'

const Notification = () => {
  const useGlobalProps = useGlobal()
  const {query, session} = useGlobalProps
  const {isCoach} = useGlobalProps.accessScopes().getAdvantageProps()

  const NavBarPortaledTasks = makePortal({
    JsxElement: (
      <div className={` py-1`}>
        <CoachNotification {...{isCoach, session, query}} />
      </div>
    ),
    rootId: 'navBar',
  })
  return <div>{NavBarPortaledTasks}</div>
}

export default Notification
