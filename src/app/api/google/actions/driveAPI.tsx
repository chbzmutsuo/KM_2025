'use server'

import {convert_GoogleURL_to_ID} from '@app/api/google/actions/convert_GoogleURL_to_ID'
import {getAuth} from '@app/api/google/actions/getAuth'
import {google} from 'googleapis'
import {Readable} from 'stream'

export const GoogleDrive_GeneratePdf = async (props: {spreadsheetId: string; parentFolderId?: string; pdfName?: string}) => {
  const {pdfName = 'created by system'} = props
  const spreadsheetId = convert_GoogleURL_to_ID(props.spreadsheetId)

  const auth = getAuth()
  const drive = google.drive({version: 'v3', auth})

  const res = await drive.files.export(
    //

    {fileId: spreadsheetId, mimeType: 'application/pdf'},
    {responseType: 'arraybuffer'}
  )

  const {data, config} = res

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`

  const pdfBase64 = Buffer.from(data as ArrayBuffer).toString('base64')
  const parentFolderId = convert_GoogleURL_to_ID(props.parentFolderId ?? '')

  if (parentFolderId) {
    try {
      const uploadResponse = await drive.files.create({
        supportsAllDrives: true,
        requestBody: {
          name: `${pdfName}.pdf`,
          mimeType: 'application/pdf',
          parents: [parentFolderId], // 保存先フォルダID
        },
        media: {
          mimeType: 'application/pdf',
          body: Readable.from(Buffer.from(pdfBase64, 'base64')),
        },
        fields: 'id,name,webViewLink',
      })

      return {
        spreadsheetUrl,
        pdfData: pdfBase64,
        uploadResponse,
      }
    } catch (error) {
      console.error(error.stack) //////////
      console.error(`エラー`)
      return {
        spreadsheetUrl,
        pdfData: pdfBase64,
      }
    }
  } else {
    return {
      spreadsheetUrl,
      pdfData: pdfBase64,
    }
  }
}

export const GoogleDrive_CopyFile = async (props: {fileId: string; newName: string; parentFolderId: string}) => {
  const fileId = convert_GoogleURL_to_ID(props.fileId)

  const parentFolderId = convert_GoogleURL_to_ID(props.parentFolderId)
  const {newName} = props
  const auth = getAuth()
  const drive = google.drive({version: 'v3', auth})

  const res = await drive.files.copy({
    fileId,
    supportsAllDrives: true,
    requestBody: {
      name: newName,
      parents: [parentFolderId],
    },
  })
  const {data, config} = res

  return data
}
