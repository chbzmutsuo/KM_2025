import {colorClassMaster, colorVariants} from 'src/cm/components/styles/common-components/colorVariants'
import {props} from 'src/cm/components/styles/common-components/type'
import {cl} from 'src/cm/lib/methods/common'
import {twMerge} from 'tailwind-merge'

export const IconBtn = (props: props & {color?: colorVariants; active?: boolean; inline?: boolean}) => {
  const {className, style, color = `gray`, active, inline, ...rest} = props

  const ClassName = twMerge(
    //
    colorClassMaster.iconBtn[color ?? ''],
    `shadow-sm border-[0.5px]  `,
    IconBtnBaseClass,
    className
  )

  return <div {...{className: ClassName, style, ...rest}} />
}

export const IconBtnBaseClass = ` rounded-full !px-2 py-0.5 text-center text-[15px]   `
// export const IconBtn = (props: props & {color?: colorVariants; active?: boolean; inline?: boolean}) => {
//   const {className, style, color, active, inline, ...rest} = props

//   const ClassName = cl(
//     `icon-btn `,
//     inline ? 'inline' : '',
//     className,
//     colorClassMaster.btn[color ?? ''],
//     active === false ? 'opacity-40 ' : ''
//   )

//   return (
//     <div
//       {...{
//         className: ClassName,
//         style,
//         ...rest,
//       }}
//     />
//   )
// }

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
