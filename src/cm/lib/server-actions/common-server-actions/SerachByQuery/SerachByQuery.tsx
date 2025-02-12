'use server'

import prisma, {commonOmit} from 'src/cm/lib/prisma'
import {anyObject} from '@cm/types/types'
import {PrismaModelNames} from '@cm/types/prisma-types'

export const searchByQuery = async (props: {
  modelName: PrismaModelNames
  include?: anyObject
  where?: anyObject
  orderBy?: anyObject[]
  skip?: number
  take?: number
  select?: anyObject
  omit?: anyObject
}) => {
  const {modelName, where, include, orderBy = [], skip, take, select, omit = {...commonOmit}} = props

  let selectOrInclude
  if (include) {
    selectOrInclude = {
      include: select ? undefined : {...include},
      omit: select ? undefined : {...omit},
    }
  }

  if (select) {
    selectOrInclude = {select: {...select}}
  }

  const model = prisma[modelName] as any
  let totalCount = await model.aggregate({
    where: where,
    select: {_count: true},
  })
  totalCount = totalCount?._count.id

  const query = {
    where: where,
    skip: Math.max(0, Math.min(skip ?? 0, totalCount - 1)),
    take: take ?? undefined,
    orderBy: [...orderBy, {sortOrder: 'asc'}, {id: 'asc'}],

    ...selectOrInclude,
  }

  const records = await model.findMany({...query})

  return {records, totalCount}
}
