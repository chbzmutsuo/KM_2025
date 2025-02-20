import PdfRenderer from '@app/(apps)/aquapot/(pages)/myPage/[id]/pdf/[month]/PdfRenderer'
import {getCustomerDataWithSales} from '@app/(apps)/aquapot/(pages)/myPage/getCustomerDataWithSales'
import {Days} from '@class/Days'
import React from 'react'

export default async function page(props: {searchParams: any; params: any}) {
  const query = await props.searchParams
  const params = await props.params

  const userId = Number(params.id)
  const month = params.month
  const {firstDayOfMonth, lastDayOfMonth} = Days.getMonthDatum(new Date(month + `-01`))

  const {customer, salesByMonth} = await getCustomerDataWithSales({
    userId,
    query,
  })

  const saleRecordOnThisMonth = salesByMonth[month]
  return <PdfRenderer {...{saleRecordOnThisMonth}} />
}
