import {Days} from '@class/Days'
import prisma from '@lib/prisma'
import {doTransaction} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'
import {NextRequest, NextResponse} from 'next/server'

import {isCron} from 'src/non-common/serverSideFunction'

export const GET = async (req: NextRequest) => {
  if ((await isCron({req})) === false) {
    const res = {success: false, message: `Unauthorized`, result: null}
    const status = {status: 401, statusText: `Unauthorized`}
    return NextResponse.json(res, status)
  }
  let result

  // 現在の日付から月の初日を取得し、yearMonthに格納
  const {firstDayOfMonth: yearMonth} = Days.getMonthDatum(new Date())

  // yearMonthの年と月をキーとして結合
  const key = `${yearMonth.getFullYear()}-${yearMonth.getMonth()}`

  const subscritpionList = await prisma.aqCustomerSubscription.findMany({
    include: {
      AqProduct: {},
      AqCustomer: {
        include: {
          AqCustomerPriceOption: {
            include: {AqPriceOption: {}},
          },
        },
      },
    },
  })

  doTransaction({
    transactionQueryList: subscritpionList.map(item => {
      const aqCustomerSubscriptionId = item.id
      const {AqProduct, AqCustomer, remarks} = item
      const {AqCustomerPriceOption} = item.AqCustomer

      const theAqCustomerPriceOption = AqCustomerPriceOption.find(p => p.aqProductId === AqProduct.id)?.AqPriceOption as any
      const price = theAqCustomerPriceOption?.price ?? 0

      const unique_aqCustomerId_aqProductId_subscriptionYearMonth = {
        aqCustomerId: AqCustomer.id,
        aqProductId: AqProduct.id,
        subscriptionYearMonth: yearMonth,
      }

      const payload = {
        date: yearMonth,
        quantity: 1,
        price,
        taxRate: AqProduct.taxRate,
        taxedPrice: price * (1 + AqProduct.taxRate / 100),
        remarks,
        subscriptionYearMonth: yearMonth,
      }

      const relations = {
        AqCustomerSubscription: {connect: {id: aqCustomerSubscriptionId}},
        AqPriceOption: theAqCustomerPriceOption?.id ? {connect: {id: theAqCustomerPriceOption.id}} : undefined,
        AqCustomer: {connect: {id: AqCustomer.id}},
        AqProduct: {connect: {id: AqProduct.id}},
      }

      const queryObject: Prisma.AqSaleRecordUpsertArgs = {
        where: {
          unique_aqCustomerId_aqProductId_subscriptionYearMonth,
        },
        create: {
          ...payload,
          ...relations,
          AqSaleCart: {
            create: {
              aqCustomerId: AqCustomer.id,
              date: yearMonth,
              paymentMethod: AqCustomer.defaultPaymentMethod ?? '',
            },
          },
        },
        update: {...payload, ...relations},
      }
      return {
        model: `aqSaleRecord`,
        method: `upsert`,
        queryObject,
      }
    }),
  })

  return NextResponse.json({})
}
