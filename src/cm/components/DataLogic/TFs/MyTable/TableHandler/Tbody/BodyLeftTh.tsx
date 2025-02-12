import React, {Fragment} from 'react'

import {Circle, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {cl, getColorStyles} from 'src/cm/lib/methods/common'
import {ArrowsUpDownIcon} from '@heroicons/react/20/solid'
import useWindowSize from '@hooks/useWindowSize'

export const BodyLeftTh = ({showHeader, rowColor, dndProps, rowSpan, colSpan, recordIndex, children}) => {
  const {SP} = useWindowSize()

  const className = cl(`p-0.5  items-center  gap-0.5 flex-nowrap`, showHeader && !SP ? `row-stack` : `col-stack gap-2`)
  return (
    <Fragment>
      <th
        style={{background: getColorStyles(rowColor).backgroundColor}}
        {...{rowSpan, colSpan, className: ' !p-0 '}}
        {...dndProps}
      >
        <R_Stack className={`flex-nowrap  gap-0`}>
          <Circle width={24}>{recordIndex}</Circle>
          <div className={className}>
            {dndProps && <ArrowsUpDownIcon className={`w-4`} />}
            {children}
          </div>
        </R_Stack>
      </th>
    </Fragment>
  )
}
