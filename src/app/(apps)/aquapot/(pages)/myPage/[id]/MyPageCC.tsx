'use client'

import {Days, formatDate, getMidnight} from '@class/Days'
import {DH} from '@class/DH'
import {C_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import useGlobal from '@hooks/globalHooks/useGlobal'

import React from 'react'
import {TextGray} from '@components/styles/common-components/Alert'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {showPdf} from '@app/(apps)/aquapot/(pages)/myPage/[id]/pdf/[month]/showPdf'
import Loader from '@components/utils/loader/Loader'

export default function MyPageCC(props: {customer: any; salesByMonth: any}) {
  const {toggleLoad} = useGlobal()
  const {customer, salesByMonth} = props

  const {data: customerList} = usefetchUniversalAPI_SWR(`aqCustomer`, `findMany`, {
    where: {
      name: {contains: '今村'},
      // id: customer.id
    },
  })

  const customerData = customerList?.[0]

  const {data: payment} = usefetchUniversalAPI_SWR(`aqCustomer`, `findMany`, {distinct: [`defaultPaymentMethod`]})

  const {defaultPaymentMethod, furikomisakiCD} = customerData ?? {}

  if (!customerList) return <Loader />

  return (
    <C_Stack>
      <div>{customerData?.name}</div>
      <div>{customerData?.defaultPaymentMethod}</div>
      {!!Object.keys(salesByMonth).length &&
        CsvTable({
          records: Object.keys(salesByMonth).map((monthStr, idx) => {
            const sales = salesByMonth[monthStr]
            const total = sales.reduce((acc, sale) => acc + sale.taxedPrice, 0)
            const show = true

            const monthData = Days.getMonthDatum(new Date(monthStr + `-01`))

            const data = sales.map(sale => {
              const {price, taxedPrice, AqProduct, quantity, remarks} = sale

              const unitPrice = price / quantity

              const {name, taxRate} = AqProduct ?? {}
              const data = {
                name,
                quantity,
                unitPrice,
                ratio: taxRate,
                totalPrice: taxedPrice,
              }

              return data
            })

            const rechedEndOmMonth = getMidnight() >= monthData.lastDayOfMonth

            return {
              csvTableRow: [
                //
                // {label: `請求先名`, cellValue: `請求先名`},
                {label: `対象年月`, cellValue: formatDate(monthData.lastDayOfMonth, `.YY/MM`)},
                {label: `発行日`, cellValue: formatDate(monthData.lastDayOfMonth, `short`)},
                {label: `合計`, cellValue: DH.toPrice(total) + '円'},
                {
                  label: `請求書`,
                  cellValue: rechedEndOmMonth ? (
                    <button
                      className={`t-link`}
                      onClick={async () => {
                        toggleLoad(async () => await showPdf({customer, monthStr, data, defaultPaymentMethod, furikomisakiCD}))
                      }}
                    >
                      PDF
                    </button>
                  ) : (
                    <TextGray>月末発行</TextGray>
                  ),
                  // <Link href={`/aquapot/myPage/${params.id}/pdf/${monthStr}`}>
                  //   <R_Stack>
                  //     <Button>PDFダウンロード</Button>
                  //   </R_Stack>
                  // </Link>
                },
              ],
            }
          }),
        }).WithWrapper({size: `lg`})}
    </C_Stack>
  )
}
