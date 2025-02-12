import React, {Fragment, useEffect, useState} from 'react'
import {fabric} from 'fabric'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import {useLayerManager} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/layer/useLayerManager'

import {Button} from '@components/styles/common-components/Button'
import {getColorStyles} from '@lib/methods/common'
import useLoadCanvas, {useSaveCanvas} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/layer/useSaveLoad'

export type ToolProps = {
  fabricCanvas: fabric.Canvas | null
  isActive: boolean
  layerManagerHK: ReturnType<typeof useLayerManager>
}
type toolName = 'pen' | 'select' | 'eraser' | 'circleNumber'

// ==================ツールまとめ==================
export function useTools(fabricCanvas: fabric.Canvas | null, baseCanvasElementId) {
  const [currentTool, setCurrentTool] = useState<toolName | null>(null)
  const [panAndZoomAvailable, setpanAndZoomAvailable] = useState<boolean>(true)

  const layerManagerHK = useLayerManager({
    fabricCanvas,
  })
  const {layers, activateLayer, addToLayer, LayerSelectorUI} = layerManagerHK

  // ペンツール
  const PenTool = usePenTool({fabricCanvas, isActive: currentTool === 'pen', layerManagerHK})

  const CircleNumberTool = useCircleNumberTool({fabricCanvas, isActive: currentTool === 'circleNumber', layerManagerHK})

  const resetFabricCanvasConifg = () => {
    fabricCanvas.selection = false
    fabricCanvas.isDrawingMode = false
    fabricCanvas.allowTouchScrolling = false
    fabricCanvas.discardActiveObject()?.renderAll() // 選択オブジェクトを解除
    setCurrentTool(null) // ツールをリセット
    setpanAndZoomAvailable(true) // ペンツール終了時、パンとズームを有効化
  }

  // ツールリスト
  const tools = {
    pen: {
      name: 'ペン',
      activate: () => {
        fabricCanvas.allowTouchScrolling = true
        activateLayer('pen')
        setCurrentTool('pen')
      },
      UI: PenTool.PenToolUI,
    },

    circleNumber: {
      name: '工事No',
      activate: () => {
        activateLayer('circleNumber')
        setCurrentTool('circleNumber')
      },
      UI: CircleNumberTool.CircleNumberToolUI,
    },
    // select: {
    //   name: '選択',
    //   activate: () => {
    //     setCurrentTool('select')
    //   },
    //   UI: SelectTool.SelectToolUI,
    // },
  }

  const {saveCanvasToIndexedDB, isSaving, getSavedCanvasData, deleteFromIndexedDb} = useSaveCanvas()
  const {loadCanvasFromIndexedDB, isLoading} = useLoadCanvas({fabricCanvas})
  // ツールセレクターのUI
  const ToolSelectorUI = () => (
    <C_Stack className={`p-1 px-4`}>
      <R_Stack className={` justify-between`}>
        <R_Stack>
          <button
            {...{
              onClick: () => resetFabricCanvasConifg(),
              className: `${currentTool === null ? 'opacity-30' : 't-link text-error-main '} mr-4  `,
            }}
          >
            選択解除
          </button>
          {Object.keys(tools).map(toolKey => (
            <button
              key={toolKey}
              onClick={() => {
                resetFabricCanvasConifg()
                setpanAndZoomAvailable(false) // パンとズームを無効化
                tools[toolKey].activate()
              }}
              className={`${currentTool === toolKey ? 't-link' : 'opacity-30'}  `}
            >
              {tools[toolKey].name}
            </button>
          ))}
        </R_Stack>

        <R_Stack>
          <button
            {...{
              onClick: async () => {
                await saveCanvasToIndexedDB(fabricCanvas, baseCanvasElementId)
              },
            }}
          >
            Save
          </button>
          <button
            {...{
              onClick: async () => {
                await loadCanvasFromIndexedDB(fabricCanvas, baseCanvasElementId)
              },
            }}
          >
            Load
          </button>
          <button
            {...{
              onClick: async () => {
                await deleteFromIndexedDb(baseCanvasElementId)
              },
            }}
          >
            Delete
          </button>
        </R_Stack>
      </R_Stack>
      {/* 現在のツールに対応するUIを表示 */}
      {currentTool && tools[currentTool]?.UI && tools[currentTool].UI()}
    </C_Stack>
  )

  return {
    panAndZoomAvailable,
    currentTool,
    setCurrentTool,
    ToolSelectorUI,
    LayerSelectorUI,
    tools,
  }
}

