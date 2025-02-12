import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const user: Prisma.UserFindManyArgs = {
      include: {
        ApReceiver: {include: {ApRequest: {}}},
        ApSender: {include: {ApRequest: {}}},
        YsWorkRecord: {},
        PaidLeaveGrant: {},
        UserWorkTimeHistoryMidTable: {
          include: {
            WorkType: {},
          },
        },
      },
    }
    const ysWorkRecord: Prisma.YsWorkRecordFindManyArgs = {
      include: {User: {}},
    }
    const workType: Prisma.WorkTypeFindManyArgs = {}
    const apRequest: Prisma.ApRequestFindManyArgs = {
      include: {
        ApReceiver: {include: {User: {}}},
        ApSender: {include: {User: {}}},
        ApRequestTypeMaster: {},
        ApCustomFieldValue: {include: {ApCustomField: {}}},
      },
    }
    const apReceiver: Prisma.ApReceiverFindManyArgs = {
      include: {
        ApRequest: {include: apRequest.include},
      },
    }

    const userWorkTimeHistoryMidTable: Prisma.UserWorkTimeHistoryMidTableFindManyArgs = {
      include: {
        User: {},
        WorkType: {},
      },
    }
    const userPayedLeaveTypeMidTable: Prisma.UserPayedLeaveTypeMidTableFindManyArgs = {
      include: {
        User: {},
        PayedLeaveType: {},
      },
    }
    const include: {[key in PrismaModelNames]?: any} = {
      userWorkTimeHistoryMidTable,
      userPayedLeaveTypeMidTable,
      user,
      workType,
      ysWorkRecord,
      apRequest,
      apReceiver,
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
