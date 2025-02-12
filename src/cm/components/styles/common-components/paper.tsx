import {cl} from '@lib/methods/common'
import {props} from 'src/cm/components/styles/common-components/type'
export const Wrapper = (props: props) => {
  const {className, ...rest} = props
  return <div className={cl('h-fii   bg-white p-0.5 shadow-sm ', className)}>{props.children}</div>
}
export const WrapperRounded = (props: props) => {
  const {className, ...rest} = props
  return <Wrapper className={cl('rounded', className)}>{props.children}</Wrapper>
}

export const Paper = (props: props) => {
  const {className, ...rest} = props
  return <div className={`t-paper ${className}`} {...rest} />
}
export const PaperLarge = (props: props) => {
  const {className, ...rest} = props
  return <div className={`t-paper m-3 p-3 ${className}`} {...rest} />
}
