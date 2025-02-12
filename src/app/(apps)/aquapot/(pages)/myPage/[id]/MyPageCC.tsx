'use client'
import {GOOGLE_CONSTANTS} from '@app/(apps)/aquapot/(constants)/google-constants'
import {GoogleDrive_GeneratePdf} from '@app/api/google/actions/driveAPI'
import {GoogleSheet_BatchUpdate} from '@app/api/google/actions/sheetAPI'
import {SheetRequests} from '@app/api/google/actions/SheetRequests'

import {Days, formatDate, getMidnight} from '@class/Days'
import {DH} from '@class/DH'
import {C_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import useGlobal from '@hooks/globalHooks/useGlobal'

import React from 'react'
import {sheets_v4} from 'googleapis'
import {TextGray} from '@components/styles/common-components/Alert'

export default function MyPageCC(props: {customer: any; salesByMonth: any}) {
  const {toggleLoad} = useGlobal()
  const {customer, salesByMonth} = props

  return (
    <C_Stack>
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
                        toggleLoad(async () => await showPdf({customer, monthStr, data}))
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

const showPdf = async ({customer, monthStr, data}) => {
  const {companyName, name, invoiceNumber} = customer ?? {}
  const toName = companyName ? `${companyName} 御中` : `${name} 様`

  const {firstDayOfMonth} = Days.getMonthDatum(new Date(monthStr))

  const newFileName = [
    //
    '請求書',
    toName,
    formatDate(firstDayOfMonth),
  ].join(`_`)
  const {template, FOLDER_URL} = GOOGLE_CONSTANTS.invoice
  // const copy = await GoogleDrive_CopyFile({
  //   fileId: template.SS_URL,
  //   newName: newFileName,
  //   folderId: FOLDER_URL,
  // })

  const maxRowCount = 17

  const SS_URL = template.SS_URL

  const requests: sheets_v4.Schema$Request[] = [
    SheetRequests.updateCell(0, 4, 0, toName),
    SheetRequests.updateCell(0, 9, 23, firstDayOfMonth),
    SheetRequests.updateCell(0, 10, 23, '請求書番号'),
    SheetRequests.updateCell(0, 11, 23, invoiceNumber ?? ''),
    ...new Array(maxRowCount).fill(0).map((_, idx) => {
      const {name, quantity, unitPrice, totalPrice, ratio} = data[idx] ?? {}
      const startIdx = 14
      const row = startIdx + idx
      return [
        {value: name, col: 0},
        {value: quantity, col: 12},
        {value: unitPrice, col: 15},
        {value: ratio, col: 18},
        {value: totalPrice, col: 21},
      ]
        .map(({value = '', col}, colIdx) => {
          const sheetIdx = 0
          const request = SheetRequests.updateCell(sheetIdx, row, col, value)
          return request
        })
        .flat()
    }),
  ].flat()

  await GoogleSheet_BatchUpdate({spreadsheetId: SS_URL ?? '', requests})

  // PDF化して取得
  const res = await GoogleDrive_GeneratePdf({spreadsheetId: template.SS_URL})
  const blob = new Blob([Uint8Array.from(atob(res.pdfData ?? ''), c => c.charCodeAt(0))], {
    type: 'application/pdf',
  })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
