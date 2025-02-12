import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
const LessonLog_Select = {
  id: true,
  Lesson: {
    select: {
      id: true,
      name: true,
      MiddleCategory: {select: {name: true, BigCategory: {select: {name: true}}}},
    },
  },
}

export const getLessonLogWithUnreadComments = ({isCoach, session}) => {
  const commonWhere = {
    read: false,
    User: {
      membershipName: isCoach ? '生徒' : 'コーチ',
    },
  }
  const CommentFindManyArgs: Prisma.LessonLogFindManyArgs = {
    where: {
      userId: isCoach ? undefined : session?.id, //生徒の場合、自分のデータのみ取得
      Comment: {
        some: {...commonWhere},
      },
    },
    select: {
      ...LessonLog_Select,
      Comment: {
        where: {...commonWhere},
        select: {
          id: true,
          message: true,
          read: true,
          url: true,
        },
      },

      User: {select: {name: true}},
    },
    orderBy: {createdAt: 'desc'},
  }
  const {data: LessonLogWithUnreadComments, isLoading} = usefetchUniversalAPI_SWR('lessonLog', 'findMany', CommentFindManyArgs, {
    deps: [],
  })

  return {LessonLogWithUnreadComments, isLoading}
}

export const getLessonLogWithUnpayedTicket = ({isCoach, session}) => {
  const args: Prisma.LessonLogFindManyArgs = {
    where: {
      userId: isCoach ? undefined : session?.id, //生徒の場合、自分のデータのみ取得
      Ticket: {
        some: {payedAt: null},
      },
    },
    select: {
      ...LessonLog_Select,

      User: {},
      Ticket: {
        where: {payedAt: null},
      },
    },
    orderBy: {createdAt: 'desc'},
  }
  const {data: LessonLogWithUnpayedTicket, isLoading} = usefetchUniversalAPI_SWR('lessonLog', 'findMany', args, {deps: []})

  return {LessonLogWithUnpayedTicket, isLoading}
}
export const getSystemChatWithUnreadComments = ({isCoach, session}) => {
  const commonWhere = {
    read: false,
    userId: {not: session?.id},
  }
  const args: Prisma.SystemChatRoomFindManyArgs = {
    where: {
      SystemChat: {
        some: {...commonWhere},
      },
    },
    select: {
      id: true,
      SystemChat: {
        where: {...commonWhere},
        select: {
          id: true,
          message: true,
          read: true,
          url: true,
        },
      },
      User: {},
    },
    orderBy: {createdAt: 'desc'},
  }
  const {data: systemChatRoomWithUnreadMsges, isLoading} = usefetchUniversalAPI_SWR(`systemChatRoom`, 'findMany', args)

  return {systemChatRoomWithUnreadMsges, isLoading}
}
