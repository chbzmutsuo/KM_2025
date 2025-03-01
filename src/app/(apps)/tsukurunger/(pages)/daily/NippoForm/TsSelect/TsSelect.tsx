 
'use client'
import {OptionSelector} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/TsSelect/OptionSelector'
import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'
import {DH} from '@class/DH'
import {Alert} from '@components/styles/common-components/Alert'

import { C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CircledIcon} from '@components/styles/common-components/IconBtn'
import NoSpinInputWrapper from '@components/styles/NoSpinInputWrapper/NoSpinInputWrapper'
import useModal from '@components/utils/modal/useModal'
import {PlusIcon, TrashIcon} from '@heroicons/react/20/solid'
import {cl} from '@lib/methods/common'
import React, {Fragment, useCallback} from 'react'
import {SelectControl} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/TsSelect/SelectControl'
import {toast} from 'react-toastify'

export default function TsSelect({subConRole, controlClass, values, options, col, formData, setformData}) {
  const defaultCount = col.form.defaultValue ?? 1

  const currentValueTotalPrice = values.reduce((acc, cur) => {
    return acc + (cur.price ?? 0)
  }, 0)

  const {Modal, open, handleOpen, handleClose} = useModal()
  const ArrayIndex = open?.ArrayIndex

  const calcRecordValue = useCallback(
    ({optionId, input}) => {
      const count = input ? Number(input) : null
      const devideBy = TsNippo.optionKeys.find(d => d.id === col.id)?.devideBy ?? 1
      const unitPrice = col.id === `user` ? 25000 : options.find(d => d.id === optionId)?.unitPrice ?? 0

      //人件費
      if ([`user`, `tsRegularSubcontractor`].includes(col.id)) {
        const maxWorkHours = devideBy //8
        const workHours = Math.min(count ?? 0, maxWorkHours)

        const priceInWorkHours = (unitPrice * workHours) / devideBy
        const overTimeHours = (count ?? 0) - maxWorkHours
        const priceInOverTimeHours = overTimeHours > 0 ? (unitPrice * overTimeHours) / devideBy : 0

        const totalPrice = priceInWorkHours + priceInOverTimeHours * 1.25

        const result = {value: optionId, count, price: totalPrice, unitPrice}
        return result
      }
      //材料費
      else {
        const price = (unitPrice * (count ?? 0)) / devideBy
        const result = {value: optionId, count, price, unitPrice}
        return result
      }
    },
    [col, options]
  )

  const handleSelectOption = useCallback(
    ({input, ArrayIndex}) => {
      const newValues = [...values]

      const optionId = options.find(d => d.id === Number(input))?.id
      newValues[ArrayIndex] = calcRecordValue({optionId, input: defaultCount})
      const result = {...formData, [col.id]: newValues}
      setformData(result)
      handleClose(null)
    },

    [values, formData, col, setformData, defaultCount, options]
  )

  return (
    <NoSpinInputWrapper>
      <Modal>
        <OptionSelector {...{defaultOptions: options, handleSelectOption, ArrayIndex}} />
      </Modal>

      <C_Stack>
        <R_Stack>
          <CircledIcon
            onClick={() => {
              setformData({...formData, [col.id]: [...(formData[col.id] ?? []), {value: '', count: defaultCount, price: 0}]})
            }}
          >
            <PlusIcon />
          </CircledIcon>
          {!subConRole && <div>{DH.toPrice(currentValueTotalPrice)}</div>}
        </R_Stack>
        <div className={cl(`row-stack gap-x-6 `)}>
          {new Array(values?.length).fill(0).map((_, ArrayIndex) => {
            const {value, count, trashed} = values[ArrayIndex] ?? {}
            const theOption = options.find(d => d.id === value) ?? {}
            const {unit, label, displayLabel} = theOption

            if (trashed) return

            const lineHeight = undefined

            return (
              <Fragment key={ArrayIndex}>
                <div className={` w-fit`} style={{lineHeight}}>
                  <Alert color={`blue`} className={`text-s p-0.5 `} style={{lineHeight}}>
                    <R_Stack className={` gap-0.5`}>
                      <div
                        onClick={() => {
                          if (confirm('削除しますか？')) {
                            setformData(prev => {
                              const newValues = [...values]
                              newValues[ArrayIndex] = {...newValues[ArrayIndex], price: 0, trashed: true}
                              return {...prev, [col.id]: newValues}
                            })
                          }
                        }}
                      >
                        <TrashIcon className={`h-5 `} />
                      </div>

                      <R_Stack className={` flex-nowrap items-stretch gap-0.5`} style={{lineHeight}}>
                        <SelectControl {...{theOption, controlClass, ArrayIndex, handleOpen}} />

                        <R_Stack className={` justify-center  gap-0.5`}>
                          <input
                            step={0.01}
                            min={0}
                            onKeyDown={e => {
                              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault()
                              }
                            }}
                            onChange={e => {
                              const input = e.target.value

                              if (input.includes(`.`)) {
                                const [int, dec] = input.split(`.`)

                                if (dec.length > 2) {
                                  return toast.error('小数点以下は2桁までです')
                                }
                              }
                              const newValues = [...values]
                              newValues[ArrayIndex] = {
                                ...newValues[ArrayIndex],
                                ...calcRecordValue({optionId: value, input}),
                              }

                              setformData({...formData, [col.id]: newValues})
                            }}
                            className={`max-w-[40px] text-center ${controlClass}`}
                            type="number"
                            value={count}
                          />
                          <strong className={`text-error-main text-xs`}>{unit}</strong>
                        </R_Stack>
                      </R_Stack>
                    </R_Stack>
                  </Alert>
                </div>
              </Fragment>
            )
          })}
        </div>
      </C_Stack>
    </NoSpinInputWrapper>
  )
}
