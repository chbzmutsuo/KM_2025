'use client'
import {FileHandler} from 'src/cm/class/FileHandler'
// import {extname} from 'path'
import BasicModal from 'src/cm/components/utils/modal/BasicModal'

import ReactPlayer from 'react-player'

import {anyObject} from '@cm/types/types'

import useWindowSize from 'src/cm/hooks/useWindowSize'

import {Absolute, Center} from 'src/cm/components/styles/common-components/common-components'
import {cl} from 'src/cm/lib/methods/common'
import {pathToNoImage} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/Control/MyFileControl/MyFileControl'
import {ArrowDownTrayIcon} from '@heroicons/react/20/solid'
import {T_LINK} from '@components/styles/common-components/links'

export type filecolTypeString = 'image' | 'video' | 'audio' | 'text' | 'application' | undefined
type ContentPlayerProps = {
  src: string
  fileType?: filecolTypeString
  mediaType?: filecolTypeString
  styles?: {
    // wrapper?: anyObject
    thumbnail?: anyObject
    main?: anyObject
  }
  options?: {
    download?: boolean
  }
} & anyObject
export default function ContentPlayer(props: ContentPlayerProps) {
  const WD = useWindowSize()
  const extname = src => {
    const reg = new RegExp(/\.\w+$/)
    return String(src)?.match(reg)?.[0] ?? ''
  }

  const {mediaType, styles = {}, options, ...rest} = props
  let {src} = props
  src = src ? src : pathToNoImage

  const thumbnailStyle = {width: 100, height: 70, ...styles.thumbnail}

  const mainStyle = {
    width: WD.width * 0.85 - 50,
    minHeight: WD.height * 0.9 - 50,
    ...styles.main,
  }

  const {thumbnail, main} = (function () {
    let thumbnail, main

    const ext = extname(src)
    const mediaTypeFromExt = FileHandler.mediaTypes?.find(obj => ext === obj.ext)?.mediaType
    let fileType = props.fileType ?? mediaType ?? mediaTypeFromExt?.split('/')[0] ?? 'application'
    if (src.includes(`google.com`)) {
      fileType = 'image'
    }

    switch (fileType) {
      case 'application': {
        thumbnail = <object data={src} width="100%" height={'100%'} />

        main = <object data={src} style={mainStyle} />

        break
      }

      case 'video': {
        thumbnail = <video src={src}></video>
        main = (
          <ReactPlayer
            url={src} // 動画のURLを指定
            controls={true} // デフォルトのコントロールを非表示にする
            style={mainStyle}
          />
        )
        break
      }
      default: {
        thumbnail = <img src={src} alt="" style={{...thumbnailStyle}} />

        main = (
          <img
            src={src}
            alt=""
            // {...mainStyle}
          />
        )
      }
    }
    return {thumbnail, main}
  })()

  const btnClass = `icon-btn absolute w-6  hover:opacity-100 z-50`
  if (!src) {
    return <div>画像を読み込めません</div>
  } else {
    return (
      <main {...rest} style={thumbnailStyle} className={cl('relative overflow-hidden bg-white', rest.className)}>
        {
          <Absolute className={`z-10`}>
            <BasicModal
              {...{
                style: {
                  maxHeight: '90vh',
                  maxWidth: '90vw',
                },
                btnComponent: (
                  <Center
                    style={{
                      zIndex: 200,
                      ...thumbnailStyle,
                      margin: `auto`,
                      cursor: 'zoom-in',
                    }}
                  ></Center>
                ),
                alertOnClose: false,
              }}
            >
              <Center style={{...styles.main, overflow: 'hidden'}}>{main}</Center>
            </BasicModal>
          </Absolute>
        }

        {options?.download && !String(src).includes('data:') && (
          <T_LINK href={src} target="_blank" simple>
            <ArrowDownTrayIcon className={`${btnClass} bg-sub-light right-10 top-1  `} />
          </T_LINK>
        )}

        <Absolute className={`position-center  h-full w-full `}>
          <Center style={{...styles.thumbnail}}>
            <div>{thumbnail}</div>
          </Center>
        </Absolute>
      </main>
    )
  }
}
