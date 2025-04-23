'use client'

import {props} from 'src/cm/components/styles/common-components/type'
import {PencilSquareIcon} from '@heroicons/react/20/solid'

import {cl} from 'src/cm/lib/methods/common'
import Link from 'next/link'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useLoader from '@hooks/globalHooks/useLoader'
import {twMerge} from 'tailwind-merge'

export const T_LINK = (props: props & {href; target?: '_blank'; simple?: boolean}) => {
  const {className, style, href = '#', target, simple = false, ...rest} = props
  const {globalLoaderAtom, setglobalLoaderAtom} = useLoader()

  return (
    <Link
      {...{
        // onNavigate: async e => {
        // setglobalLoaderAtom(true)
        // await sleep(1000)
        // setglobalLoaderAtom(false)
        // },

        className: twMerge(className, simple ? '' : 't-link'),
        target,
        href,
        style,
        prefetch: true,

        ...rest,
      }}
    ></Link>
  )
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
    <T_LINK {...{target, href, className, style, ...rest}}>
      <PencilSquareIcon className={`h-5 w-5`} />
    </T_LINK>
  )
}
