'use client'

import {useState, useRef} from 'react'
import Image from 'next/image'

type MediaPreview = {
  url: string
  type: 'image' | 'video'
  file: File
}

export const TweetForm = () => {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック
    if (file.type.includes('image') && file.size > 5 * 1024 * 1024) {
      alert('画像は5MB以下にしてください')
      return
    }
    if (file.type.includes('video') && file.size > 512 * 1024 * 1024) {
      alert('動画は512MB以下にしてください')
      return
    }

    // プレビューURL作成
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview({
      url: previewUrl,
      type: file.type.includes('image') ? 'image' : 'video',
      file,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text && !mediaPreview) return

    try {
      setIsLoading(true)

      // ファイルをバッファーに変換
      let imageBuffer, videoBuffer
      if (mediaPreview?.file) {
        const buffer = await mediaPreview.file.arrayBuffer()
        if (mediaPreview.type === 'image') {
          imageBuffer = Buffer.from(buffer)
        } else {
          videoBuffer = Buffer.from(buffer)
        }
      }

      const response = await fetch('/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          imageBuffer,
          videoBuffer,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('投稿しました！')
        // フォームをリセット
        setText('')
        setMediaPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error?.stack)
      alert('投稿に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 p-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="いまどうしてる？"
        className="h-24 w-full resize-none rounded-md border p-2"
        maxLength={280}
      />

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*, video/*"
          onChange={handleMediaSelect}
          className="hidden"
          id="media-upload"
        />
        <label
          htmlFor="media-upload"
          className="inline-block cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          メディアを追加
        </label>

        {mediaPreview && (
          <div className="relative w-full max-w-md">
            {mediaPreview.type === 'image' ? (
              <Image src={mediaPreview.url} alt="Preview" width={400} height={300} className="rounded-md" />
            ) : (
              <video src={mediaPreview.url} controls className="w-full rounded-md" />
            )}
            <button
              type="button"
              onClick={removeMedia}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || (!text && !mediaPreview)}
        className={`w-full rounded-md px-4 py-2 text-white ${
          isLoading || (!text && !mediaPreview) ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}
