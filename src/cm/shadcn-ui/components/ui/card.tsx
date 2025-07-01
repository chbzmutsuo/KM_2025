import * as React from 'react'

import {cn} from '@cm/shadcn-ui/utils'
import {cva} from 'class-variance-authority'

function Card({
  className,
  variant = 'accent',
  ...props
}: {variant?: 'default' | 'outline' | 'accent'} & React.ComponentProps<'div'>) {
  const cardVariantClass = cva(
    'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 py-3 px-2  shadow-md',
    {
      variants: {
        variant: {
          default: 'bg-white text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 py-3 px-2 shadow-md',

          accent: 'bg-gradient-to-br from-bg-gray-100 to-white rounded-2xl border-0 py-4 px-4 shadow-lg',
          outline: 'bg-white  bg-inherit shadow-lg  border-2 border-gray  rounded-xl  py-3 px-2 ',
        },
      },
    }
  )
  return <div data-slot="card" className={cn(cardVariantClass({variant}), className)} {...props} />
}

function CardHeader({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props} />
}

function CardDescription({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardAction({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-4', className)} {...props} />
}

function CardFooter({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
}

export {Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent}
