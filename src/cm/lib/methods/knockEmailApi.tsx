'use server'

import nodemailer from 'nodemailer'
import {isDev, systemEmailTo} from 'src/cm/lib/methods/common'

export type attachment = {
  filename: string
  content: string
}
export const knockEmailApi = async (props: {
  subject: string
  text: string
  to: string[]
  cc?: string[]
  html?: string
  attachments?: attachment[]
}) => {
  let {to} = props
  const {subject, text, attachments = [], html} = props

  const originalTo = to
  to = isDev ? [systemEmailTo] : [...to]
  if (isDev) {
    const result = {
      to: originalTo.join(`,`),
      subject,
      text,
      attachments,
      html,
    }

    console.debug(result)

    return {success: true, message: '開発環境メール', result}
  }

  // const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = `システムによる自動送信<no-reply@example.com>`

  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    pool: true,
    secure: true, // SSL
    auth: {user, pass, from},
  }

  const transporter = nodemailer.createTransport(smtpConfig)

  try {
    const result = await transporter.sendMail({
      to,
      subject,
      text,
      html,
      attachments,
    })
    console.info(`メールを送信しました`, {
      result,
      text,
      to,
      subject,
    })
    transporter.close()
    return {
      success: true,
      message: 'メールを送信しました',
      result: {
        accepted: result.accepted,
        rejected: result.rejected,
        messageSize: result.messageSize,
        envelope: result.envelope,
      },
    }
  } catch (error) {
    transporter.close()
    console.error(error.stack)
    return {
      success: false,
      message: error.message,
      result: error,
    }
  }
}
