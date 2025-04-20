'use client'

import {props} from 'src/cm/components/styles/common-components/type'
import {PencilSquareIcon} from '@heroicons/react/20/solid'

import {cl} from 'src/cm/lib/methods/common'
import Link from 'next/link'
import useGlobal from '@hooks/globalHooks/useGlobal'

export const RouterLink = (
  props: props & {
    router
    href
    target?: '_blank'
    milliSeconds?: number
  }
) => {
  const {navigateRefresh} = useGlobal()
  const {className, style, href = '#', target, router, milliSeconds = 200, ...rest} = props

  return (
    <div
      onClick={() => {
        navigateRefresh(href, milliSeconds)
      }}
      {...{target, href, className: cl(className), style, ...rest}}
    ></div>
  )
}

export const T_LINK = (props: props & {href; target?: '_blank'}) => {
  const {className, style, href = '#', target, ...rest} = props

  return <Link {...{target, href, className: cl(className, 't-link'), style, ...rest}}></Link>
}

export const ShallowLink = (props: props & {href; target?: '_blank'; milliSeconds?: number}) => {
  const {shallowPush} = useGlobal()

  const {className, style, href = '#', target, milliSeconds = 200, ...rest} = props

  return (
    <span onClick={() => shallowPush(href)}>
      <span {...{target, href, className: cl(className), style, ...rest}}></span>
    </span>
  )
}

export const T_LINK_Pencil = (props: props & {href; target?: '_blank'}) => {
  const {className, style, href = '#', target, ...rest} = props

  return (
    <Link {...{target, href, className: cl(className, 't-link'), style, ...rest}}>
      <PencilSquareIcon className={`h-5 w-5`} />
    </Link>
  )
}
