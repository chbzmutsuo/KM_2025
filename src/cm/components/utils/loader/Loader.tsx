'use client'
import { C_Stack} from 'src/cm/components/styles/common-components/common-components'
import {Z_INDEX} from 'src/cm/lib/constants/constants'

import {Blocks} from 'react-loader-spinner'
import LoadingBar from 'react-top-loading-bar'
import { useRef} from 'react'
import {tailProps} from 'tail_const'

export default function Loader(props: any) {
  const ref = useRef<any>(null)
  const primaryColor = tailProps.colors?.primary.main

  // useEffect(() => {
  //   ref?.current?.continuousStart?.(0, 300)
  // }, [])

  return (
    <>
      <div className={`fixed inset-0 h-full w-full bg-white/50`} style={{zIndex: Z_INDEX.loader}}>
        {/* <div className={`progress-container`}>
          <div className={`progress-bar`}></div>
        </div> */}

        <LoadingBar ref={ref} color={primaryColor} height={4} />
        <C_Stack className={` items-center`}>
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
          {props.children}
        </C_Stack>
      </div>
    </>
  )
}
