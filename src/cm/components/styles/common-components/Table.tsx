import {DH} from '@class/DH'
import {props} from 'src/cm/components/styles/common-components/type'
import {CssString} from 'src/cm/components/styles/cssString'
import {cl} from 'src/cm/lib/methods/common'

export const TableWrapper = (props: props) => {
  const {className, style, children, ...rest} = props

  return (
    <div {...{className: cl(className, `sticky-table-wrapper overflow-auto border-collapse`), style, ...rest}}>{children}</div>
  )
}

export const TableBordered = (props: props & {size?: `sm` | `base` | `lg` | `xl`}) => {
  const {className, style, children, size = `base`, ...rest} = props

  let sizeClass = ''
  if (size === `sm`) {
    sizeClass = ` [&_td]:!p-[1px] [&_td]:!px-[1px] `
  }

  if (size === `base`) {
    sizeClass = ` [&_td]:!p-1 `
  }

  if (size === `lg`) {
    sizeClass = ` [&_td]:!p-1 [&_td]:!px-2.5`
  }
  if (size === `xl`) {
    sizeClass = ` [&_td]:!p-1 [&_td]:!px-4`
  }

  return (
    <table
      {...{
        className: cl(className, CssString.table.borderCerlls, sizeClass),
        style,
        ...rest,
      }}
    >
      {children}
    </table>
  )
}
export const TableBorderedY = (props: props) => {
  const {className, style, children, ...rest} = props

  return (
    <table
      {...{
        className: cl(className, CssString.table.borderCerllsY),
        style,
        ...rest,
      }}
    >
      {children}
    </table>
  )
}

export const Counter = (props: props & {children: number}) => {
  const {className, style, children, ...rest} = props
  return (
    <span {...rest} className={`${className} ${children ? '' : 'opacity-30'}`}>
      {children ? DH.toPrice(children) : children}
    </span>
  )
}

export const NoEffectTd = (props: props) => {
  const {className, style, children, ...rest} = props
  return (
    <td {...rest} className={`${className} noEffect`}>
      {children}
    </td>
  )
}
