'use client'

import AdminLessonDetail from '@app/(apps)/Advantage/(utils)/Detail/AdminLessonDetail'

import UserLessonDetailPage from '@app/(apps)/Advantage/(utils)/Detail/UserLessonDetailPage'

import {LessonMainDisplay} from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/LessonMainDisplay'
import SystemChat from '@app/(apps)/Advantage/(utils)/components/chat/systemChat/SystemChat'
import {DetailPagePropType} from '@cm/types/types'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Fields} from '@class/Fields/Fields'
import dynamic from 'next/dynamic'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

export class PageBuilder {
  static systemChatRoom = {
    form: (props: DetailPagePropType) => {
      const {isCoach} = props.useGlobalProps.accessScopes().getAdvantageProps()
      if (isCoach) {
        const {formData: chatRoom} = props
        return <SystemChat {...{chatRoom}} />
      }
    },
  }
  static lesson = {
    form: (props: DetailPagePropType) => {
      const {isCoach} = props.useGlobalProps.accessScopes().getAdvantageProps()
      if (isCoach) {
        return <AdminLessonDetail {...props} />
      } else {
        return <UserLessonDetailPage {...props} />
      }
    },
  }

  static lessonLog = {
    form: (props: DetailPagePropType) => {
      const {formData: LessonLog} = props
      return (
        <div>
          <LessonMainDisplay {...{LessonLog, Lesson: LessonLog?.Lesson}} />
        </div>
      )
    },
  }

  static getGlobalIdSelector = ({useGlobalProps}) => {
    return () => {
      const {accessScopes} = useGlobal()
      const admin = accessScopes().admin

      const columns = Fields.transposeColumns([
        {
          label: 'ユーザー',
          id: 'g_userId',
          form: {},
          forSelect: {
            config: {
              modelName: `user`,
              where: {OR: [{membershipName: {not: null}}]},
            },
          },
        },
      ])
      if (admin) {
        return (
          <GlobalIdSelector
            {...{
              useGlobalProps,
              columns,
            }}
          />
        )
      }
    }
  }
}
const GlobalIdSelector = dynamic(() => import('@cm/components/GlobalIdSelector/GlobalIdSelector'), {
  loading: () => <PlaceHolder />,
})
