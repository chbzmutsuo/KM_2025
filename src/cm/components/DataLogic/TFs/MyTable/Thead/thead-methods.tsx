import useElementRef from 'src/cm/hooks/useElementRef'
import {cl} from 'src/cm/lib/methods/common'

export const Kado = ({rowSpan, colSpan, children}) => {
  return <th {...{rowSpan, colSpan, className: ''}}>{children}</th>
}

export const ThDisplayJSX = ({col}) => {
  const {TargetElementProps, TargetElementRef} = useElementRef({id: col?.id})
  const {rect} = TargetElementProps
  // const fontSize = rect.width <= 60 ? 11 : 12
  // const fontSize = 15

  const displayValue = col?.th?.format ? col?.th?.format(col) : col?.label

  return (
    <span
      {...{
        className: cl(
          //
          ` items-center justify-center`,
          !col?.th?.divider && 'h-fit'
        ),
        ref: TargetElementRef,
        // style: {fontSize,},
      }}
    >
      {displayValue}
    </span>
  )
}
