import {getIncludeType, includeProps, roopMakeRelationalInclude} from '@class/builders/QueryBuilderVariables'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const systemChatRoom = {
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

    const include: getIncludeType = {
      systemChatRoom,
      user,
      bigCategory: {
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
      },
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