// =================================ペンツール===============================
export function usePenTool(props: ToolProps) {
  const options = {
    colors: [
      {name: 'Green', color: '#1d811d'},
      {name: 'Red', color: '#ff0000'},
      {name: 'Blue', color: '#0000ff'},
    ],
    thicknesses: [
      {name: 'S', thickness: 1},
      {name: 'M', thickness: 2},
      {name: 'L', thickness: 4},
    ],
  }
  const {fabricCanvas, isActive, layerManagerHK} = props

  const [color, setColor] = useState<string>(options.colors[1].color) // デフォルト色: 赤
  const [thickness, setThickness] = useState<number>(options.thicknesses[1].thickness) // デフォルト太さ: 中

  // ペンツールの設定 (カラー・太さ)
  useEffect(() => {
    if (!fabricCanvas) return
    fabricCanvas.freeDrawingBrush.width = thickness ?? 2
    fabricCanvas.freeDrawingBrush.color = color ?? '#000000'
  }, [color, thickness, fabricCanvas])

  let currentPath: fabric.Path | null = null
  useEffect(() => {
    if (!fabricCanvas || !isActive) return
    fabricCanvas.clipTo = null

    let isDrawing = false

    const onMouseDown = (event: fabric.IEvent) => {
      isDrawing = true
      const pointer = fabricCanvas.getPointer(event.e)
      const startX = pointer.x
      const startY = pointer.y

      // パスを初期化
      currentPath = new fabric.Path(`M ${startX} ${startY}`, {
        stroke: color || 'black',
        strokeWidth: thickness || 2,
        fill: '',
        selectable: false,
      })
      fabricCanvas.add(currentPath)
    }

    const onMouseMove = async (event: fabric.IEvent) => {
      if (!isDrawing || !currentPath) return

      currentPath.set({
        noScaleCache: false,
        objectCaching: false,
      })

      const pointer = fabricCanvas.getPointer(event.e)
      const pathData = `${currentPath.path.map(cmd => cmd.join(' ')).join(' ')} L ${pointer.x} ${pointer.y}`

      currentPath.set({path: new fabric.Path(pathData).path})
      fabricCanvas.renderAll()
    }

    const onMouseUp = () => {
      if (isDrawing) {
        isDrawing = false
        if (currentPath) layerManagerHK.addToLayer('pen', currentPath) // レイヤーに追加
        currentPath = null
      }
    }

    fabricCanvas.on('mouse:down', onMouseDown)
    fabricCanvas.on('mouse:move', onMouseMove)
    fabricCanvas.on('mouse:up', onMouseUp)

    return () => {
      fabricCanvas.off('mouse:down', onMouseDown)
      fabricCanvas.off('mouse:move', onMouseMove)
      fabricCanvas.off('mouse:up', onMouseUp)
    }
  }, [fabricCanvas, color, thickness, isActive])

  // ペンツールのUI
  const PenToolUI = () => {
    if (!isActive) return null // ペンツールがアクティブな場合のみUIを表示

    return (
      <R_Stack className="pen-tool-ui">
        {/* カラーピッカー */}
        <R_Stack>
          {options.colors.map(d => (
            <Fragment key={d.name}>
              <Button
                {...{
                  active: d.color === color,
                  onClick: () => setColor(d.color),
                  style: {...getColorStyles(d.color)},
                }}
              >
                {d.name}
              </Button>
            </Fragment>
          ))}
        </R_Stack>

        {/* 太さ選択 */}
        <R_Stack>
          {options.thicknesses.map(d => (
            <Fragment key={d.name}>
              <Button
                {...{
                  active: d.thickness === thickness,
                  onClick: () => setThickness(d.thickness),
                }}
              >
                {d.name}
              </Button>
            </Fragment>
          ))}
        </R_Stack>
      </R_Stack>
    )
  }

  return {
    PenToolUI,
  }
}

