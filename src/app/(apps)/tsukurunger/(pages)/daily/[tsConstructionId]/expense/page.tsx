import ExpenseCC from '@app/(apps)/tsukurunger/(pages)/daily/[tsConstructionId]/expense/ExpenseCC'

import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import React from 'react'
import {P_TsConstruction} from 'scripts/generatedTypes'

export default async function Page(props) {
  const params = await props.params;
  const tsConstructionId = Number(params.tsConstructionId)
  const include = QueryBuilder.getInclude({}).tsConstruction.include
  const {result: TsConstruction = {} as P_TsConstruction} = await fetchUniversalAPI(`tsConstruction`, `findUnique`, {
    where: {id: tsConstructionId},
    include,
  })

  return <ExpenseCC {...{TsConstruction}}></ExpenseCC>
}
