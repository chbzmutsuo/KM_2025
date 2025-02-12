/* eslint-disable @next/next/no-img-element */

import {cl} from 'src/cm/lib/methods/common'
import {colorClassMaster, colorVariants} from 'src/cm/components/styles/common-components/colorVariants'

import {props} from 'src/cm/components/styles/common-components/type'

import React from 'react'

export const Alert = (props: props & {color?: colorVariants; inline?: boolean}) => {
  const {className, style, color = 'sub', inline = false, ...rest} = props

  const elementProps = {
    ...{
      className: cl(
        ` t-alert   border-[.0313rem]`,
        colorClassMaster.base[color],
        className,
        inline ? '!inline-blcok w-fit mx-1' : ''
      ),
      style,
      ...rest,
    },
  }
  if (inline) {
    return <span {...elementProps} />
  } else {
    return <div {...elementProps} />
  }
}
export const Text = (props: props & {color?: colorVariants; inline?: boolean}) => {
  const {className, style, color = `red`, ...rest} = props

  const colorClass = color ? colorClassMaster.text[color] : ''

  const elementProps = {
    ...{
      className: cl(`${colorClass} `, className),
      style,
      ...rest,
    },
  }
  return <span {...elementProps} />
}

export const TextBlue = (props: props) => <Text {...props} color={`blue`} />
export const TextRed = (props: props) => <Text {...props} color={`red`} />
export const TextGreen = (props: props) => <Text {...props} color={`green`} />
export const TextYellow = (props: props) => <Text {...props} color={`yellow`} />
export const TextSub = (props: props) => <Text {...props} color={`sub`} />
export const TextPrimary = (props: props) => <Text {...props} color={`primary`} />
export const TextGray = (props: props) => <Text {...props} color={`gray`} />
export const TextOrange = (props: props) => <Text {...props} color={`orange`} />
