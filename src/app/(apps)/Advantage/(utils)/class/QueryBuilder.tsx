import {includeProps, roopMakeRelationalInclude} from '@class/builders/QueryBuilderVariables'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const systemChatRoom: Prisma.SystemChatRoomFindManyArgs = {
      include: {
        SystemChat: {
          include: {
            User: {},
          },
        },
        User: {},
      },
    }

    const user = {
      include: {},
    }

    const lesson = {
      include: {
        MiddleCategory: {
          include: {BigCategory: {}},
        },
        LessonImage: {},
        LessonLog: {
          include: {
            Ticket: {},
            Comment: {
              include: {
                User: {},
              },
            },
          },
        },
      },
    }

    const lessonLog = {
      include: {
        Ticket: {},
        User: {},
        Lesson: lesson,
        Comment: {
          include: {
            User: {},
          },
        },
        LessonLogAuthorizedUser: {
          include: {User: {}},
        },
      },
    }

    const bigCategory: Prisma.BigCategoryFindManyArgs = {
      include: {
        MiddleCategory: {
          orderBy: [{sortOrder: 'asc'}],
          include: {
            Lesson: {
              orderBy: [{sortOrder: 'asc'}],
            },
          },
        },
      },
    }

    const middleCategory = {
      include: {
        Lesson: {},
      },
    }
    const ticket = {
      include: {
        LessonLog: {
          include: {
            Lesson: {
              include: {MiddleCategory: {include: {BigCategory: {}}}},
            },
          },
        },
        User: {},
      },
    }

    const include = {
      systemChatRoom,
      user,
      bigCategory,
      middleCategory,
      lesson,
      lessonLog,
      ticket,
    }

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({
        parentName: key,
        parentObj: include[key],
      })
    })

    return include
  }
}
