'use client'
import Notification from '@app/(apps)/Advantage/(utils)/components/Notification/Notification'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function Template(props) {
  const {children} = props
  const {accessScopes, pathname} = useGlobal()
  const {isCoach, isStudent} = accessScopes().getAdvantageProps()

  // if (pathname !== `/Advantage`) {
  //   if (!isCoach && !isStudent) {
  //     return <Alert>ユーザーを選択してください</Alert>
  //   }
  // }
  return (
    <div>
      <Notification />
      <>{children}</>
    </div>
  )
}