// =================================工事Noツール===============================
export function useCircleNumberTool({fabricCanvas, isActive, layerManagerHK}: ToolProps) {
  const options = {
    colors: [
      {name: 'Green', color: '#1d811d'},
      {name: 'Red', color: '#ff0000'},
      {name: 'Blue', color: '#0000ff'},
    ],
    sizes: [
      {name: 'S', fontSize: 15},
      {name: 'M', fontSize: 20},
      {name: 'L', fontSize: 30},
    ],
  }
  const [color, setcolor] = useState<string>(options.colors[1].color) // デフォルト色: 緑
  const [size, setSize] = useState<{fontSize: number; name: string}>(options.sizes[1]) // デフォルトサイズ: M

  useEffect(() => {
    if (!fabricCanvas || !isActive) return

    const addCircleWithNumber = (event: fabric.IEvent) => {
      if (!fabricCanvas) return

      const pointer = fabricCanvas.getPointer(event.e)

      // 円のオブジェクトを作成
      const circle = new fabric.Circle({
        radius: size.fontSize,
        fill: '#ffffff',
        stroke: color,
        strokeWidth: 2,
        originX: 'center',
        originY: 'center', // 中心に基準を設定
      })

      // 数値のオブジェクトを作成
      const numberText = new fabric.Text('5', {
        fontSize: size.fontSize,
        fill: color,
        originX: 'center',
        originY: 'center', // 中心に基準を設定
      })

      // グループ化
      const group = new fabric.Group([circle, numberText], {
        left: pointer.x,
        top: pointer.y,
        selectable: true, // オブジェクト全体を選択可能
      })

      layerManagerHK.addToLayer('circleNumber', group)
      fabricCanvas.add(group)
    }

    // イベントリスナーを追加
    fabricCanvas.on('mouse:down', addCircleWithNumber)

    // クリーンアップ
    return () => {
      fabricCanvas.off('mouse:down', addCircleWithNumber)
    }
  }, [fabricCanvas, isActive, color, size])

  // UI コンポーネント
  const CircleNumberToolUI = () => {
    if (!isActive) return null

    return (
      <R_Stack className="circle-number-tool-ui">
        {/* テキストの色選択 */}
        <div>
          <R_Stack>
            {options.colors.map(d => {
              const active = d.color === color
              return (
                <Fragment key={d.name}>
                  <Button
                    active={active}
                    onClick={() => setcolor(d.color)}
                    style={{
                      backgroundColor: d.color,
                      border: color === d.color ? '2px solid black' : 'none',
                    }}
                  >
                    {d.name}
                  </Button>
                </Fragment>
              )
            })}
          </R_Stack>
        </div>

        {/* サイズ選択 */}
        <div>
          <R_Stack>
            {options.sizes.map(d => {
              const active = d.name === size?.name
              return (
                <Fragment key={d.name}>
                  <Button
                    active={active}
                    onClick={() => setSize(d)}
                    style={{
                      border: size === d ? '2px solid black' : 'none',
                    }}
                  >
                    {d.name}
                  </Button>
                </Fragment>
              )
            })}
          </R_Stack>
        </div>
      </R_Stack>
    )
  }

  return {CircleNumberToolUI}
}

export function useSelectTool({fabricCanvas, isActive}: ToolProps) {
  useEffect(() => {
    if (!fabricCanvas) return

    fabricCanvas.selection = isActive
    fabricCanvas.skipTargetFind = !isActive

    return () => {
      fabricCanvas.selection = false
      fabricCanvas.skipTargetFind = true
    }
  }, [fabricCanvas, isActive])

  const deleteSelectedObject = () => {
    const activeObject = fabricCanvas.getActiveObject()
    if (activeObject) {
      fabricCanvas.remove(activeObject)
    }
  }

  let copiedObject: fabric.Object | null = null

  const copyObject = () => {
    const activeObject = fabricCanvas.getActiveObject()
    if (activeObject) {
      copiedObject = fabric.util.object.clone(activeObject)
    }
  }

  const pasteObject = () => {
    if (copiedObject) {
      const clone = fabric.util.object.clone(copiedObject)
      clone.set({left: clone.left + 10, top: clone.top + 10}) // 貼り付け時に少しずらす
      fabricCanvas.add(clone)
      fabricCanvas.renderAll()
    }
  }

  // const changeObjectColor = (color: string) => {
  //   const activeObject = fabricCanvas.getActiveObject()
  //   if ((activeObject && activeObject.type === 'rect') || activeObject.type === 'circle') {
  //     activeObject.set('fill', color)
  //     fabricCanvas.renderAll()
  //   }
  // }
  // const groupObjects = () => {
  //   const activeObjects = fabricCanvas.getActiveObjects()
  //   if (activeObjects.length > 1) {
  //     const group = new fabric.Group(activeObjects)
  //     fabricCanvas.clear() // 一度クリアしてから
  //     fabricCanvas.add(group)
  //   }
  // }

  // const ungroupObjects = () => {
  //   const activeObject = fabricCanvas.getActiveObject()
  //   if (activeObject && activeObject.type === 'group') {
  //     const items = activeObject._objects
  //     fabricCanvas.remove(activeObject)
  //     items.forEach(item => fabricCanvas.add(item))
  //     fabricCanvas.renderAll()
  //   }
  // }

  // UIは必要に応じて追加
  const SelectToolUI = () => (
    <R_Stack>
      <Button onClick={deleteSelectedObject}>削除</Button>

      <Button onClick={copyObject}>コピー</Button>
      <Button onClick={pasteObject}>ペースト</Button>
    </R_Stack>
  )

  return {SelectToolUI}
}
