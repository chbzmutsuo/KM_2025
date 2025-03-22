import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    // const tbmOperationGroup: Prisma.TbmOperationGroupFindManyArgs = {
    //   include: {
    //     TbmBase: {},
    //     User: {},
    //     TbmRefuelHistory: {},
    //     TbmOperation: {
    //       include: {
    //         TbmRouteGroup: {
    //           include: {
    //             // TbmRoute: {},
    //           },
    //         },
    //       },
    //     },
    //     TbmVehicle: {},
    //   },
    // }
    const tbmRouteGroup: Prisma.TbmRouteGroupFindManyArgs = {
      include: {
        Mid_TbmRouteGroup_TbmCustomer: {
          include: {TbmCustomer: {}},
        },
        Mid_TbmRouteGroup_TbmProduct: {
          include: {TbmProduct: {}},
        },
        TbmBase: {},
      },
    }

    // const tbmRoute: Prisma.TbmRouteFindManyArgs = {include: {TbmBillingAddress: {}, TbmRouteGroup: tbmRouteGroup}}

    const tbmBase: Prisma.TbmBaseFindManyArgs = {
      include: {
        TbmRouteGroup: {
          include: {
            // TbmRoute: tbmRoute
          },
        },
      },
    }
    // const tbmOperation: Prisma.TbmOperationFindManyArgs = {
    //   include: {
    //     User: {include: {TbmBase: {}}},
    //     TbmRouteGroup: {include: {TbmBase: {}}},
    //   },
    // }

    const include: {[key in PrismaModelNames]?: any} = {
      // tbmOperation,
      // tbmOperationGroup,
      // tbmRoute,
      tbmRouteGroup,
      tbmBase,
      user: {include: {TbmBase: {}, TbmVehicle: {}}} as Prisma.UserFindManyArgs,
      tbmVehicle: {include: {TbmBase: {}}} as Prisma.TbmVehicleFindManyArgs,
      tbmRefuelHistory: {include: {TbmVehicle: {}, User: {}}} as Prisma.TbmRefuelHistoryFindManyArgs,
      tbmCarWashHistory: {include: {TbmVehicle: {}, User: {}}} as Prisma.TbmCarWashHistoryFindManyArgs,

      tbmDriveSchedule: {
        include: {
          TbmVehicle: {},
          TbmBase: {},
          User: {},
          TbmRouteGroup: {},
        },
      } as Prisma.TbmDriveScheduleFindManyArgs,
      odometerInput: {
        include: {
          TbmVehicle: {},
          User: {},
        },
      } as Prisma.OdometerInputFindManyArgs,
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
