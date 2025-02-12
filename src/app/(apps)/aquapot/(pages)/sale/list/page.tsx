import ListCC from '@app/(apps)/aquapot/(pages)/sale/list/ListCC'
import {Days, getMidnight, toUtc} from '@class/Days'

import {sql} from '@class/SqlBuilder/SqlBuilder'
import {useRawSql} from '@class/SqlBuilder/useRawSql'
import {FitMargin, Padding} from '@components/styles/common-components/common-components'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'

import React from 'react'

export default async function Page(props) {
  const query = await props.searchParams
  const MONTH = Days.getMonthDatum(getMidnight())
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({
    query,
    defaultWhere: {
      from: MONTH.firstDayOfMonth,
      to: MONTH.lastDayOfMonth,
    },
  })
  if (redirectPath) return <Redirector {...{redirectPath}} />

  let where = `sr.id IS NOT NULL`
  if (Object.keys(query).length > 0) {
    query.from ? (where += ` AND sr."date" >= '${toUtc(query.from).toISOString()}'`) : ``
    query.to ? (where += ` AND sr."date" <= '${toUtc(query.to).toISOString()}'`) : ``
    query.paymentMethod ? (where += ` AND sc."paymentMethod" = '${query.paymentMethod}'`) : ``
    const textContainKeys = [`customerNumber`, `companyName`, `jobTitle`, `name`]

    textContainKeys.forEach(key => {
      if (query[key]) {
        where += sql` AND c."${key}" LIKE '%${query[key]}%'`
      }
    })

    if (query.AqSupportGroupMaster) {
      where += sql` AND (
      ("csgmt"."from" <= sr."date" AND "csgmt"."to" >= sr."date" AND "sgm"."id" = '${query.AqSupportGroupMaster}')
      OR
      ("csgmt"."from" <= sr."date" AND "csgmt"."to" IS NULL AND "sgm"."id" = '${query.AqSupportGroupMaster}')
    )`
    }
  }

  const sqlString = sql`
SELECT
"sc"."id" AS "sale_cart_id",
"sc"."createdAt" AS "createdAt",
"sc"."date" AS "date",
"c"."name" AS "name",
"c"."jobTitle" AS "jobTitle",
"c"."companyName" AS "companyName",
"U"."name" AS "userName",
"p"."productCode" AS "productCode",
"p"."name" AS "productName",
"po"."name" AS "priceOption_Name",
"po"."price" AS "priceOption_Price",
"sr"."id" AS "sale_record_id",
"sr"."quantity" AS "quantity",
"sr"."price" AS "price",
"sr"."taxRate" AS "taxRate",
"sr"."taxedPrice" AS "taxedPrice",
"sr"."remarks" AS "remarks",
"sc"."paymentMethod" AS "paymentMethod",
  CASE
    WHEN "csgmt"."from" <= "sr"."date" AND "csgmt"."to" >= "sr"."date" THEN "sgm"."name"
    WHEN "csgmt"."from" <= "sr"."date" AND "csgmt"."to" IS NULL THEN "sgm"."name"
    ELSE NULL
  END AS "supportingGroup"
FROM
  "AqSaleCart" "sc"
LEFT  JOIN
  "AqSaleRecord" "sr" ON "sc"."id" = "sr"."aqSaleCartId"
LEFT JOIN
  "AqProduct" "p" ON "sr"."aqProductId" = "p"."id"
LEFT JOIN
  "AqCustomer" "c" ON "sr"."aqCustomerId" = "c"."id"
LEFT JOIN
  "AqCustomerSupportGroupMidTable" "csgmt" ON "c"."id" = "csgmt"."aqCustomerId"
LEFT JOIN
  "AqSupportGroupMaster" "sgm" ON "csgmt"."aqSupportGroupMasterId" = "sgm"."id"
LEFT JOIN "User" "U" ON "sc"."userId" = "U"."id"
LEFT JOIN "AqPriceOption" "po" ON "sr"."aqPriceOptionId" = "po"."id"
WHERE ${where}
order by
  "sc"."date" desc,
  "sc"."id" desc
`

  type record = {
    name: string
    jobTitle: string
    companyName: string
    sale_cart_id: number
    sale_cart_date: string
    paymentMethod: string
    sale_record_id: number
    sale_record_date: string
    quantity: number
    price: number
    product_name: string
    productCode: string
    email: string
    supportingGroup: string
    remarks: string
  }

  const records: record[] = (await useRawSql({sql: sqlString})).rows

  return (
    <Padding>
      <FitMargin>
        <ListCC {...{records}} />
      </FitMargin>
    </Padding>
  )
}
