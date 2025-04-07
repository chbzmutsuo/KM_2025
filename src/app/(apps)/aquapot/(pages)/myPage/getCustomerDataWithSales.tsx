import {Days, formatDate, toJst, toUtc} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {AqSaleRecord, AqPriceOption, AqSaleCart} from '@prisma/client'

export const getCustomerDataWithSales = async ({userId, query}) => {
  const selectedYearStr = query.from ?? query.month

  const selectedYear = selectedYearStr ? toUtc(selectedYearStr) : toUtc()

  const {firstDateOfYear, lastDateOfYear} = Days.getYearDatum(toJst(selectedYear).getFullYear())

  const dateWhere = {
    gte: firstDateOfYear,
    lt: lastDateOfYear,
  }

  const {result: customer} = await fetchUniversalAPI(`aqCustomer`, `findUnique`, {
    where: {id: userId},
    include: {
      AqSaleCart: {
        where: {
          AqSaleRecord: {
            some: {
              date: dateWhere,
            },
          },
        },
        include: {
          AqSaleRecord: {
            include: {AqProduct: {}},

            // include: {AqPriceOption: {}},
          },
        },
      },
    },
  })

  const salesByMonth = {}
  customer.AqSaleCart?.forEach((cart: AqSaleCart & {AqSaleRecord: SaleRecord[]}) => {
    cart.AqSaleRecord.forEach(sale => {
      const month = formatDate(sale.date, `YYYY-MM`)
      if (!salesByMonth[month]) {
        salesByMonth[month] = []
      }
      salesByMonth[month].push(sale)
    })
  })

  return {customer, salesByMonth}
}

export type Cart = AqSaleCart & {
  AqSaleRecord: SaleRecord[]
}
export type SaleRecord = AqSaleRecord & {
  AqPriceOption: AqPriceOption
}

export type salesByMonth = {
  [key: string]: SaleRecord[]
}
