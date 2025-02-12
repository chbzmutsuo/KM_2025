import tailConfigData from 'tailwind.config'
const {theme} = tailConfigData

const extend: any = theme?.extend
export const tailProps: {
  width: any
  minWidth: any
  maxWidth: any
  screens: any
  boxShadow: any
  fontSize: any
  colors: any
} = {
  ...extend,
}

type TailwindAnimationProps = {
  duration?: number
  delay?: number
  timingFunction?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  iterationCount?: 'infinite' | number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  playState?: 'running' | 'paused'
}
export const getTailwindAnimationProps = (props: TailwindAnimationProps) => {
  const toStr = Object.keys(props)
    .map(key => {
      const value = props[key]
      return value
    })
    .join('_')
  return toStr
}
