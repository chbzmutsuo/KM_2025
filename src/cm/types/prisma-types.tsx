import {PrismaClient} from '@prisma/client'

export type prismaMethodType =
  | 'findMany'
  | 'findFirst'
  | 'findUnique'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'update'
  | 'create'
  | 'createMany'
  | 'updateMany'
  | 'groupBy'
  | 'aggregate'

export type PrismaClientOrigin = keyof import('.prisma/client').PrismaClient

export type excluded = Exclude<
  PrismaClientOrigin,
  | '$connect'
  | '$disconnect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$extends'
  | '$on'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$use'
  | '$transaction'
> &
  string
// type ConvertToString<T> = T extends string ? T : string
// export type PrismaModelNames = ConvertToString<excluded> & string
export type PrismaModelNames = excluded
export type extendedPrismaClient = PrismaClient & {[key in PrismaModelNames]: any}

type CapitalizedPrismaModelNames = keyof {
  [K in PrismaModelNames as Capitalize<K>]: any
}

type prismaInclude = {[key in CapitalizedPrismaModelNames]?: any}
export type prismaArgs = any

// export type prismaArgs = {
//   distinct?: any[]
//   select?: prismaInclude
//   where?: any
//   orderBy?: {[key: string]: 'asc' | 'desc'}[]
//   skip?: any
//   take?: any
//   include?: prismaInclude
//   create?: any
//   update?: any
// } & anyObject
