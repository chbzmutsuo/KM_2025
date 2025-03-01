import {Fields} from '@cm/class/Fields/Fields'
import {formatDate} from '@cm/class/Days'

import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'

import {
  fetchTransactionAPI,
  fetchUniversalAPI,
  toastByResult,
  updateWithImageAndAddUrlToLatestFormData,
} from '@lib/methods/api-fetcher'
import React, {useMemo} from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Button} from '@components/styles/common-components/Button'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {ChevronDoubleDownIcon} from '@heroicons/react/20/solid'
import {Alert} from '@components/styles/common-components/Alert'

const ChatSender = ({tickets, settickets, messages, setmessages, additional, scrollToBottom}) => {
  const {session, accessScopes} = useGlobal()
  const {isCoach} = accessScopes().getAdvantageProps()

  const availableTickets = (tickets ?? []).filter(t => {
    return t.payedAt && !t.usedAt
  })

  const firstAvailableTicket = availableTickets?.[0] || isCoach

  const chatColumns = Fields.transposeColumns([
    {
      id: 'url',
      label: 'ファイル',
      type: 'file',
      form: {
        style: {width: 300, maxWidth: '90vw'},
        file: {
          accept: {
            'video/mp4': ['.mov', '.mp4', '.mpeg'],
            'image/jpeg': ['.jpg', '.jpeg', '.png'],
          },
          backetKey: 'lessonImage',
        },
      },
    },
    {
      id: 'message',
      label: 'メッセージ',
      type: 'textarea',
      form: {
        style: {
          height: 60,
          // maxHeight: 50,
          width: 300,
          maxWidth: '90vw',
          margin: 'auto',
        },
      },
    },
  ])

  const {latestFormData, BasicForm, extraFormState, setextraFormState, ReactHookForm} = useBasicFormProps({
    columns: chatColumns,
  })

  const unreadMessages = useMemo(() => messages?.filter(m => !m.read && m.userId !== session?.id), [messages, session])

  const sendChat = async () => {
    if (extraFormState?.files) {
      if (isCoach) {
        undefined
      } else {
        if (!firstAvailableTicket) {
          alert('有効なチケットがありません。購入したチケットは、支払い後に有効化されます。')
          setextraFormState({})
          return
        }
        if (!confirm('画像をアップロードするために、チケットを1枚消費しますか？')) return

        await fetchUniversalAPI('ticket', 'update', {
          where: {id: firstAvailableTicket?.id},
          data: {
            usedAt: formatDate(new Date(), 'iso'),
          },
        })
        settickets(
          tickets.map(t => {
            if (t.id === firstAvailableTicket?.id) {
              return {...t, usedAt: formatDate(new Date(), 'iso')}
            }
            return t
          })
        )
      }
    }

    await upsertCommentWithImage()

    //更新関数
    async function upsertCommentWithImage() {
      const latestFormDataWithImagUrls = await updateWithImageAndAddUrlToLatestFormData({
        latestFormData,
        extraFormState,
        columns: chatColumns,
      })

      const res = await fetchUniversalAPI('comment', 'upsert', {
        where: {id: 0},
        ...latestFormDataWithImagUrls,
        ...additional?.payload,
        include: {User: true},
      })

      setmessages([...messages, res.result])
      toastByResult(res)

      ReactHookForm.reset()
      setextraFormState({})
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }

  const checkAsReadAll = async () => {
    if (!confirm('全て既読にしますか？')) return

    const result = await fetchTransactionAPI({
      transactionQueryList: unreadMessages.map(m => {
        const query: transactionQuery = {
          model: 'comment',
          method: 'update',
          queryObject: {
            where: {id: m.id},
            data: {read: true},
          },
        }
        return query
      }),
    })
    setmessages(messages.map(m => ({...m, read: true})))
  }

  return (
    <>
      <BasicForm
        {...{
          latestFormData,
          onSubmit: async data => {
            await sendChat()
          },
          wrapperClass: 'row-stack gap-0 items-center  items-stretch ',
          ControlOptions: {showLabel: false},
        }}
      >
        <C_Stack className={`items-center`}>
          <R_Stack className={` w-[280px] justify-between gap-1 pr-2`}>
            <R_Stack>
              <ChevronDoubleDownIcon className={`h-6 w-6 text-gray-500`} />
              <Button type="button" color="green" onClick={checkAsReadAll}>
                全て既読
              </Button>
              <Alert className={` text-center text-sm`} color={`${firstAvailableTicket ? 'blue' : 'red'}`}>
                {firstAvailableTicket ? `チケット残数 [ ${availableTickets.length} ] ` : 'チケットなし'}
              </Alert>
            </R_Stack>
            <Button disabled={!latestFormData.url && !latestFormData.message}>送信</Button>
          </R_Stack>
        </C_Stack>
      </BasicForm>
    </>
  )
}

export default ChatSender
