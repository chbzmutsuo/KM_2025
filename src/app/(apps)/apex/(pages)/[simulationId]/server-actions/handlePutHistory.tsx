import {HISTORY_SS} from '@app/(apps)/apex/(constants)/SPREADSHEET_CONST'
import {} from '@app/(apps)/apex/(pages)/[simulationId]/page'
import {GoogleSheet_Append, GoogleSheet_getSheetByNameOrCreate} from '@app/api/google/actions/sheetAPI'
import {formatDate} from '@class/Days'

export const handlePutHistory = async ({SS_CONSTANTS, questions}) => {
  await GoogleSheet_getSheetByNameOrCreate({
    spreadsheetId: HISTORY_SS.url,
    sheetName: SS_CONSTANTS.title,
  })
  const quetionAnswers = questions?.map(q => q.answer) ?? []

  const answerRow: any[] = [formatDate(new Date(), 'YYYY/MM/DD HH:mm:ss'), ...quetionAnswers]
  await GoogleSheet_Append({
    spreadsheetId: HISTORY_SS.url,
    range: `${SS_CONSTANTS.title}!A1`,
    values: [answerRow],
  })
}
