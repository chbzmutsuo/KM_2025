'use client'

import {
  GoogleSheet_BatchUpdate,
  GoogleSheet_copy,
  GoogleSheet_getSheetByName,
  GoogleSheet_Read,
} from '@app/api/google/actions/sheetAPI'

import {GoogleDrive_UpsertFolder} from '@app/api/google/actions/driveAPI'
import {formatDate} from '@class/Days'
import {SheetRequests} from '@app/api/google/actions/SheetRequests'
import {sleep} from '@lib/methods/common'
import {ChartDataType} from '@app/(apps)/apex/(pages)/[simulationId]/page'

export const handleGetResult = async ({SS_CONSTANTS, spreadsheetId, questions, setChartData}) => {
  // ==============シートのコピー===============
  const folderName = [SS_CONSTANTS.title, '結果'].join('_')
  const parentFolderId = await GoogleDrive_UpsertFolder({
    parentFolderId: 'https://drive.google.com/drive/folders/1hXHRnBQgeiEzdKJEtjZ4g5wiODpvO4o0',
    folderNameToFind: folderName,
  })

  if (!parentFolderId) return alert(`parentFolderIdが見つかりません`)

  const newSpreadsheet = await GoogleSheet_copy({
    fromSSId: spreadsheetId,
    destinationFolderId: parentFolderId,
    fileName: [SS_CONSTANTS.title, formatDate(new Date(), 'YYYYMMDDHHmmss')].join(`_`),
  })

  const newSpreadsheetId = newSpreadsheet.id
  if (!newSpreadsheetId) return alert(`newSpreadsheetIdが見つかりません`)

  const sheetId =
    (await GoogleSheet_getSheetByName({spreadsheetId: newSpreadsheetId, sheetName: '質問'}))?.properties?.sheetId ?? 0

  if (!sheetId) return alert(`sheetIdxが見つかりません`)
  const requests = (questions ?? []).map((item, idx) => {
    const colIdx = 2
    const rowNum = idx + 1

    return SheetRequests.updateCell(sheetId, rowNum, colIdx, Number(item.answer))
  })

  // ==============コピーしたシートへ書き込み===============
  await GoogleSheet_BatchUpdate({spreadsheetId: newSpreadsheetId, requests})

  await sleep(1000 * 3)

  const res = await GoogleSheet_Read({range: `結果!E2:I12`, spreadsheetId: newSpreadsheetId})

  const header = ['手取り額（社長）', `手取り額（法人）`, '税金（社長・法人）', '社会保険料（社長・法人）']

  let tedori = {}
  let hoshu = {}

  const rows = res.values
    ?.map(item => {
      const toNumItem = item.map(v => {
        const deleteComma = v.replace(/,/g, '')
        return isNaN(Number(deleteComma)) ? deleteComma : Number(deleteComma)
      })
      const [before, after, diff, colorCode, type] = toNumItem

      if (type === '中央') {
        tedori = {before, after, diff, colorCode, type}
        return {}
      }
      if (type === '報酬') {
        hoshu = {before, after, diff, colorCode, type}
        return {}
      }

      return {before, after, diff, colorCode, type}
    })
    .filter(item => item.type)
    .map((item, index) => {
      const label = header[index]
      return {label, ...item}
    })

  // チャートデータをセット
  setChartData({rows, tedori, hoshu} as ChartDataType)
}
