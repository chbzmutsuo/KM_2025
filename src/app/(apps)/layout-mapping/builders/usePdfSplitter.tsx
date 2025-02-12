/* eslint-disable @next/next/no-img-element */
import {PDFDocument} from 'pdf-lib'
import React, {useState} from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.entry'
import {C_Stack} from '@components/styles/common-components/common-components'
import Loader from '@components/utils/loader/Loader'
import {jotai_pdfImages, jotai_pdfPages, useJotai} from '@hooks/useJotai'
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`

export default function usePdfSplitter() {
  const [pdfPages, setpdfPages] = useJotai(jotai_pdfPages)

  const [images, setimages] = useJotai(jotai_pdfImages)
  const reset = () => {
    setpdfPages([])
    setimages([])
  }

  const PDFSplitter = () => {
    const [loading, setloading] = useState(false)
    // データURIをBlobに変換するユーティリティ関数

    const handleFileChange = async event => {
      const file = event.target.files[0]
      if (file && file.type === 'application/pdf') {
        const reader = new FileReader()
        reader.onload = async (e: any) => {
          const originalPdfBytes = e.target.result
          const originalPdf = await PDFDocument.load(originalPdfBytes)
          const pages: Blob[] = []
          const pageImages: string[] = []

          // pdfjs-dist を使って PDF をロード
          const pdfJsDoc = await pdfjsLib.getDocument({data: originalPdfBytes}).promise

          for (let i = 0; i < originalPdf.getPageCount(); i++) {
            // PDF-lib を使ってページごとに分割
            const newPdf = await PDFDocument.create()
            const [copiedPage] = await newPdf.copyPages(originalPdf, [i])
            newPdf.addPage(copiedPage)
            const pdfBytes = await newPdf.save()
            const blob = new Blob([pdfBytes], {type: 'application/pdf'})
            pages.push(blob)

            // pdfjs-dist を使ってページを画像化
            const page = await pdfJsDoc.getPage(i + 1) // pdfjs-dist は 1-indexed
            const viewport = page.getViewport({scale: 1})
            const canvas = document.createElement('canvas')
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const context = canvas.getContext('2d')!
            canvas.width = viewport.width
            canvas.height = viewport.height

            await page.render({canvasContext: context, viewport}).promise

            const imageUrl = canvas.toDataURL('image/png') // Base64 データ URL を生成
            pageImages.push(imageUrl)
          }

          setpdfPages(pages) // 分割された PDF をセット
          setimages(pageImages) // 各ページの画像をセット
        }

        reader.readAsArrayBuffer(file)
      } else {
        alert('Please upload a valid PDF file.')
      }
    }

    return (
      <>
        {loading && <Loader />}
        <C_Stack className={`items-center`}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />

          <div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px'}}>
              {images.map((src, index) => {
                // Create a canvas to render the page

                return (
                  <div key={index}>
                    <img src={src} alt={`Page ${index + 1}`} style={{maxWidth: '200px', maxHeight: '300px'}} />
                  </div>
                )
              })}
            </div>
          </div>
        </C_Stack>
      </>
    )
  }

  return {PDFSplitter, pdfPages, images, reset}
}
