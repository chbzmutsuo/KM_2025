import {cl, getColorStyles} from 'src/cm/lib/methods/common'
import {IconBtn, IconBtnBaseClass} from 'src/cm/components/styles/common-components/IconBtn'
import {props} from 'src/cm/components/styles/common-components/type'
import {twMerge} from 'tailwind-merge'

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
      {...{
        ...rest,
        style: {
          backgroundColor: bgColor + '90',
          color: getColorStyles(bgColor ?? '').color,
          padding: `2px 6px`,
          ...style,
        },
        className: twMerge(
          //
          IconBtnBaseClass,
          className
        ),
      }}
    >
      {children}
    </div>
  )
}
