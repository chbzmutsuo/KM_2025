import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties, ReactNode, ComponentType} from 'react'

type Props = {
  Icon: ComponentType<any>
  colorClass?: string
  children?: ReactNode
  style?: CSSProperties
}
const IconLetter = (props: Props) => {
  const {Icon, colorClass = 'bg-sky-600', children, style} = props
  return (
    <div className={`row-stack w-fit gap-1`}>
      <Icon className={cl(`h-5 w-5 rounded-sm p-0.5 text-white`, colorClass)} style={style} />
      {children}
    </div>
  )
}

export default IconLetter
