import {Z_INDEX} from 'src/cm/lib/constants/constants'

import {Bars3Icon} from '@heroicons/react/20/solid'

import React from 'react'
export const MenuButton = ({onClick}) => {
  const Btn = (
    <button id={`menu-btn`}>
      <Bars3Icon
        style={{zIndex: Z_INDEX.appBar}}
        onClick={onClick}
        onMouseEnter={onClick}
        className={` text-primary-main  mx-1 w-8   rounded font-bold `}
      />
    </button>
  )

  return Btn
}
