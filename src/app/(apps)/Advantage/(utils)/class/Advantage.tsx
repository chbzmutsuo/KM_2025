import {forSelectConfig} from '@cm/types/types'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export class Advantage {
  static const = {
    ticketPackCount: 3,
    optionConfigs: {
      studentOptionsConfig: () => {
        return {
          modelName: 'user',
          where: {membershipName: '生徒'},
        } as forSelectConfig
      },
    },
    userTypes: [
      {value: 'コーチ', color: '#90BCE4'},
      {value: '生徒', color: '#A7C853'},
    ],
  }

  static getMyLessonLog = async ({session}) => {
    const {result} = await fetchUniversalAPI(`lessonLog`, 'findMany', {
      where: {userId: session?.id},
    })

    return result
  }

  static getLessonLogInfo = ({LessonLog}) => {
    const isCompleted = LessonLog?.isPassed && LessonLog?.isPaid
    const isInProcess = LessonLog && !LessonLog?.isPassed

    return {...LessonLog, isCompleted, isInProcess}
  }

  static task = {
    admin: {},
  }
}
