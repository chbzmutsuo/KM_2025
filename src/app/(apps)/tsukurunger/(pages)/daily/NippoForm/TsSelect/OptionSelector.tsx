/* eslint-disable no-irregular-whitespace */
'use client'

import {Button} from '@components/styles/common-components/Button'
import { C_Stack} from '@components/styles/common-components/common-components'

import React, { useEffect, useRef, useState} from 'react'
export const OptionSelector = ({defaultOptions, handleSelectOption, ArrayIndex}) => {
  const [filteredOptions, setfilteredOptions] = useState(defaultOptions)
  const widthClass = `w-[300px] max-w-[90vw]`
  const inputRef = useRef<any>(null)
  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.focus()
    }
  }, [])

  return (
    <C_Stack className={`gap-4`}>
      <input
        ref={inputRef}
        className={`border ${widthClass}`}
        onChange={e => {
          const input = String(e.target.value).replace(/\s| |　+/g, ' ')
          const splitBySpace = input.split(' ')
          if (input) {
            setfilteredOptions(
              defaultOptions.filter(op => {
                return splitBySpace.every(word => {
                  return op.label.includes(word)
                })
              })
            )
          } else {
            setfilteredOptions(defaultOptions)
          }
        }}
      />
      <C_Stack className={`max-h-[70vh] items-center gap-4 overflow-auto`}>
        {filteredOptions?.map((op, i) => {
          return (
            <div key={i}>
              <Button
                {...{
                  color: `gray`,
                  className: `${widthClass} rounded text-start font-bold`,
                  onClick: () => {
                    handleSelectOption({
                      input: op.value,
                      ArrayIndex,
                    })
                  },
                }}
              >
                {op.label}
              </Button>
            </div>
          )
        })}
      </C_Stack>
    </C_Stack>
  )
}
