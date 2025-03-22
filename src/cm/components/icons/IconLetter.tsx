import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties} from 'react'
type props = {
  Icon: any
  colorClass?: string
  children?: any
  style?: CSSProperties
}
const IconLetter = (props: props) => {
  const {Icon, colorClass = 'bg-blue-main', children, style} = props
  return (
    <div className={`row-stack w-fit gap-2`}>
      <Icon className={cl(`h-7  w-7 rounded   p-0.5 text-white`, colorClass)} style={style} />
      {children}
    </div>
  )
}

export default IconLetter
