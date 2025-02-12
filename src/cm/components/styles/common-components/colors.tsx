/* eslint-disable @next/next/no-img-element */

import {cl, getColorStyles} from 'src/cm/lib/methods/common'
import {IconBtn} from 'src/cm/components/styles/common-components/IconBtn'
import {props} from 'src/cm/components/styles/common-components/type'

export const ColorBlock = (props: props & {bgColor?: string}) => {
  const {className, style, bgColor, children, ...rest} = props
  if (!bgColor) return <div className="p-[.0625rem] leading-4">{children}</div>

  return (
    <IconBtn
      {...{
        className: cl(className),
        style: {
          height: '100%',
          fontSize: 12,
          textAlign: 'center',
          width: '100%',
          ...getColorStyles(bgColor),
          ...style,
        },
        ...rest,
      }}
    >
      {children}
    </IconBtn>
  )
}
export const ColoredText = (props: props & {bgColor?: string}) => {
  const {className, style, bgColor, children, ...rest} = props

  return (
    <div
      {...rest}
      {...{
        style: {...getColorStyles(bgColor ?? ''), padding: `2px 6px`, ...style},
        className: cl(`  rounded text-center p-0.5  `, className),
      }}
    >
      {children}
    </div>
  )
}
