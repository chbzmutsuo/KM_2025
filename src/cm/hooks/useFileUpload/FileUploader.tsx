const ContentPlayer = dynamic(() => import('src/cm/components/utils/ContentPlayer'), {
  loading: () => <></>,
})

import {TrashIcon} from '@heroicons/react/20/solid'

import {cl} from 'src/cm/lib/methods/common'
import dynamic from 'next/dynamic'
import {useMemo} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import FileErrors from 'src/cm/hooks/useFileUpload/FileErrors'
import {anyObject} from '@cm/types/types'
import {acceptType} from '@cm/types/file-types'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

type props = {
  accept: acceptType
  [key: string]: anyObject | any
}
const FileUploader = (props: props) => {
  const {
    fileArrState,
    setfileArrState,
    fileErrorState,
    setfileErrorState,
    handleFileChange,
    maxFiles,
    thumbnailStyle = {width: 160, height: 120},
    accept,
  } = props

  const wrapperAlertClass = fileErrorState.length === 0 ? 't-alert-success' : 't-alert'

  const dropZonProps = useDropzone({
    // onDrop,
    noClick: true,
    accept: accept,
    maxFiles,
    multiple: maxFiles > 1,
    onDrop(acceptedFiles, fileRejections, event) {
      let errors: FileRejection[] = []
      if (fileRejections.length > 0) {
        errors = fileRejections
      } else {
        handleFileChange(acceptedFiles)
      }

      setfileErrorState(errors)
    },
  })

  const {fileRejections, getRootProps, getInputProps, isDragActive, open} = dropZonProps
  const pillClass = `icon-btn  inline-block  p-[0.5px] text-[8px] text-white  pointer-events-none`
  const style = useMemo(() => {
    return {
      ...(isDragActive ? borderDragStyle : borderNormalStyle),
    }
  }, [isDragActive])

  return (
    <div className={` mx-auto w-fit  ${wrapperAlertClass} `}>
      <div {...getRootProps({style})} className={``}>
        <input {...getInputProps()} />

        <R_Stack
          onClick={e => {
            e.preventDefault()

            open()
          }}
          className="onHover bg-sub-light w-full items-center gap-2  py-1  text-center text-xs"
        >
          {/* <R_Stack>
            <span>ファイル</span>
            <span className={`text-sub-main font-bold`}>(最大数: {maxFiles})</span>
          </R_Stack> */}
          <R_Stack>
            <span>ファイル</span>
            {Object.keys(accept).map((acceptStr, idx) => {
              const acceptExtentions = accept[acceptStr]
              if (acceptExtentions.length > 0) {
                return acceptExtentions.map((ext, idx2) => {
                  return (
                    <span key={idx2} className={cl(pillClass, `bg-gray-500`)}>
                      {ext}
                    </span>
                  )
                })
              } else {
                return (
                  <span key={idx} className={cl(pillClass, `bg-gray-500`)}>
                    {'.' + acceptStr.replace(/.+\//, '')}
                  </span>
                )
              }
            })}
          </R_Stack>
          <FileErrors {...{maxFiles, fileErrorState}} />
        </R_Stack>

        <ul className={`row-stack   `}>
          {fileArrState.map((obj, idx) => {
            return (
              <li key={idx} className={cl(`t-paper  relative overflow-hidden`)}>
                <C_Stack className={`relative`}>
                  {/* <TrashIcon
                    onClick={e => {
                      const oldArr = [...fileArrState]
                      oldArr.splice(idx, 1)
                      setfileArrState(oldArr)
                    }}
                    className={`icon-btn absolute left-1   top-1 z-10 w-6 bg-error-main text-white  opacity-50 hover:opacity-100`}
                  /> */}

                  <R_Stack>
                    <TrashIcon
                      onClick={e => {
                        const oldArr = [...fileArrState]
                        oldArr.splice(idx, 1)
                        setfileArrState(oldArr)
                      }}
                      className={`icon-btn  bg-error-main z-10 w-6 text-white  `}
                    />
                    <small>{obj.fileName}</small>
                  </R_Stack>
                  {/* <div style={thumbnailStyle}>
                    {typeof obj.content === 'string' && (
                      <ContentPlayer src={obj.content} styles={{thumbnail: thumbnailStyle}} />
                    )}
                  </div> */}
                </C_Stack>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default FileUploader

const borderNormalStyle = {
  border: '1px dotted #888',
}

const borderDragStyle = {
  background: '#ACD7FF',
  border: '4px solid #ACD7FF',
  transition: 'border .5s ease-in-out',
  backgroundColor: '#ACD7FF',
  opacity: '30%',
}
