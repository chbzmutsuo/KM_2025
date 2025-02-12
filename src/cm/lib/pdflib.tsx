import * as fs from 'fs'

import {PDFDocument} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

import {basePath} from 'src/cm/lib/methods/common'

export const initPdfLib = async ({filePath}) => {
  // PDFを読み込む
  const existingPdfBytes = fs.readFileSync(filePath)

  // PDFドキュメントをロード
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  // フォント埋込のおまじない
  pdfDoc.registerFontkit(fontkit)

  //フォントを読み込んでバイト配列で保持
  const fontBytes = await fetch(`${basePath}/fonts/Nasu-Regular.ttf`).then(res => res.arrayBuffer())
  //フォント埋め込み
  const font = await pdfDoc.embedFont(fontBytes)

  // 全てのページを取得

  return {pdfDoc, font}
}
