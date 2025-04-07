'use client'
import {GOOGLE_CONSTANTS} from '@app/(apps)/aquapot/(constants)/google-constants'
import {GoogleDrive_GeneratePdf} from '@app/api/google/actions/driveAPI'
import {GoogleSheet_BatchUpdate, GoogleSheet_copy} from '@app/api/google/actions/sheetAPI'
import {SheetRequests} from '@app/api/google/actions/SheetRequests'

import {Days, formatDate, getMidnight} from '@class/Days'

import React from 'react'
import {sheets_v4} from 'googleapis'
import {AQ_CONST} from '@app/(apps)/aquapot/(constants)/options'
import {aqCustomer} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomer'

export const showPdf = async ({customer, monthStr, data, defaultPaymentMethod, furikomisakiCD}) => {
  const furikomisaki = AQ_CONST.BANK_LIST[furikomisakiCD]

  const {bankName, branchName, accountType, accountNumber, accountHolder} = furikomisaki ?? {}
  const {companyName, name, invoiceNumber} = customer ?? {}
  const toName = companyName ? `${companyName} 御中` : `${name} 様`

  const {firstDayOfMonth} = Days.getMonthDatum(new Date(monthStr))

  let remarks = ''

  if (defaultPaymentMethod === '自動口座引落') {
    remarks = '口座振替は毎月27日（当日が金融機関休業日の場合は翌営業日）にご指定の口座より振替させて頂きます。'
  } else if (defaultPaymentMethod === '銀行振込') {
    remarks = '銀行振込'
  }

  const newFileName = [
    //
    '請求書',
    toName,
    formatDate(firstDayOfMonth),
  ].join(`_`)
  const {template, FOLDER_URL} = GOOGLE_CONSTANTS.invoice

  const maxRowCount = 17

  const SS_URL = template.SS_URL

  const requests: sheets_v4.Schema$Request[] = [
    SheetRequests.updateCell(0, 4, 0, toName),
    SheetRequests.updateCell(0, 9, 23, firstDayOfMonth),
    SheetRequests.updateCell(0, 10, 23, AQ_CONST.INVOICE_NUMBER),
    SheetRequests.updateCell(0, 11, 23, invoiceNumber ?? ''),
    ...new Array(maxRowCount).fill(0).map((_, idx) => {
      const {name, quantity, unitPrice, totalPrice, ratio} = data[idx] ?? {}
      const startIdx = 14
      const row = startIdx + idx

      return [
        {value: name, col: 0},
        {value: quantity, col: 12},
        {value: unitPrice, col: 15},
        {value: ratio / 100, col: 18},
        {value: totalPrice, col: 21},
      ]

        .map(({value = '', col}, colIdx) => {
          const sheetIdx = 0
          const request = SheetRequests.updateCell(sheetIdx, row, col, value)
          return request
        })
        .flat()
    }),

    SheetRequests.updateCell(0, 40, 2, remarks),
  ].flat()

  if (furikomisaki) {
    requests.push(
      SheetRequests.updateCell(0, 36, 0, '振込先'),
      SheetRequests.updateCell(0, 36, 2, bankName),
      SheetRequests.updateCell(0, 36, 7, branchName),
      SheetRequests.updateCell(0, 37, 2, accountType + ':' + accountNumber),
      SheetRequests.updateCell(0, 37, 7, accountHolder)
    )
  } else {
    requests.push(
      SheetRequests.updateCell(0, 36, 0, ''),
      SheetRequests.updateCell(0, 36, 2, ''),
      SheetRequests.updateCell(0, 36, 7, ''),
      SheetRequests.updateCell(0, 37, 2, ''),
      SheetRequests.updateCell(0, 37, 7, '')
    )
  }

  requests.push(SheetRequests.updateCell(0, 40, 2, remarks))

  const copiedSpreadSheet = await GoogleSheet_copy({
    fromSSId: SS_URL,
    destinationFolderId: 'https://drive.google.com/drive/folders/12l3qAiSCWcuJMndDyFQnZg10Kz-uRHj2?hl=ja',
    fileName: [
      //
      customer.companyName,
      customer.name,
      customer.jobTitle,
      formatDate(new Date(), 'YYYYMMDDHHmmss'),
    ].join(`_`),
  })

  await GoogleSheet_BatchUpdate({spreadsheetId: copiedSpreadSheet.id ?? '', requests})

  // PDF化して取得
  const res = await GoogleDrive_GeneratePdf({spreadsheetId: template.SS_URL})
  const blob = new Blob([Uint8Array.from(atob(res.pdfData ?? ''), c => c.charCodeAt(0))], {
    type: 'application/pdf',
  })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
