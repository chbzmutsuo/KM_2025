import {google} from 'googleapis'
export const getAuth = () => {
  let credential = process.env.GOOGLE_SHEET_API_SERVICE_ACCOUNT_CREDENTIALS ?? ''

  credential = credential.replace(/: |\n/g, ':')
  const credentials = JSON.parse(credential)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
    ],
  })
  return auth
}
