import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {NextResponse} from 'next/server'

export const POST = async () => {
  let sortOrderAll = 1

  const transactionQueryList: transactionQuery[] = []
  const {result} = await fetchUniversalAPI(`tsConstruction`, `findMany`, {
    orderBy: [{id: `asc`}],
    include: {
      TsWorkContent: {
        orderBy: [{createdAt: `asc`}],
      },
    },
  })

  result.forEach((construction, index) => {
    const {TsWorkContent} = construction
    TsWorkContent.forEach((workContent, index) => {
      const {sortOrder} = workContent

      transactionQueryList.push({
        model: `tsWorkContent`,
        method: `update`,
        queryObject: {
          where: {id: workContent.id},
          data: {sortOrder: sortOrderAll},
        },
      })

      sortOrderAll += 1
    })
  })

  await fetchTransactionAPI({transactionQueryList})
  return NextResponse.json({})
}
