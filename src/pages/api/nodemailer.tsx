import {isDev} from '@lib/methods/common'
import nodemailer from 'nodemailer'

export default async function sendEmail(req, res) {
  const {body} = req
  let {to} = body
  const {subject, text, attachments = [], html} = body

  const originalTo = to
  to = isDev ? [`411.mutsuo@gmail.com`] : [...to]
  if (isDev) {
    const result = {
      to: originalTo.join(`,`),
      subject,
      text,
      attachments,
      html,
    }

    console.debug(result)

    return res.json({
      success: true,
      message: '開発環境メール',
      result,
    })
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
    return res.json({
      success: true,
      message: 'メールを送信しました',
      result: {
        accepted: result.accepted,
        rejected: result.rejected,
        messageSize: result.messageSize,
        envelope: result.envelope,
      },
    })
  } catch (error) {
    transporter.close()
    console.error(error.stack)
    return res.json({
      success: false,
      message: error.message,
      result: error,
    })
  }
}
