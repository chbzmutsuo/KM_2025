import * as React from 'react'
import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'

import {cn} from '../../lib/utils'
import {badgeVariantStr} from '../../lib/variant-types'

export const badgeVariantObject: {
  color: {[key in badgeVariantStr]: string}
  size: {[key in 'sm' | 'md' | 'lg']: string}
  forceWide: {true: string; false: string}
} = {
  color: {
    red: 'border-red-500 bg-red-600/10 text-red-600',
    green: 'border-green-500 bg-green-600/10 text-green-600',
    blue: 'border-blue-500 bg-blue-600/10 text-blue-600',
    purple: 'border-purple-500 bg-purple-600/10 text-purple-600',
    orange: 'border-orange-500 bg-orange-600/10 text-orange-600',
    pink: 'border-pink-500 bg-pink-600/10 text-pink-600',
    gray: 'border-gray-500 bg-gray-600/10 text-gray-600',

    black: 'border-black bg-gray-800 text-white',
    white: 'border-gray-800 bg-white/10 text-black',

    primary: 'border-primary bg-primary/10 text-primary',
    secondary: 'border-secondary bg-secondary/10 text-secondary',
    success: 'border-success bg-success/10 text-success',
    warning: 'border-warning bg-warning/10 text-warning',
    destructive: 'border-destructive bg-destructive/10 text-destructive',
    disabled: 'border-disabled bg-disabled/10 text-disabled',
  },
  size: {
    sm: 'text-[10px] p-0.5 px-1.5',
    md: 'text-[12px] p-0.5 px-1.5',
    lg: 'text-[14px] p-0.5 px-1.5 ',
  },
  forceWide: {
    true: 'aspect-square',
    false: '',
  },
}
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden rounded-full',
  {
    variants: badgeVariantObject,
    defaultVariants: {
      color: 'gray',
      size: 'md',
      forceWide: false,
    },
  }
)

function Badge({
  className,
  color,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {asChild?: boolean}) {
  const Comp = asChild ? Slot : 'span'

  const forceWide = String(props.children).length === 1 ? true : false

  return <Comp data-slot="badge" className={cn(badgeVariants({color, size, forceWide}), className)} {...props} />
}

export {Badge, badgeVariants}
