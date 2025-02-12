import {colorClassMaster, colorVariants} from 'src/cm/components/styles/common-components/colorVariants'
import {props} from 'src/cm/components/styles/common-components/type'
import {cl} from 'src/cm/lib/methods/common'

export const Button = (props: props & {color?: colorVariants; active?: boolean; size?: 'sm' | 'md' | 'lg'}) => {
  const {className, style, color, active, size = 'md', ...rest} = props
  const sizeClass = size === `sm` ? 'text-[14px] py-[1px] px-[8px]' : size === 'lg' ? 'text-lg p-1 px-2' : ''

  return (
    <button
      {...{
        className: cl(
          //
          `t-btn`,
          active === false ? 'opacity-30  ' : '',
          sizeClass,
          className,
          colorClassMaster.btn[color ?? '']
        ),
        style,
        ...rest,
      }}
    />
  )
}
