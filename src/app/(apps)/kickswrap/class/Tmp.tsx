import {doStandardPrisma} from '@lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export class Tmp {
  static const = {
    optionConfigs: {
      studentOptionsConfig: {
        where: {membershipName: '生徒'},
      },
    },
    userTypes: [
      {value: 'コーチ', color: '#90BCE4'},
      {value: '生徒', color: '#A7C853'},
    ],
  }

  static getMyLessonLog = async ({session}) => {
    const {result} = await doStandardPrisma('lessonLog', 'findMany', {
      where: {userId: session?.id},
    })
    return result
  }

  static task = {
    admin: {},
  }
}
