'use client'

import {C_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'

export const ApReceiverStatusInfo = ({ApRequest, handleApprovementFormModalOpen, session, approvementTypes}) => {
  if (!ApRequest.ApReceiver) {
    throw new Error(`ApReceiverが存在しません`)
  }
  const {accessScopes} = useGlobal()
  const {admin} = accessScopes()
  return (
    <section>
      {ApRequest.ApReceiver.length === 0 ? (
        <span className={`text-xs`}>承認者未設定</span>
      ) : (
        <C_Stack className={` gap-0.5 text-sm`}>
          {ApRequest.ApReceiver.map((receiver, i) => {
            const name = receiver?.User?.name
            const status = receiver?.status
            const isCorrectUser = session?.id === receiver?.userId
            const showLink = admin ? true : isCorrectUser ? true : false

            const EditButton = () => {
              const StatusDispay = () => {
                const color = approvementTypes.find(d => d.value === status)?.color

                return (
                  <span
                    {...{
                      className: `inline-block leading-4  p-0.5 w-[50px] text-sm ${showLink ? `t-link` : ''}`,
                      style: {color: color},
                    }}
                  >
                    {status ?? '未閲覧'}
                  </span>
                )
              }
              return (
                <button disabled={showLink ? false : true}>
                  <span
                    onClick={() => {
                      handleApprovementFormModalOpen({theApReceiverr: receiver, theApRequest: ApRequest})
                    }}
                  >
                    <StatusDispay />
                  </span>
                </button>
              )
            }

            return (
              <div key={i}>
                <div className={` flex w-full items-start justify-between`}>
                  <div className={` w-[70px] `}>{name}</div>
                  <span>:</span>
                  <span>
                    <EditButton />
                  </span>
                </div>
              </div>
            )
          })}
        </C_Stack>
      )}
    </section>
  )
}
