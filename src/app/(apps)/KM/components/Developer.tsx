'use client'
/* eslint-disable @next/next/no-img-element */

import {Kaizen} from '@app/(apps)/KM/class/Kaizen'
import {C_Stack} from '@components/styles/common-components/common-components'
import {ImageLabel} from '@components/styles/common-components/ImageLabel'
import {T_LINK} from '@components/styles/common-components/links'

export const Developer = () => {
  return (
    <C_Stack>
      <C_Stack className={`ml-4 w-fit gap-4 font-normal`}>
        <T_LINK target={'_blank'} href={Kaizen.const.coconara.myPage}>
          <ImageLabel
            {...{
              src: Kaizen.const.coconara.icon,
              label: '改善マニア@ココナラ',
            }}
          />
        </T_LINK>
        <T_LINK target={'_blank'} href={Kaizen.const.lancers.myPage}>
          <ImageLabel
            {...{
              src: Kaizen.const.lancers.icon,
              label: '改善マニア@Lancers',
            }}
          />
        </T_LINK>
      </C_Stack>
    </C_Stack>
  )
}
