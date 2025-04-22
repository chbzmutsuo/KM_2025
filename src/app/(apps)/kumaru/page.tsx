import {Absolute} from '@components/styles/common-components/common-components'
import React from 'react'

export default function page() {
  return (
    <div className={` relative w-[400px] mx-auto`}>
      <Absolute
        {...{
          className: ` rounded-full bg-orange-800 `,
          style: {left: 120, top: 120, width: 100, height: 100},
        }}
      />

      <Absolute
        {...{
          className: ` rounded-full bg-orange-800 `,
          style: {left: 280, top: 120, width: 100, height: 100},
        }}
      />
      <Absolute
        {...{
          className: ` rounded-full bg-black `,
          style: {left: 160, top: 180, width: 30, height: 30, zIndex: 10},
        }}
      />
      <Absolute
        {...{
          className: ` rounded-full bg-black `,
          style: {left: 240, top: 180, width: 30, height: 30, zIndex: 10},
        }}
      />

      <Absolute
        {...{
          className: ` rounded-full bg-orange-800 `,
          style: {top: 200, width: 200, height: 200},
        }}
      />
    </div>
  )
}
