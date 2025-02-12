import {Prisma} from '@prisma/client'

export class Tsukurunger {
  static constants = () => {
    const getTsConstructionFullIncludeWithinCertainDatePeriod = ({whereQuery, tsConstructionId}) => {
      const result: Prisma.TsConstructionFindManyArgs = {
        include: {
          TsMainContractor: {},
          TsNippo: {
            where: {
              date: whereQuery,
            },
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
            },
          },
        },
      }
      return result
    }

    return {getTsConstructionFullIncludeWithinCertainDatePeriod}
  }
}
