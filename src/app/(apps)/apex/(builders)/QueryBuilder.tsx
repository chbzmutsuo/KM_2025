import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const include: {[key in PrismaModelNames]?: any} = {}

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({parentName: key, parentObj: include[key]})
    })

    return include
  }
}
