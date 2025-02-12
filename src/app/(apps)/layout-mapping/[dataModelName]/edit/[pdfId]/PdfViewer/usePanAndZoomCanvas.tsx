import {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'
import useWindowSize from '@hooks/useWindowSize'
import {isDev} from '@lib/methods/common'

export function usePanAndZoomCanvas(fabricCanvas: fabric.Canvas | null, panAndZoomAvailable: boolean) {
  const isTabletSize = useWindowSize().width < 1200
  const [lastPositions, setLastPositions] = useState<{x: number; y: number} | null>(null)
  const lastDistance = useRef(0)
  const isPanning = useRef(false)
  const isZooming = useRef(false)

  useEffect(() => {
    if (panAndZoomAvailable === false) return
    if (!fabricCanvas) return

    fabricCanvas.allowTouchScrolling = true

    const MIN_ZOOM = 0.5
    const MAX_ZOOM = 3.0
    const ZOOM_SENSITIVITY = 0.05
    const PINCH_THRESHOLD = 5

    const limitPan = () => {
      const transform = fabricCanvas.viewportTransform || [1, 0, 0, 1, 0, 0]
      const canvasWidth = fabricCanvas.getWidth() * fabricCanvas.getZoom()
      const canvasHeight = fabricCanvas.getHeight() * fabricCanvas.getZoom()

      const viewportWidth = fabricCanvas.width ?? 0
      const viewportHeight = fabricCanvas.height ?? 0

      const minX = Math.min(0, viewportWidth - canvasWidth)
      const minY = Math.min(0, viewportHeight - canvasHeight)

      transform[4] = Math.max(minX, Math.min(transform[4], 0))
      transform[5] = Math.max(minY, Math.min(transform[5], 0))

      fabricCanvas.setViewportTransform(transform)
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch1 = event.touches[0]
      const doubleFinger = event.touches[1]
      if (!doubleFinger && !isDev) return
      const touch2 = doubleFinger ? event.touches[1] : event.touches[0]

      setLastPositions({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      })

      lastDistance.current = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      isZooming.current = false
      isPanning.current = false
    }

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault()

      const touch1 = event.touches[0]
      const doubleFinger = event.touches[1]
      if (!doubleFinger && !isDev) return
      const touch2 = doubleFinger ? event.touches[1] : event.touches[0]

      const currentPositions = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      }

      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      )

      const distanceDelta = Math.abs(currentDistance - lastDistance.current)

      if (distanceDelta > PINCH_THRESHOLD) {
        isZooming.current = true
        isPanning.current = false

        const zoomFactor = currentDistance / lastDistance.current
        const currentZoom = fabricCanvas.getZoom()
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom * zoomFactor))

        const point = new fabric.Point(currentPositions.x, currentPositions.y)
        fabricCanvas.zoomToPoint(point, newZoom)
        lastDistance.current = currentDistance
      } else {
        isZooming.current = false
        isPanning.current = true

        setLastPositions(prev => {
          if (!prev) return currentPositions

          const deltaX = currentPositions.x - prev.x
          const deltaY = currentPositions.y - prev.y

          const transform = fabricCanvas.viewportTransform || [1, 0, 0, 1, 0, 0]
          transform[4] += deltaX
          transform[5] += deltaY
          fabricCanvas.setViewportTransform(transform)
          // limitPan()

          return currentPositions
        })
      }
    }

    const handleTouchEnd = () => {
      setLastPositions(null)
      lastDistance.current = 0
      isPanning.current = false
      isZooming.current = false
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const zoomFactor = event.deltaY > 0 ? 1 - ZOOM_SENSITIVITY : 1 + ZOOM_SENSITIVITY

      const pointer = fabricCanvas.getPointer(event)
      const point = new fabric.Point(pointer.x, pointer.y)
      const currentZoom = fabricCanvas.getZoom()
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom * zoomFactor))
      fabricCanvas.zoomToPoint(point, newZoom, {
        easing: fabric.util.ease.easeOutCubic,
        duration: 300,
      })
    }

    // イベントリスナーを追加
    const canvasElement = fabricCanvas.upperCanvasEl as HTMLCanvasElement

    canvasElement.addEventListener('touchstart', handleTouchStart)
    canvasElement.addEventListener('touchmove', handleTouchMove)
    canvasElement.addEventListener('touchend', handleTouchEnd)
    canvasElement.addEventListener('wheel', handleWheel) // ホイール操作のリスナー

    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart)
      canvasElement.removeEventListener('touchmove', handleTouchMove)
      canvasElement.removeEventListener('touchend', handleTouchEnd)
      canvasElement.removeEventListener('wheel', handleWheel)
    }
  }, [fabricCanvas, panAndZoomAvailable])
}
