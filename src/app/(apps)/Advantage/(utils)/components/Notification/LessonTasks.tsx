import {HREF} from '@cm/lib/methods/urls'
import {Alert} from '@components/styles/common-components/Alert'
import {R_Stack} from '@components/styles/common-components/common-components'
import {ParameterCard} from '@components/styles/common-components/ParameterCard'

import Link from 'next/link'
import {Fragment} from 'react'
const LessonTasks = ({LessonLogWithUnreadComments, query}) => {
  return (
    <div>
      {LessonLogWithUnreadComments.length === 0 && (
        <Alert color="blue" className={`text-center`}>
          未読のコメントはありません
        </Alert>
      )}
      {LessonLogWithUnreadComments.map((lessonLog, idx) => {
        const title = `${lessonLog.Lesson.MiddleCategory.BigCategory.name} ${lessonLog.Lesson.MiddleCategory.name} ${lessonLog.Lesson.name}`

        const href = HREF(`/Advantage/lessonLog/${lessonLog.id}`, {}, query)

        return (
          <Fragment key={idx}>
            <R_Stack className={`gap-4`}>
              <ParameterCard
                {...{
                  label: '生徒名',
                  value: lessonLog.User.name,
                }}
              />
              <ParameterCard
                {...{
                  label: 'レッスン',
                  value: title,
                }}
              />

              <ParameterCard {...{label: '未読コメント', value: `${lessonLog.Comment.length}件`}} />
              <ParameterCard
                {...{
                  label: 'リンク',
                  value: (
                    <Link className={`t-link`} href={href}>
                      こちら
                    </Link>
                  ),
                }}
              />
            </R_Stack>
          </Fragment>
        )
      })}
    </div>
  )
}

export default LessonTasks
