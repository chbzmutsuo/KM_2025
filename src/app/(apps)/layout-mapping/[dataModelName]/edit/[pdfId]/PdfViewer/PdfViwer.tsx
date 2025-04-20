'use client'

import {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'

import {C_Stack, Center, Padding} from '@components/styles/common-components/common-components'

import {useInitPdf} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/useInitPdf'
import {usePanAndZoomCanvas} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/usePanAndZoomCanvas'

import {useTools} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/useTools/useTools'

import PlaceHolder from '@components/utils/loader/PlaceHolder'

// ローカルに配置したpdf.worker.jsを指定
// GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

export default function PdfEditor({pdf, pdfUrl}) {
  const {pdfBlobUrl} = usePfgBlobUrl(pdfUrl)
  if (!pdfBlobUrl) return <PlaceHolder>Loading...</PlaceHolder>

  const Main = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null)

    // PDFを描画
    useInitPdf({pdfUrl: pdfBlobUrl, canvasRef, setFabricCanvas})

    // パンとズームのハンドラー
    const {ToolSelectorUI, LayerSelectorUI, panAndZoomAvailable} = useTools(fabricCanvas, 'fabric-canvas')
    usePanAndZoomCanvas(fabricCanvas, panAndZoomAvailable)

    return (
      <Padding>
        <Center>
          <div
            style={{
              position: 'relative',
              border: `2px solid gray`,
              width: `90vw`,
              height: `90vh`,
              margin: `auto`,
              overflow: `auto`,
            }}
          >
            <canvas ref={canvasRef} style={{display: `none`}} />
            {/* PDF.js用 */}
            <canvas id="fabric-canvas" /> {/* Fabric.js用 */}
          </div>
        </Center>

        <FixedWrapper {...{className: `h-[70vh] position-y-center left-[10px]   `}}>
          <C_Stack className={`gap-4 p-1`}>
            <LayerSelectorUI />
          </C_Stack>
        </FixedWrapper>
        <FixedWrapper {...{className: `w-[90vw] position-x-center !bottom-[10px]   `}}>
          <ToolSelectorUI />
        </FixedWrapper>
      </Padding>
    )
  }

  return <Main />
}

const FixedWrapper = (props: any) => {
  const {children, className} = props

  return (
    <div
      {...{
        className: `
          fixed   shadow-sm p-1 rounded-lg bg-gray-100  z-[999] ${className}`,
      }}
      //ツールボタン
    >
      {children}
    </div>
  )
}

const usePfgBlobUrl = (pdfUrl: string) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  const getCachedPdf = async (url: string): Promise<Response | null | undefined> => {
    if ('caches' in window) {
      const cache = await caches.open('pdf-cache-v1')
      return await cache.match(url)
    }
    return null
  }

  const fetchPdf = async (url: string): Promise<Blob> => {
    // キャッシュからPDFを取得
    const cachedPdf = await getCachedPdf(url)
    if (cachedPdf) {
      return await cachedPdf.blob()
    }

    // オンラインでPDFを取得し、キャッシュに保存
    const response = await fetch(url)
    if ('caches' in window) {
      const cache = await caches.open('pdf-cache-v1')
      cache.put(url, response.clone())
    }
    return await response.blob()
  }

  useEffect(() => {
    // クリーンアップ: オブジェクトURLを破棄
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  useEffect(() => {
    const loadPdf = async () => {
      const blob = await fetchPdf(pdfUrl)
      const blobUrl = URL.createObjectURL(blob)
      setPdfBlobUrl(blobUrl)
    }

    loadPdf().catch(error => console.error('Error loading PDF:', error))
  }, [pdfUrl])

  return {
    pdfBlobUrl,
  }
}
