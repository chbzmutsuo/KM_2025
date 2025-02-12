'use client '

import UnSolvedTaskListTemplate from '@app/(apps)/Advantage/(utils)/components/Notification/UnSolvedTaskListTemplate'
import {
  getLessonLogWithUnpayedTicket,
  getLessonLogWithUnreadComments,
  getSystemChatWithUnreadComments,
} from '@app/(apps)/Advantage/notification-methods'

import Accordion from '@cm/components/utils/Accordions/Accordion'

import BasicModal from '@cm/components/utils/modal/BasicModal'
import {BellIcon} from '@heroicons/react/20/solid'

import {HREF} from '@cm/lib/methods/urls'
import Link from 'next/link'
import {C_Stack} from '@components/styles/common-components/common-components'
import {IconBtn} from '@components/styles/common-components/IconBtn'
const CoachNotification = ({isCoach, session, query}) => {
  const {LessonLogWithUnreadComments} = getLessonLogWithUnreadComments({isCoach, session})
  const {LessonLogWithUnpayedTicket} = getLessonLogWithUnpayedTicket({isCoach, session})
  const {systemChatRoomWithUnreadMsges} = getSystemChatWithUnreadComments({isCoach, session})

  const adminLessonTasks = {
    LessonLogWithUnreadComments,
    LessonLogWithUnpayedTicket,
    systemChatRoomWithUnreadMsges,
  }

  if (
    LessonLogWithUnreadComments === undefined ||
    LessonLogWithUnpayedTicket === undefined ||
    systemChatRoomWithUnreadMsges === undefined
  )
    return <div>loading...</div>

  const hasNotifications = Object.values(adminLessonTasks).some((v: any[]) => v.length > 0)
  return (
    <BasicModal
      alertOnClose={false}
      btnComponent={
        <IconBtn color={hasNotifications ? 'red' : 'sub'} className={`h-7 w-7 rounded-full text-start text-lg`}>
          <BellIcon className={`w-5`} />
        </IconBtn>
      }
    >
      <C_Stack className={`gap-12`}>
        <Accordion
          {...{
            defaultOpen: true,
            label: `レッスンチャット【${LessonLogWithUnreadComments.length}】`,
          }}
        >
          <UnSolvedTaskListTemplate
            {...{
              query,
              data: LessonLogWithUnreadComments.map(LessonLog => {
                const title = `${LessonLog.Lesson.MiddleCategory.BigCategory.name} ${LessonLog.Lesson.MiddleCategory.name} ${LessonLog.Lesson.name}`
                const href = HREF(`/Advantage/lessonLog/${LessonLog.id}`, {}, query)
                return [
                  {label: '生徒名', value: LessonLog.User.name},
                  {label: 'レッスン', value: title},
                  {label: '未解決コメント', value: `${LessonLog.Comment.length}件`},
                  {
                    label: 'リンク',
                    value: (
                      <Link className={`t-link`} href={href}>
                        こちら
                      </Link>
                    ),
                  },
                ]
              }),
            }}
          />
        </Accordion>

        <Accordion
          {...{
            defaultOpen: true,
            label: `入金前のチケット`,
          }}
        >
          <UnSolvedTaskListTemplate
            {...{
              query,
              data: LessonLogWithUnpayedTicket.map(LessonLog => {
                const title = `${LessonLog.Lesson.MiddleCategory.BigCategory.name} ${LessonLog.Lesson.MiddleCategory.name} ${LessonLog.Lesson.name}`

                const href = isCoach
                  ? HREF(`/Advantage/lessonLog/${LessonLog.id}`, {}, query)
                  : HREF(`/Advantage/lesson/${LessonLog.Lesson.id}`, {}, query)
                return [
                  {label: '生徒名', value: LessonLog.User.name},
                  {label: 'レッスン', value: title},
                  {label: 'チケット数', value: `${LessonLog.Ticket.length}枚`},
                  {
                    label: 'リンク',
                    value: (
                      <Link className={`t-link`} href={href}>
                        こちら
                      </Link>
                    ),
                  },
                ]
              }),
            }}
          />
        </Accordion>

        <Accordion
          {...{
            defaultOpen: true,
            label: `全体チャット`,
          }}
        >
          <UnSolvedTaskListTemplate
            {...{
              query,
              data: systemChatRoomWithUnreadMsges.map(chatRoom => {
                const href = isCoach
                  ? HREF(`/Advantage/systemChatRoom/${chatRoom.id}`, {}, query)
                  : HREF(`/Advantage/user-chat/${chatRoom.id}}`, {}, query)
                return [
                  {label: '生徒名', value: chatRoom?.User?.name},
                  {label: '未解決コメント', value: `${chatRoom.SystemChat.length}件`},
                  {
                    label: 'リンク',
                    value: (
                      <Link className={`t-link`} href={href}>
                        こちら
                      </Link>
                    ),
                  },
                ]
              }),
            }}
          />
        </Accordion>
      </C_Stack>
    </BasicModal>
  )
}

export default CoachNotification
