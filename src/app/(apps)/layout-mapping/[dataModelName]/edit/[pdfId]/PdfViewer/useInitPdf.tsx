import {useEffect} from 'react'
import {fabric} from 'fabric'
import * as pdfjsLib from 'pdfjs-dist'

export function useInitPdf({pdfUrl, canvasRef, setFabricCanvas}) {
  const loadPdf = async () => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl)
    const pdf = await loadingTask.promise

    const page = await pdf.getPage(1)

    const viewport = page.getViewport({scale: 2})
    const canvasElement = canvasRef.current

    if (canvasElement) {
      // PDF.js用のCanvas設定
      const context = canvasElement.getContext('2d')

      // デバイスピクセル比を取得
      const devicePixelRatio = 1

      // Canvasのサイズをデバイスピクセル比に基づいて拡大
      canvasElement.width = viewport.width * devicePixelRatio
      canvasElement.height = viewport.height * devicePixelRatio

      // CSSのスタイルとしては元のサイズを維持
      canvasElement.style.width = `${viewport.width}px`
      canvasElement.style.height = `${viewport.height}px`

      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
        await page.render(renderContext).promise

        // Fabric.js CanvasにPDF背景を設定
        const fabricCanvasInstance = new fabric.Canvas('fabric-canvas', {
          width: viewport.width,
          height: viewport.height,
        })
        const pdfBackground = new fabric.Image(canvasElement, {
          selectable: true, // 背景画像を編集不可にする
        })
        fabricCanvasInstance.setBackgroundImage(pdfBackground, fabricCanvasInstance.renderAll.bind(fabricCanvasInstance))
        setFabricCanvas(fabricCanvasInstance)
      }
    }
  }
  useEffect(() => {
    loadPdf()
  }, [pdfUrl])

  return {
    loadPdf,
  }
}
