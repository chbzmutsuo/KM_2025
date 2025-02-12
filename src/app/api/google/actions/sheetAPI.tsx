'use server'

import {convert_GoogleURL_to_ID} from '@app/api/google/actions/convert_GoogleURL_to_ID'
import {getAuth} from '@app/api/google/actions/getAuth'
import {google, sheets_v4} from 'googleapis'

export const GoogleSheet_Read = async (props: {range: string; spreadsheetId: string}) => {
  const {range} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.values.get({spreadsheetId, range})
  const {data, config} = res
  return data
}

export const GoogleSheet_Update = async (props: {range: string; spreadsheetId: string; values: string[][]}) => {
  const {range, values} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {values},
  })

  return {success: true, result: {update: res}, message: `データを更新しました`}
}

export const GoogleSheet_Append = async (props: {range: string; spreadsheetId: string; values: string[][]}) => {
  const {range, values} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = getAuth()
  const sheets = google.sheets({version: 'v4', auth})
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {values},
  })
  const {data, config} = res
  return data
}

export const GoogleSheet_BatchUpdate = async (props: {spreadsheetId: string; requests: sheets_v4.Schema$Request[]}) => {
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)
  const auth = getAuth()
  const sheets = google.sheets({version: 'v4', auth})

  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {requests: props.requests},
  })

  const {data, config} = res
  return data
}
