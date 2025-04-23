import {CSSProperties} from 'react'
import {colorClassMaster, colorVariants} from 'src/cm/components/styles/common-components/colorVariants'
import {props} from 'src/cm/components/styles/common-components/type'
import {cl} from 'src/cm/lib/methods/common'
import {twMerge} from 'tailwind-merge'

export const IconBtn = (props: props & {color?: colorVariants | string; active?: boolean; inline?: boolean}) => {
  const {className, style, color, active, inline, ...rest} = props

  const hitTwColor = colorClassMaster.iconBtn[color ?? '']
  const ClassName = twMerge(
    //
    hitTwColor,
    color ? `shadow-xs border-[0.5px]  ` : '',
    IconBtnBaseClass,
    className
  )

  const customeStyle =
    !color || hitTwColor
      ? undefined
      : {
          background: color + '40',
          borderColor: color,
          color: color,
        }

  return (
    <div
      {...{
        className: ClassName,
        style: {...style, ...customeStyle},
        ...rest,
      }}
    />
  )
}

export const IconBtnBaseClass = ` rounded-full !px-2 py-0.5 text-center text-[15px]   `

export const CircledIcon = (
  props: props & {
    size?: 'md' | 'lg'
    color?: colorVariants
    active?: boolean
    inline?: boolean
    icon?
  }
) => {
  const {icon, className, style, color = `gray`, active, inline, type = `button`, size = `md`, ...rest} = props

  const sizeClass = size === `md` ? `h-5 w-5 p-[1px]` : `h-8 w-8 p-1`
  return (
    <button
      {...rest}
      {...{color, active, inline, type}}
      style={{...style}}
      className={cl(sizeClass, `  rounded-full  shadow-sm`, className)}
    >
      {icon ?? props.children}
    </button>
  )
}

export const IconBtnForSelect = (props: {
  children: React.ReactNode
  color?: colorVariants
  className?: string
  style?: CSSProperties
}) => {
  const {children, color, className, style} = props

  return (
    <IconBtn color={color} style={style} className={twMerge(`rounded !text-gray-700`, className)}>
      {children}
    </IconBtn>
  )
}
