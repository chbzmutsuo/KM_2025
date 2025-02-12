import {anyObject} from '@cm/types/types'
import {CSSProperties} from 'react'

export type props = {
  className?: string
  style?: CSSProperties
  onClick?: any
} & anyObject

export type elementNameString = `wrapper` | `label` | `value`
export type customClasses = {
  [key in elementNameString]?: string
}
export type customStyles = {
  [key in elementNameString]?: CSSProperties
}

export type styling = {
  classes?: customClasses
  styles?: customStyles
}
