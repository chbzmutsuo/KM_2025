import {Advantage} from '@app/(apps)/Advantage/(utils)/class/Advantage'
import {ColBuilder} from '@app/(apps)/Advantage/(utils)/class/ColBuilder'

import {formatDate} from '@cm/class/Days'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'

import useModal from '@cm/components/utils/modal/useModal'
import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'

import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'

const BuyTicket = ({LessonLog, settickets}) => {
  const useGlobalProps = useGlobal()
  const {isCoach} = useGlobalProps.accessScopes().getAdvantageProps()
  const {handleClose, handleOpen, Modal} = useModal()
  const {BasicForm, latestFormData} = useBasicFormProps({
    columns: ColBuilder.ticket({
      useGlobalProps,
      ColBuilderExtraProps: {
        inLessonPage: true,
      },
    }),
  })

  const ticketPackCount = Advantage.const.ticketPackCount
  return (
    <>
      <Button onClick={handleOpen}>チケット追加購入</Button>
      <Modal {...{}}>
        {isCoach ? (
          // coachは個別に増やせる
          <BasicForm
            latestFormData={latestFormData}
            onSubmit={async e => {
              const {payedAt, usedAt} = latestFormData
              const {result} = await fetchUniversalAPI(`ticket`, `create`, {
                data: {
                  lessonLogId: LessonLog.id,
                  userId: LessonLog.userId,
                  payedAt: payedAt ? formatDate(payedAt, `iso`) : undefined,
                  usedAt: usedAt ? formatDate(usedAt, `iso`) : undefined,
                },
              })

              settickets(prev => [...prev, result])
            }}
          >
            <Button>追加</Button>
          </BasicForm>
        ) : (
          // ユーザーは2個単位で追加
          <C_Stack className={` items-center`}>
            <div>チケットの最低購入単位は{ticketPackCount}個です。</div>
            <Button
              color={`red`}
              onClick={async () => {
                if (!confirm(`${ticketPackCount}枚分購入しますか？`)) return
                const queries: transactionQuery[] = []
                new Array(ticketPackCount).fill('').map(() => {
                  queries.push({
                    model: `ticket`,
                    method: `create`,
                    queryObject: {
                      data: {
                        lessonLogId: LessonLog.id,
                        userId: LessonLog.userId,
                        type: `追加購入`,
                      },
                    },
                  })
                })

                const {result: newTickets} = await fetchTransactionAPI({transactionQueryList: queries})
                if (newTickets.length > 0) {
                  settickets(prev => [...prev, ...newTickets])
                }
              }}
            >
              {ticketPackCount}枚分購入する
            </Button>
          </C_Stack>
        )}
      </Modal>
    </>
  )
}

export default BuyTicket
