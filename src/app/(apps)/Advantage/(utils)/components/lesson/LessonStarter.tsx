'use client'

import {toast} from 'react-toastify'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Advantage} from '@app/(apps)/Advantage/(utils)/class/Advantage'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function LessonStartar({Lesson}) {
  const {session, toggleLoad, router} = useGlobal()

  /**
   * このレッスンを開始する
   */
  const handleApplyForLesson = async () => {
    const data = {
      userId: session?.id,
      lessonId: Lesson.id,
      Ticket: {
        createMany: {
          data: [
            ...new Array(Advantage.const.ticketPackCount).fill('').map(() => {
              return {userId: session?.id, type: '受講時発行'}
            }),
          ],
        },
      },
    }
    await toggleLoad(
      async () => {
        await fetchUniversalAPI('lessonLog', 'upsert', {
          where: {
            unique_userId_lessonId: {
              userId: session?.id,
              lessonId: Lesson.id,
            },
          },
          create: data,
          update: data,
        })

        toast.success(`レッスンを開始しました`)
      },
      {refresh: true}
    )
  }

  return (
    <div className={`col-stack  z-50 cursor-auto`}>
      <div className={`t-paper col-stack  items-center gap-8`}>
        <p className={`text-2xl font-bold`}> このレッスンを開始しますか？</p>
        <p>
          <small className={`text-error-main`}>
            動画の投稿・採点を受けるには、レッスンを開始後に所定の口座にお振り込みをお願いいたします。
          </small>
        </p>
        <button onClick={handleApplyForLesson} className={`t-btn `}>
          レッスン開始
        </button>
      </div>
      <div></div>
    </div>
  )
}
