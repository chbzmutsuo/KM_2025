import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const tbmOperationGroup: Prisma.TbmOperationGroupFindManyArgs = {
      include: {
        TbmBase: {},
        User: {},
        TbmRefuelHistory: {},
        TbmOperation: {
          include: {
            TbmRouteGroup: {
              include: {
                TbmRoute: {},
              },
            },
          },
        },
        TbmVehicle: {},
      },
    }
    const tbmRouteGroup: Prisma.TbmRouteGroupFindManyArgs = {include: {TbmBase: {}}}

    const tbmRoute: Prisma.TbmRouteFindManyArgs = {include: {TbmBillingAddress: {}, TbmRouteGroup: tbmRouteGroup}}

    const tbmBase: Prisma.TbmBaseFindManyArgs = {
      include: {TbmRouteGroup: {include: {TbmRoute: tbmRoute}}},
    }

    const include: {[key in PrismaModelNames]?: any} = {
      tbmOperationGroup,
      tbmRoute,
      tbmRouteGroup,
      tbmBase,
      user: {include: {TbmBase: {}}} as Prisma.UserFindManyArgs,
      tbmVehicle: {include: {TbmBase: {}}} as Prisma.TbmVehicleFindManyArgs,
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
