'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from '@cm/shadcn-ui/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@cm/shadcn-ui/components/ui/drawer'

import {useIsMobile} from '@cm/shadcn-ui/hooks/use-mobile'
import {cn} from '@cm/shadcn-ui/lib/utils'

import React from 'react'
import {JSX} from 'react'

type ShadModalProps = {
  DialogTrigger?: JSX.Element | string
  open?: boolean
  onOpenChange?: any
  onOpenAutoFocus?: any
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ShadModal = React.memo((props: ShadModalProps) => {
  const {
    open,
    onOpenChange,
    DialogTrigger: Trigger,
    children,
    onOpenAutoFocus = e => e.preventDefault(),
    title,
    description,
    footer,
    className = '',
    style,
  } = props
  const mobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
      if (onOpenChange) {
        onOpenChange(newOpen)
      }
    },
    [onOpenChange]
  )

  const isControlled = open !== undefined
  const openState = isControlled ? open : isOpen

  if (mobile) {
    return (
      <Drawer open={openState} onOpenChange={handleOpenChange}>
        {Trigger && <DrawerTrigger asChild>{Trigger}</DrawerTrigger>}

        <DrawerPortal>
          <DrawerContent
            style={style}
            onOpenAutoFocus={onOpenAutoFocus}
            className={cn(`ModalContent rounded-lg bg-white p-1 shadow-md border border-gray-200 ${className}`)}
          >
            <div className="mx-auto w-full ">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              <div className="w-fit mx-auto p-4">{children}</div>

              <DrawerFooter>{footer}</DrawerFooter>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    )
  }

  return (
    <Dialog open={openState} onOpenChange={handleOpenChange}>
      {Trigger && <DialogTrigger asChild>{Trigger}</DialogTrigger>}

      <DialogPortal>
        <DialogContent
          onOpenAutoFocus={onOpenAutoFocus}
          style={{...style, maxHeight: '85vh', maxWidth: '90vw', overflow: 'auto'}}
          className={cn(`ModalContent p-6 w-fit mx-auto shadow-lg shadow-gray-500 border border-gray-200 bg-white ${className}`)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="bg-white">{children}</div>

          <DialogFooter>{footer}</DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
})

ShadModal.displayName = 'ShadModal'
export default ShadModal
