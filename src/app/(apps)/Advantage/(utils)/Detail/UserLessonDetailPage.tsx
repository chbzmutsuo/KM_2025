'use client'

import {DetailPagePropType} from '@cm/types/types'

import LessonStartar from '@app/(apps)/Advantage/(utils)/components/lesson/LessonStarter'

import NotAvailable from '@cm/components/utils/NotAvailable'

import {LessonMainDisplay} from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/LessonMainDisplay'
import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'

const UserLessonDetailPage = (props: DetailPagePropType) => {
  const {
    useGlobalProps: {session, rootPath, query},
  } = props
  const {formData: Lesson} = props
  let lessonLogByUser = Lesson?.LessonLog?.find(log => {
    return log?.userId === session?.id
  })

  const {data: LessonLogAuthorizedUser} = usefetchUniversalAPI_SWR(`lessonLogAuthorizedUser`, `findMany`, {
    where: {lessonLogId: lessonLogByUser?.id},
    include: {User: true},
  })

  lessonLogByUser = lessonLogByUser ? {...lessonLogByUser, LessonLogAuthorizedUser} : undefined

  return (
    <div>
      <NotAvailable
        {...{
          isAvailable: lessonLogByUser,
          reason: <LessonStartar {...{Lesson, lessonLogByUser}} />,
        }}
      >
        <div>
          <LessonMainDisplay {...{Lesson, LessonLog: lessonLogByUser ?? {}}} />
        </div>
      </NotAvailable>
    </div>
  )
}

export default UserLessonDetailPage
