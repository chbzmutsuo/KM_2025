import {useState} from 'react'
import {fabric} from 'fabric'
import {useLayerManager} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/layer/useLayerManager'

export const useSaveCanvas = () => {
  const [isSaving, setIsSaving] = useState(false)

  const saveCanvasToIndexedDB = async (canvas: fabric.Canvas, key: string) => {
    setIsSaving(true)
    const json = canvas.toJSON()

    const dbRequest = indexedDB.open('CanvasDB', 1)
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result
      if (!db.objectStoreNames.contains('canvas')) {
        db.createObjectStore('canvas')
      }
    }

    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const transaction = db.transaction('canvas', 'readwrite')
      const store = transaction.objectStore('canvas')
      store.put(json, key)

      transaction.oncomplete = () => {
        console.log('Canvas saved successfully')
        setIsSaving(false)
      }

      transaction.onerror = () => {
        console.error('Error saving canvas')
        setIsSaving(false)
      }
    }

    dbRequest.onerror = () => {
      console.error('Error opening IndexedDB')
      setIsSaving(false)
    }
  }

  const deleteFromIndexedDb = async (key: string) => {
    const dbRequest = indexedDB.open('CanvasDB', 1)
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const transaction = db.transaction('canvas', 'readwrite')
      const store = transaction.objectStore('canvas')
      store.delete(key)
      transaction.oncomplete = () => {
        console.log('Canvas deleted successfully')
      }
      transaction.onerror = () => {
        console.error('Error deleting canvas')
      }
    }
    dbRequest.onerror = () => {
      console.error('Error opening IndexedDB')
    }
  }
  const getSavedCanvasData = async (key: string) => {
    const dbRequest = indexedDB.open('CanvasDB', 1)
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const transaction = db.transaction('canvas', 'readonly')
      const store = transaction.objectStore('canvas')
      const request = store.get(key)

      request.onsuccess = () => {
        const json = request.result

        if (json) {
          return json
        } else {
          console.warn('No canvas data found for the given key')
        }
      }

      request.onerror = () => {
        console.error('Error loading canvas')
      }
    }

    dbRequest.onerror = () => {
      console.error('Error opening IndexedDB')
    }
  }

  return {saveCanvasToIndexedDB, isSaving, getSavedCanvasData, deleteFromIndexedDb}
}

const useLoadCanvas = ({fabricCanvas}) => {
  const [isLoading, setIsLoading] = useState(false)
  const {layers, setLayers} = useLayerManager({fabricCanvas})

  const loadCanvasFromIndexedDB = async (canvas: fabric.Canvas, key: string) => {
    setIsLoading(true)

    const dbRequest = indexedDB.open('CanvasDB', 1)
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const transaction = db.transaction('canvas', 'readonly')
      const store = transaction.objectStore('canvas')
      const request = store.get(key)

      request.onsuccess = () => {
        const json = request.result

        if (json) {
          canvas.loadFromJSON(
            json,
            () => {
              // 全てのオブジェクトの設定後に再描画
              canvas.renderAll()

              console.log('Canvas loaded successfully')

              // レイヤー情報を再構築し useLayerManager に設定
              const layers: any = Object.values(
                json.objects.reduce((acc: any, obj: any) => {
                  const layerKey = obj.layer || 'default' // レイヤーキー (デフォルト値: 'default')
                  if (!acc[layerKey]) {
                    acc[layerKey] = {groups: [], active: true}
                  }

                  // acc[layerKey].groups.push(canvas.getObjectById(obj.id)) // Fabric.js IDで参照
                  return acc
                }, {})
              )

              setLayers(layers) // useLayerManager の layers にセット
            },
            error => {
              console.error('Error loading canvas objects:', error)
            }
          )
        } else {
          console.warn('No canvas data found for the given key')
        }
        setIsLoading(false)
      }

      request.onerror = () => {
        console.error('Error loading canvas')
        setIsLoading(false)
      }
    }

    dbRequest.onerror = () => {
      console.error('Error opening IndexedDB')
      setIsLoading(false)
    }
  }

  return {loadCanvasFromIndexedDB, isLoading}
}

export default useLoadCanvas

// import {layerStatus} from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/layer/useLayerManager'
// import {fabric} from 'fabric'

// type SaveLoadProps = {
//   fabricCanvas: fabric.Canvas | null
//   layers: {[key: string]: layerStatus}
// }

// export function useSaveLoad({fabricCanvas, layers}: SaveLoadProps) {
//   const saveLayers = () => {
//     const jsonObj = Object.keys(layers).reduce((acc, layerName) => {
//       acc[layerName] = layers[layerName].groups.map(group => group.toObject(['visible']))
//       return acc
//     }, {} as {[key: string]: any})

//     const json = JSON.stringify(jsonObj, null, 2)

//     return json
//   }

//   const loadLayers = (json: string) => {
//     if (!fabricCanvas) return

//     const parsedLayers = JSON.parse(json)
//     Object.keys(parsedLayers).forEach(layerName => {
//       const objects = parsedLayers[layerName].map((obj: any) => fabric.util.enlivenObjects([obj])[0])

//       objects.forEach((group: fabric.Group) => {
//         fabricCanvas.add(group)
//       })
//     })
//     fabricCanvas.renderAll()
//   }

//   return {saveLayers, loadLayers}
// }
