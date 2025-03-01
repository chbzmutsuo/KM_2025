import {TextRed} from '@components/styles/common-components/Alert'
import {C_Stack, CenterScreen, R_Stack} from '@components/styles/common-components/common-components'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {addQuerySentence} from '@lib/methods/urls'
import Link from 'next/link'
import React from 'react'

export default async function Page() {
  const {result} = await fetchUniversalAPI(`aqCustomerRecord`, `aggregate`, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    select: {_count: true},
    where: {status: `対応中`},
  })

  return (
    <CenterScreen>
      <C_Stack className={` items-center gap-8`}>
        <h1>メニューを選択してください</h1>

        <Link href={`/aquapot/aqCustomerRecord` + addQuerySentence({customerStatus: '対応中'})}>
          <R_Stack className={`gap-1`}>
            <span>対応中の顧客記録が</span>
            <TextRed>{result?._count.id}</TextRed>
            <span>件あります。</span>
          </R_Stack>
        </Link>
      </C_Stack>
    </CenterScreen>
  )
}
