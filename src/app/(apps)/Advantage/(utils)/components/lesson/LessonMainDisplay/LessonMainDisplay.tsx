'use client'
import React, {useEffect, useRef, useState} from 'react'
import BasicTabs from '@cm/components/utils/tabs/BasicTabs'

import LessonMain from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/LessonBasics'

import ChatList from '@app/(apps)/Advantage/(utils)/components/chat/message/ChatList'
import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'

import {PaymentStatus} from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/PaymentStatus/PaymentStatus'
import PassFailStatus, {
  Trophy,
} from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/PassFailStatus/PassFailStatus'
import BasicModal from '@cm/components/utils/modal/BasicModal'
import {ChatBubbleOvalLeftEllipsisIcon} from '@heroicons/react/20/solid'
import useModal from '@cm/components/utils/modal/useModal'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Alert} from '@components/styles/common-components/Alert'

export const LessonMainDisplay = (props: any) => {
  const {Lesson, LessonLog} = props

  const useGlobalProps = useGlobal()
  const {isCoach} = useGlobalProps.accessScopes().getAdvantageProps()
  const {session, width} = useGlobalProps
  const {isPassed, isPaid} = LessonLog ?? {}

  const commonClass = `mx-auto w-[300px]  `
  const Wrapper = ({children}) => <div className={commonClass}>{children}</div>

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const id = lastMessageRef.current?.id ?? ''

    const element = document.getElementById(id)
    element?.scrollIntoView?.({
      behavior: 'smooth',
    })
  }

  const {tickets, settickets, messages, setmessages, messageSource} = initiation({LessonLog})

  return (
    <C_Stack className={`gap-0`}>
      <IsPassed {...{isPassed}} />

      <Top {...{Lesson, LessonLog}} />
      <BasicTabs
        id={'LessonMainDisplay'}
        showAll={width > 768}
        TabComponentArray={[
          {
            label: '進め方',
            component: (
              <Wrapper>
                <LessonMain {...{Lesson, LessonLog, useGlobalProps}} />
              </Wrapper>
            ),
          },
          {
            label: 'メッセージ',
            component: (
              <Wrapper>
                <ChatList
                  {...{
                    ...{tickets, settickets, messages, setmessages},
                    ...{scrollToBottom, lastMessageRef, LessonLog},
                    additional: {
                      payload: {
                        userId: session?.id,
                        lessonLogId: LessonLog?.id,
                      },
                    },
                  }}
                />
              </Wrapper>
            ),
          },

          {
            label: 'チケット',
            component: (
              <Wrapper>
                <PaymentStatus {...{LessonLog, useGlobalProps, settickets, isPaid, isPassed}} />
              </Wrapper>
            ),
          },
          {
            exclusiveTo: isCoach,
            label: '合否判定',
            component: (
              <Wrapper>
                <PassFailStatus {...{LessonLog, useGlobalProps}} />
              </Wrapper>
            ),
          },
        ]}
      />
    </C_Stack>
  )
  function initiation({LessonLog}) {
    const [tickets, settickets] = useState(LessonLog.Ticket ?? [])

    const [messages, setmessages] = useState([])
    const {data: messageSource} = usefetchUniversalAPI_SWR('comment', 'findMany', {
      include: {User: {}},
      where: {lessonLogId: LessonLog?.id ?? 0},
    })

    useEffect(() => {
      setmessages(messageSource)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }, [messageSource])

    return {tickets, settickets, messages, setmessages, messageSource}
  }
}

const Top = ({Lesson, LessonLog}) => {
  const {LessonLogAuthorizedUser} = LessonLog ?? {}

  return (
    <div>
      <div className={`items-start`}>
        <R_Stack className={`text-responsive gap-1 `}>
          <small>{Lesson?.MiddleCategory?.BigCategory?.name}</small>
          <span>{`>>`}</span>
          <small>{Lesson?.MiddleCategory?.name}</small>
          <span>{`>>`}</span>
          <small>{Lesson?.name}</small>
        </R_Stack>

        {LessonLogAuthorizedUser?.length > 0 && (
          <R_Stack className={`gap-2`}>
            <div>チェック:</div>
            {LessonLogAuthorizedUser?.map(d => {
              return (
                <div key={d.id}>
                  <BasicModal
                    alertOnClose={false}
                    btnComponent={
                      <R_Stack className={`text-responsive w-full cursor-pointer p-1 shadow-md`}>
                        <div>{d.User?.name}</div>
                        <ChatBubbleOvalLeftEllipsisIcon className={`w-6 text-red-400`} />
                      </R_Stack>
                    }
                  >
                    {d.comment}
                  </BasicModal>
                </div>
              )
            })}
          </R_Stack>
        )}
      </div>
    </div>
  )
}

const IsPassed = ({isPassed}) => {
  const {Modal} = useModal({defaultOpen: true})

  return (
    isPassed && (
      <Modal alertOnClose={false}>
        <Alert color={`yellow`} className={`w-[270px] p-4 text-lg`}>
          <C_Stack className={`items-center`}>
            このレッスンに合格しました！
            <Trophy />
          </C_Stack>
        </Alert>
      </Modal>
    )
  )
}
