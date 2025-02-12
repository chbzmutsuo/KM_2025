'use client'

import {CartItem} from '@app/(apps)/aquapot/(pages)/sale/register/SalesNewCC/SalesNewCC'
import {DH} from '@class/DH'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CircledIcon} from '@components/styles/common-components/IconBtn'
import {Paper} from '@components/styles/common-components/paper'

import {PencilSquareIcon, TrashIcon} from '@heroicons/react/20/solid'

import React from 'react'

export const Cart = ({cartItems, setcartItems, setformOpen}) => {
  // if (!aqProducts) return <PlaceHolder />

  return (
    <C_Stack>
      {cartItems.map((item: CartItem, index) => {
        const {selectedProduct, selectedPriceOption, quantity, setAsDefaultPrice} = item

        const dataList = [
          {label: '名称', value: selectedProduct?.name},
          {label: '数量', value: item.quantity},
          {label: '価格', value: DH.toPrice((selectedPriceOption?.price ?? 0) * (quantity ?? 0))},
          {label: 'デフォルト価格設定', value: setAsDefaultPrice ? 'はい' : 'いいえ'},
        ]
        return (
          <div key={index}>
            <Paper className={`relative w-[400px] max-w-[90vw] rounded-lg`}>
              <R_Stack className={` w-full justify-between`}>
                <R_Stack className={`absolute bottom-1 right-1 items-center`}>
                  <CircledIcon
                    onClick={() => {
                      if (confirm('カートから削除しますか？')) {
                        setcartItems(prev => {
                          return prev.filter((d, i) => i !== index)
                        })
                      }
                    }}
                  >
                    <TrashIcon />
                  </CircledIcon>
                  <CircledIcon onClick={() => setformOpen({...item})}>
                    <PencilSquareIcon />
                  </CircledIcon>
                </R_Stack>
                <div>
                  {dataList.map((d, i) => {
                    return (
                      <R_Stack key={i}>
                        <small>{d.label}:</small>
                        <strong>{d.value}</strong>
                      </R_Stack>
                    )
                  })}
                </div>
              </R_Stack>
            </Paper>
          </div>
        )
      })}
    </C_Stack>
  )
}
