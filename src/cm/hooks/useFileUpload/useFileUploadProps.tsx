'use client'

import React, {useCallback, useMemo, useState} from 'react'
import {toast} from 'react-toastify'
import {anyObject} from '@cm/types/types'

import {FileRejection} from 'react-dropzone'
import FileUploader from 'src/cm/hooks/useFileUpload/FileUploader'

import {acceptType, FileData} from '@cm/types/file-types'

type FileUploadFormProps = {
  charset?: string
  maxFiles?: number
  readAs: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString' | undefined
  accept: acceptType
} & anyObject

const useFileUploadProps = (props: FileUploadFormProps) => {
  const {charset = 'UTF-8', maxFiles = 1, readAs = 'readAsDataURL', accept} = props

  const [fileArrState, setfileArrState] = useState<FileData[]>([])
  const [fileErrorState, setfileErrorState] = useState<FileRejection[]>([])

  const handleFileChange: (files: File[]) => void = useCallback(async (files: File[]) => {
    const inputFiles = await Promise.all(
      Array.from(files).map(async (file: File, i) => {
        const result = new Promise<FileData>((resolve, reject) => {
          const reader = new FileReader()
          readAs ? reader[readAs](file, charset) : '' //読み取り方の指定
          reader.onload = () => {
            const fileReadResult = reader.result // 注意：ここでは reader.result を使用してください

            if (fileReadResult) {
              const table: any[] = []
              const content = fileReadResult as string

              content.split('\n').forEach(str => {
                // 注意：ここでは forEach を使用
                const hasValue = str.replace(/,|\r/g, '')
                // if (hasValue) {
                const row = str.split(',')
                table.push(row.map(item => item.replace(/,|\r|"/g, '')))
                // }
              })

              const fileStateForSingleItem: FileData = {
                file,
                fileName: file.name,
                fileSize: file.size,
                fileContent: table,
              }

              resolve(fileStateForSingleItem)
            }
          }

          reader.onerror = () => {
            toast.error('読み込みに失敗しました')
            reject()
          }
        })

        return result
      })
    )

    setfileArrState(prev => {
      const latestFiles = [...prev, ...inputFiles]

      if (latestFiles.length > maxFiles) {
        alert(`ファイルは最大${maxFiles}個までです`)
        return prev
      } else {
        return latestFiles
      }
    })
  }, [])

  const FileUploaderMemo = useMemo(() => {
    return (
      <FileUploader
        {...{
          accept,
          fileArrState,
          setfileArrState,

          fileErrorState,
          setfileErrorState,
          handleFileChange,
          maxFiles,
        }}
      />
    )
  }, [fileArrState, fileErrorState])

  const fileUploadIsReady = fileArrState.length > 0 && fileErrorState.length === 0

  return {
    ...props,
    fileArrState,
    fileErrorState,
    fileUploadIsReady,

    component: {
      FileUploaderMemo,
      // SubmitBtn,
    },
  }
}

export default useFileUploadProps
