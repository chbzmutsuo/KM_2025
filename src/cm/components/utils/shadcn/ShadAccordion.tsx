'use client'
import React, {Fragment} from 'react'

// import Accordion from 'src/cm/components/utils/Accordions/Accordion'
import {useState} from 'react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@app/components/ui/accordion'

type ItemType = {
  trigger: {
    className?: string
    style?: React.CSSProperties
    node: React.ReactNode
  }
  children: {
    className?: string
    style?: React.CSSProperties
    node: React.ReactNode
  }
}

export default function ShadAccordion(props: {
  stateController?: [
    //
    openAccodionIndex: string,
    setOpenAccodionIndex: (value: string) => void
  ]
  defaultOpenIndex?: number
  items: ItemType[]
}) {
  const {items = [], defaultOpenIndex = `0`} = props

  const [openAccodionIndex, setOpenAccodionIndex] = props.stateController ?? useState(defaultOpenIndex)

  return (
    <Accordion type="single" collapsible={false} value={String(openAccodionIndex)} onValueChange={setOpenAccodionIndex}>
      {items.map((item, idx) => {
        const {trigger, children} = item
        const value = String(idx)

        const accordionTriggerClass = trigger?.className ?? `rounded bg-primary-main px-2 py-1.5 text-white`

        return (
          <Fragment key={idx}>
            <AccordionItem value={value} className={`border-none`}>
              <AccordionTrigger className={accordionTriggerClass}>{item.trigger.node}</AccordionTrigger>

              <AccordionContent>{children.node}</AccordionContent>
            </AccordionItem>
          </Fragment>
        )
      })}
    </Accordion>
  )
}
