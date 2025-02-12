import {requestResultType} from '@cm/types/types'
import {fetchAlt} from '@lib/methods/api-fetcher'
import {basePath} from 'src/cm/lib/methods/common'

export type attachment = {
  filename: string
  content: string
}
export const knockEmailApi = async (props: {
  subject: string
  text: string
  to?: string[]
  cc?: string[]
  html?: string
  attachments?: attachment[]
}) => {
  // メールを送付する。
  const res: requestResultType = await fetchAlt(`${basePath}/api/nodemailer`, props)
  return res
}
