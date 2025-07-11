'use client'

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
import {Popover, PopoverContent, PopoverTrigger} from '@cm/shadcn-ui/components/ui/popover'

import {useIsMobile} from '@cm/shadcn-ui/hooks/use-mobile'
import {PopoverPortal} from '@radix-ui/react-popover'

import React from 'react'
import {JSX} from 'react'

type ShadPopoverProps = {
  PopoverTrigger?: JSX.Element | string
  open?: boolean
  setopen?: any

  onOpenAutoFocus?: any
  title?: string
  description?: string
  footer?: JSX.Element
  children: JSX.Element
  mode?: 'click' | 'hover'
}
const ShadPopover = React.memo((props: ShadPopoverProps) => {
  const {
    open,
    setopen,

    PopoverTrigger: Trigger,
    children,
    onOpenAutoFocus = e => e.preventDefault(),
    title,
    description,
    mode = 'hover',
    footer,
  } = props
  const mobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false)

  const isControlled = open !== undefined
  const openState = isControlled ? open : isOpen

  const headerClass = title || description ? '' : 'hidden'
  const footerClass = footer ? '' : 'hidden'

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setIsOpen(newOpen)
      }

      if (setopen) {
        setopen(newOpen)
      }
    },
    [setopen, isControlled]
  )

  const handleMouseEnter = React.useCallback(() => {
    if (mode === 'click') return

    handleOpenChange(true)
  }, [mode, handleOpenChange])

  const handleMouseLeave = React.useCallback(() => {
    if (mode === 'click') return

    handleOpenChange(false)
  }, [mode, handleOpenChange])

  const handleTriggerClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (mode === 'hover') return
      e.preventDefault()
      e.stopPropagation()
      handleOpenChange(!openState)
    },
    [mode, openState, handleOpenChange]
  )

  if (mobile) {
    return (
      <div>
        <Drawer open={openState} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild className={`PopoverTrigger`}>
            <div onClick={handleTriggerClick}>{Trigger}</div>
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerContent
              onOpenAutoFocus={onOpenAutoFocus}
              className="PopoverContent  rounded-lg  bg-white p-1  shadow-md border border-gray-200 "
            >
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className={headerClass}>
                  <DrawerTitle>{title}</DrawerTitle>
                  <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>

                <div className={`w-fit mx-auto`}>{children}</div>

                <DrawerFooter className={footerClass}></DrawerFooter>
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </div>
    )
  }

  return (
    <div>
      <Popover open={openState} onOpenChange={handleOpenChange}>
        {Trigger && (
          <PopoverTrigger asChild className={`PopoverTrigger`}>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleTriggerClick}
              style={{cursor: 'pointer'}}
            >
              {React.isValidElement(Trigger) ? Trigger : <span>{Trigger}</span>}
            </div>
          </PopoverTrigger>
        )}

        <PopoverPortal>
          <PopoverContent
            onOpenAutoFocus={onOpenAutoFocus}
            className="PopoverContent  p-3 w-fit  mx-auto  shadow-lg shadow-gray-500 border border-gray-200 bg-white"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`bg-white   `}>{children}</div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  )
})

ShadPopover.displayName = 'ShadPopover'
export default ShadPopover
