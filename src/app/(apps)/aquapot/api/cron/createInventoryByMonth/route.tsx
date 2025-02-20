import {Days} from '@class/Days'
import prisma from '@lib/prisma'
import {doTransaction} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'
import {NextRequest, NextResponse} from 'next/server'

import {isCron} from 'src/non-common/serverSideFunction'

export const GET = async (req: NextRequest) => {
  console.log(req) //////logs
  if ((await isCron({req})) === false) {
    const res = {success: false, message: `Unauthorized`, result: null}
    const status = {status: 401, statusText: `Unauthorized`}
    return NextResponse.json(res, status)
  }
  let result

  const {firstDayOfMonth: yearMonth} = Days.getMonthDatum(new Date())
  const key = `${yearMonth.getFullYear()}-${yearMonth.getMonth()}`

  const productList = await prisma.aqProduct.findMany({
    where: {inInventoryManagement: true},
    include: {
      AqInventoryRegister: {},
      AqSaleRecord: {},
    },
  })

  const res = await doTransaction({
    transactionQueryList: productList.map(aqProduct => {
      const {AqInventoryRegister, AqSaleRecord, id: aqProductId} = aqProduct
      const totalPurchaseQuantity = AqInventoryRegister.reduce((acc, curr) => acc + curr.quantity, 0)
      const totalSaleQuantity = AqSaleRecord.reduce((acc, curr) => acc + curr.quantity, 0)
      const rest = Number(totalPurchaseQuantity - totalSaleQuantity)
      const queryObject: Prisma.AqInventoryByMonthUpsertArgs = {
        where: {key},
        create: {key, yearMonth, count: rest, aqProductId},
        update: {count: rest},
      }
      return {model: `aqInventoryByMonth`, method: `upsert`, queryObject}
    }),
  })

  return NextResponse.json(res)
}
