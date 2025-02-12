import {NextRequest, NextResponse} from 'next/server'
import {v4 as uuidv4} from 'uuid'

export const POST = async (req: NextRequest) => {
  const response = await fetch('https://httpbin.org/ip')
  const IP = await response.json()
  console.log({IP})

  const apiToken = '504DE1EF5C4869C61CE1758D4C896CCDE3E0FCD77FE9BC511325F6AEA6B151' // APIトークン
  // const fromNumber = '0366936936'; // 送信元電話番号
  const toNumber = '08019145919' // 送信先電話番号
  const message = 'テストメッセージです。' // 送信するメッセージ
  const url = 'https://sms-console.cuenote.jp/v9/delivery' // cue note API v9 エンドポイント
  const username = `6706050d36dbf23d2c1ed650` // Your username
  const password = '504DE1EF5C4869C61CE1758D4C896CCDE3E0FCD77FE9BC511325F6AEA6B151' // Your password. If you are using an API key as password, include it here.

  const payload = {
    to: {
      number: [toNumber], // 配送先電話番号を配列で指定 (複数指定可能)
    },
    content: {
      message: message,
      shortURI: true, // 必要に応じて変更
      clickURI: true, // 必要に応じて変更
    },
    timeLimit: 4320, // 配信期限（分）省略可、省略時は4320分
    //  'scheduledAt': 'YYYY-MM-DDThh:mm:ss+09:00' //  配信予約日時。省略時は即時配信
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': uuidv4(), // 重複送信防止のためのUUID
      },
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(res => res)
    // .then(res => {
    //   if (res.ok) {
    //     return NextResponse.json({
    //       success: true,
    //       message: 'メッセージ送信に成功しました。',
    //       result: res,
    //     })
    //   } else {
    //     return NextResponse.json({
    //       success: false,
    //       message: 'メッセージ送信に失敗しました。',
    //       result: res,
    //     })
    //   }
    // })
    return NextResponse.json({
      success: false,
      message: 'メッセージ送信に失敗しました。',
      result: response,
    })
  } catch (error) {
    console.error('エラーが発生しました: ' + error)
    return NextResponse.json(error, {status: 500})
  }
}
