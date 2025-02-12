import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const tsNippo: Prisma.TsNippoFindManyArgs = {
      include: {
        MidTsNippoUser: {
          include: {User: {}},
        },
        MidTsNippoTsRegularSubcontractor: {
          include: {TsRegularSubcontractor: {}},
        },
        MidTsNippoTsSubcontractor: {
          include: {TsSubcontractor: {}},
        },
        MidTsNippoTsMachinery: {
          include: {TsMachinery: {}},
        },
        MidTsNippoTsMaterial: {
          include: {TsMaterial: {}},
        },
        MidTsNippoTsWorkContent: {
          include: {TsWorkContent: {}},
        },
        TsNippoRemarks: {},
        TsNippMannualWorkContent: {},
      },
    }
    const tsConstruction: Prisma.TsConstructionFindManyArgs = {
      include: {
        TsWorkContent: {},
        TsMainContractor: {},
        TsNippo: {
          include: tsNippo.include,
          orderBy: [{date: 'asc'}],
        },
        TsConstructionSubConUserMidTable: {
          include: {User: {}},
        },
      },
    }
    const tsMainContractor: Prisma.TsMainContractorFindManyArgs = {
      include: {
        TsConstruction: {},
      },
    }

    const include: {[key in PrismaModelNames]?: any} = {
      tsMainContractor,
      tsConstruction,
      tsNippo,
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
