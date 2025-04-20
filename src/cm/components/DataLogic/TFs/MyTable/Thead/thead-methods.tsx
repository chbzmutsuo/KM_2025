import {Center} from '@components/styles/common-components/common-components'
import {MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'
import useElementRef from 'src/cm/hooks/useElementRef'
import {cl} from 'src/cm/lib/methods/common'
import {twMerge} from 'tailwind-merge'

export const Kado = ({rowSpan, colSpan, children}) => {
  return <th {...{rowSpan, colSpan, className: 'sticky left-0'}}>{children}</th>
}

export const ThDisplayJSX = ({col}) => {
  const {TargetElementProps, TargetElementRef} = useElementRef({id: col?.id})
  const {rect} = TargetElementProps
  // const fontSize = rect.width <= 60 ? 11 : 12
  // const fontSize = 15

  const displayValue = col?.th?.format ? col?.th?.format(col) : col?.label

  return (
    <Center>
      <MarkDownDisplay
        {...{
          className: twMerge(!col?.th?.divider && 'h-fit'),
          ref: TargetElementRef,
        }}
      >
        {displayValue}
      </MarkDownDisplay>
    </Center>
  )
}
