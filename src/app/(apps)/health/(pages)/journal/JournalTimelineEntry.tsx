'use client'

import {useState, useEffect} from 'react'
import {HOUR_SLOT_LABELS, HEALTH_CATEGORY_LABELS, HEALTH_CATEGORY_COLORS, HealthJournalEntry} from '../../(constants)/types'
import {addJournalImage, deleteJournalImage} from '../../(lib)/journalActions'
import {FileHandler} from '@cm/class/FileHandler'
import ContentPlayer from '@cm/components/utils/ContentPlayer'
import {R_Stack} from '@cm/components/styles/common-components/common-components'

interface HealthRecord {
  id: number
  category: string
  recordTime: string
  bloodSugarValue?: number
  Medicine?: {
    name: string
  }
  medicineUnit?: number
  walkingShortDistance?: number
  walkingMediumDistance?: number
  walkingLongDistance?: number
  walkingExercise?: number
  memo?: string
}

interface JournalTimelineEntryProps {
  hourSlot: number
  entry?: HealthJournalEntry
  journalDate: string
  userId: number
  healthRecords: HealthRecord[]
  onUpdateEntry: (entryId: number, comment: string) => Promise<void>
}

export default function JournalTimelineEntry({
  hourSlot,
  entry,
  journalDate,
  userId,
  healthRecords,
  onUpdateEntry,
}: JournalTimelineEntryProps) {
  const [comment, setComment] = useState(entry?.comment || '')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

  // ファイル選択時の処理
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    // ファイルリスト全体の検証とリサイズ
    const validation = FileHandler.validateFileList(files)

    if (!validation.isValid) {
      alert('ファイル検証エラー:\n' + validation.errorMessages.join(', '))
      return
    }

    // 画像ファイルのリサイズ（2MB制限を超えている場合）
    const oversizedImages = validation.validFiles.filter(file => file.type.startsWith('image/') && file.size > 2 * 1024 * 1024)

    let processedFiles = validation.validFiles

    if (oversizedImages.length > 0) {
      const shouldResize = confirm(`${oversizedImages.length}個の画像ファイルが2MBを超えています。\n自動でリサイズしますか？`)

      if (shouldResize) {
        try {
          const optimizeResult = await FileHandler.optimizeFileList(
            validation.validFiles,
            {
              maxWidth: 1200,
              maxHeight: 900,
              quality: 0.8,
              format: 'jpeg',
              maintainAspectRatio: true,
            },
            (step, progress) => {
              console.log(`${step} ${progress}%`)
            }
          )

          processedFiles = optimizeResult.resizedFiles

          if (optimizeResult.summary.totalSizeReduction > 0) {
            const reductionMB = (optimizeResult.summary.totalSizeReduction / (1024 * 1024)).toFixed(2)
            alert(`リサイズ完了: ${reductionMB}MB削減されました`)
          }
        } catch (error) {
          console.error('リサイズエラー:', error)
          alert('リサイズに失敗しました。元のファイルを使用します。')
        }
      }
    }

    // プレビューURL作成
    const newPreviewUrls = processedFiles.map(file => URL.createObjectURL(file))

    setSelectedFiles(prev => [...prev, ...processedFiles])
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    setHasChanges(true)
  }

  // プレビュー画像削除
  const removePreviewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  // 既存画像削除
  const removeExistingImage = async (image: {id: number; filePath: string}) => {
    const {id: imageId, filePath} = image
    if (!confirm('この画像を削除しますか？\n削除した画像は復元できません。')) return

    setDeletingImageId(imageId)

    try {
      const result = await deleteJournalImage(imageId)
      const deleteResult = await FileHandler.deleteFileFromS3(filePath)

      if (result.success) {
        // 親コンポーネントに更新を通知（エントリを再取得）
        if (entry) {
          await onUpdateEntry(entry.id, comment)
        }
      } else {
        alert('画像の削除に失敗しました: ' + result.error)
      }
    } catch (error) {
      console.error('画像削除エラー:', error)
      alert('画像の削除に失敗しました')
    } finally {
      setDeletingImageId(null)
    }
  }

  // コメント変更時の処理
  const handleCommentChange = (value: string) => {
    setComment(value)
    setHasChanges(value !== (entry?.comment || ''))
  }

  // 確定ボタンの処理
  const handleConfirm = async () => {
    if (!entry || (!hasChanges && selectedFiles.length === 0)) return

    setUploading(true)
    try {
      // コメントの更新
      if (hasChanges) {
        await onUpdateEntry(entry.id, comment)
      }

      // 画像のアップロード
      for (const file of selectedFiles) {
        const formDataObj = {
          bucketKey: 'health/journal',
        }

        const uploadResult = await FileHandler.sendFileToS3({
          file,
          formDataObj,
          validateFile: true,
        })

        if (uploadResult.success && uploadResult.result?.url) {
          // データベースに画像情報を保存
          await addJournalImage(entry.id, {
            fileName: file.name,
            filePath: uploadResult.result.url,
            fileSize: file.size,
            mimeType: file.type,
            description: `${HOUR_SLOT_LABELS[hourSlot]}の画像`,
          })
        } else {
          throw new Error(`画像のアップロードに失敗しました: ${uploadResult.message}`)
        }
      }

      // プレビューをクリア
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setSelectedFiles([])
      setPreviewUrls([])
      setHasChanges(false)

      // エントリを再取得して画像を反映
      await onUpdateEntry(entry.id, comment)
    } catch (error) {
      console.error('確定処理エラー:', error)
      alert('保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'))
    } finally {
      setUploading(false)
    }
  }

  // クリーンアップ
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  // 健康記録の詳細を表示
  const renderHealthRecord = (record: HealthRecord) => {
    const categoryColor = HEALTH_CATEGORY_COLORS[record.category as keyof typeof HEALTH_CATEGORY_COLORS] || '#6b7280'
    const categoryLabel = HEALTH_CATEGORY_LABELS[record.category as keyof typeof HEALTH_CATEGORY_LABELS] || record.category

    let details = ''
    switch (record.category) {
      case 'blood_sugar':
        details = `${record.bloodSugarValue}mg/dL`
        break
      case 'medicine':
        details = record.Medicine?.name || '薬'
        if (record.medicineUnit) {
          details += ` (${record.medicineUnit}単位)`
        }
        break
      case 'walking': {
        const walkingDetails: string[] = []
        if (record.walkingShortDistance) walkingDetails.push(`短距離:${record.walkingShortDistance}`)
        if (record.walkingMediumDistance) walkingDetails.push(`中距離:${record.walkingMediumDistance}`)
        if (record.walkingLongDistance) walkingDetails.push(`長距離:${record.walkingLongDistance}`)
        if (record.walkingExercise) walkingDetails.push(`運動:${record.walkingExercise}`)
        details = walkingDetails.join(', ')
        break
      }
      default:
        details = '記録済み'
    }

    return (
      <div key={record.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded h ">
        <span className="text-xs font-medium text-gray-600">{record.recordTime}</span>
        <span
          className="px-2 py-1 rounded text-xs font-medium text-white print-health-badge"
          style={{backgroundColor: categoryColor}}
        >
          {categoryLabel}
        </span>
        <span className="text-sm text-gray-700">{details}</span>
        {record.memo && <span className="text-xs text-gray-500">({record.memo})</span>}
      </div>
    )
  }

  useEffect(() => {
    setComment(entry?.comment || '')
  }, [entry?.comment])

  if (!entry) {
    return null
  }

  return (
    <div className={``}>
      <div className="bg-white rounded-lg shadow px-4 border-l-4 border-blue-500 print-timeline-entry avoid-break">
        {/* 時間帯ヘッダー */}
        <div className="flex items-center justify-between mb-4 print-timeline-header">
          <h3 className="text-lg font-semibold text-gray-800 print-time-label">{HOUR_SLOT_LABELS[hourSlot]}</h3>
        </div>

        {/* 健康記録 */}
        {healthRecords.length > 0 && (
          <div className="mb-4">
            <R_Stack className=" print-health-records">{healthRecords.map(renderHealthRecord)}</R_Stack>
          </div>
        )}

        {/* コメント入力 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">コメント</label>
          <div className="print-comment-box">
            <textarea
              value={comment}
              onChange={e => handleCommentChange(e.target.value)}
              placeholder="この時間帯の出来事や感想を記入してください..."
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none print-textarea"
            />
          </div>
        </div>

        {/* 画像アップロード */}
        <div className="mb-4 ">
          {/* プレビュー画像 */}
          <section className={`no-print`}>
            {/* ファイル選択 */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">画像を選択</label>
              <p className="text-xs text-gray-500 mb-2">
                対応形式: JPEG (.jpeg, .jpg), PNG (.png), GIF (.gif), WebP (.webp), HEIC (.heic)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".jpeg,.jpg,.png,.gif,.webp,.heic,image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {previewUrls.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">プレビュー（未保存）:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`プレビュー ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border-2 border-yellow-300"
                      />
                      <button
                        onClick={() => removePreviewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title="画像を削除"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 既存画像 */}
          {entry.images && entry.images.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-2 font-medium">保存済み画像:</p>
              {/* 画面表示用 */}
              <R_Stack className=" justify-start items-start gap-0">
                {entry.images.map(image => (
                  <div key={image.id} className=" w-1/4 relative  p-1.5">
                    <div className={` t-paper p-1 mx-auto w-fit relative`}>
                      <ContentPlayer
                        src={image.filePath}
                        {...{
                          styles: {thumbnail: {width: undefined}},
                          options: {download: true},
                        }}
                      />
                      <button
                        onClick={() => removeExistingImage({id: image.id, filePath: image.filePath})}
                        disabled={deletingImageId === image.id}
                        className={`absolute -top-2 -right-2 rounded-full w-7 h-7 z-50 flex items-center justify-center text-sm font-bold shadow-md transition-all duration-200 ${
                          deletingImageId === image.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white hover:scale-110'
                        }`}
                        title={deletingImageId === image.id ? '削除中...' : '画像を削除'}
                      >
                        {deletingImageId === image.id ? '...' : '×'}
                      </button>
                    </div>
                  </div>
                ))}
              </R_Stack>

              {/* 印刷用画像表示
              <div className="print-images hidden print:block">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {entry.images.map(image => (
                    <div key={image.id} className="print-image-container">
                      <img src={image.filePath} alt={image.description || image.fileName} className="print-image" />
                      <div className="print-image-caption">{image.description || image.fileName}</div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* 確定ボタン */}
        {(hasChanges || selectedFiles.length > 0) && (
          <div className="flex justify-end no-print">
            <button
              onClick={handleConfirm}
              disabled={uploading}
              className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? '保存中...' : '確定'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
