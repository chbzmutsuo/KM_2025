export {}

// import {NextResponse} from 'next/server'
// import FormData from 'form-data'
// import crypto from 'crypto'

// export const POST = async (req: Request) => {
//   const body = await req.json()

//   const authOptions: any = {
//     appKey: process.env.TWITTER_CONSUMER_KEY,
//     appSecret: process.env.TWITTER_CONSUMER_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   }

//   // OAuth 1.0aの認証ヘッダーを生成する関数
//   const generateAuthHeader = (method: string, url: string, params = {}) => {
//     const nonce = Math.random().toString(36).substring(2)
//     const timestamp = Math.floor(Date.now() / 1000)

//     const oauthParams = {
//       oauth_consumer_key: authOptions.appKey,
//       oauth_nonce: nonce,
//       oauth_signature_method: 'HMAC-SHA1',
//       oauth_timestamp: timestamp,
//       oauth_token: authOptions.accessToken,
//       oauth_version: '1.0',
//     }

//     // 署名の生成
//     const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
//       Object.entries({...params, ...oauthParams})
//         .sort()
//         .map(([key, value]) => `${key}=${value}`)
//         .join('&')
//     )}`

//     const signingKey = `${encodeURIComponent(authOptions.appSecret)}&${encodeURIComponent(authOptions.accessSecret)}`
//     const signature = crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64')

//     return `OAuth ${Object.entries({
//       ...oauthParams,
//       oauth_signature: signature,
//     })
//       .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
//       .join(', ')}`
//   }

//   // メディアアップロード関数
//   async function uploadMedia(buffer: Buffer, mediaType: string) {
//     try {
//       const formData = new FormData()

//       // Buffer形式でappendする
//       formData.append('media', buffer, {
//         filename: 'media',
//         contentType: mediaType,
//         knownLength: buffer.length,
//       })

//       const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json'
//       const authHeader = generateAuthHeader('POST', uploadUrl)

//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: authHeader,
//           ...formData.getHeaders(), // form-dataのヘッダーを追加
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new Error(`メディアのアップロードに失敗しました: ${errorText}`)
//       }

//       const data = await response.json()
//       return data.media_id_string
//     } catch (error) {
//       console.error('メディアのアップロードに失敗しました:', error)
//       throw error
//     }
//   }

//   // メイート投稿関数
//   async function postTweet(text: string, mediaIds?: string[]) {
//     try {
//       const tweetUrl = 'https://api.twitter.com/2/tweets'
//       const authHeader = generateAuthHeader('POST', tweetUrl)

//       const tweetData: any = {text}
//       if (mediaIds?.length) {
//         tweetData.media = {media_ids: mediaIds}
//       }

//       const response = await fetch(tweetUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: authHeader,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(tweetData),
//       })

//       if (!response.ok) {
//         throw new Error(`ツイートの投稿に失敗しました: ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error('ツイートの投稿に失敗しました:', error)
//       throw error
//     }
//   }

//   try {
//     // テキストのみの投稿
//     await postTweet(body.text)

//     // 画像のアップロード
//     if (body.imageBuffer) {
//       const imageMediaId = await uploadMedia(body.imageBuffer, 'image/jpeg')
//       await postTweet(body.text, [imageMediaId])
//     }

//     // 動画付きの投稿
//     if (body.videoBuffer) {
//       const videoMediaId = await uploadMedia(body.videoBuffer, 'video/mp4')
//       await postTweet(body.text, [videoMediaId])
//     }

//     return NextResponse.json({success: true, message: 'ツイートを投稿しました'})
//   } catch (error) {
//     console.error('エラーが発生しました:', error)
//     return NextResponse.json({success: false, message: error.message}, {status: 500})
//   }
// }
