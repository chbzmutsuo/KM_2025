import {includeProps, roopMakeRelationalInclude} from '@cm/class/builders/QueryBuilderVariables'
import {Prisma} from '@prisma/client'

export class QueryBuilder {
  static getInclude = (includeProps: includeProps) => {
    const user = {
      include: {
        SohkenCar: {},
      },
    }
    const sohkenCar = {
      include: {
        User: {},
      },
    }

    const genbaDay: Prisma.GenbaDayFindManyArgs = {
      include: {
        Genba: {
          include: {
            PrefCity: {},
            GenbaDay: {
              include: {GenbaDayTaskMidTable: {}},
              orderBy: {date: 'asc'},
            },
            GenbaDayShift: {
              include: {
                GenbaDay: {
                  include: {GenbaDayTaskMidTable: {}},
                },
              },
            },
          },
        },

        GenbaDayShift: {
          include: {
            GenbaDay: {},
            User: user,
          },
        },
        GenbaDaySoukenCar: {
          include: {SohkenCar: {}},
        },
        GenbaDayTaskMidTable: {
          include: {
            GenbaTask: {},
          },
        },
      },
    }
    const genba: Prisma.GenbaFindManyArgs = {include: {GenbaTask: {}}}
    // const userRole: Prisma.UserRoleFindManyArgs = {include: {RoleMaster: {}}}

    const include = {genbaDay, user, sohkenCar, genba}

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({
        parentName: key,
        parentObj: include[key],
      })
    })

    return include
  }
}
