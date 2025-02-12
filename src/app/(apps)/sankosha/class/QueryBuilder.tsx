import {
  includeProps,
  roopMakeRelationalInclude,
} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'

import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const sankoshaProcess: Prisma.SankoshaProcessFindManyArgs = {
      include: {
        SankoshaProductImage: {},
        SankoshaProductMaster: {},
        SankoshaSizeMaster: {},
        SankoShaEstimatePriceMasterTable: {},
        SankoshaClientA: {},
        SankoshaClientB: {},
        SankoshaClientC: {},
        SankoshaClientD: {},
        SankoshaClientE: {},
      },
    }
    const include: {[key in PrismaModelNames]?: any} = {
      sankoshaProcess,
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
