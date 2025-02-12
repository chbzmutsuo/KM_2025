'use client'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {getMidnight} from '@class/Days'
import {toast} from 'react-toastify'
import {Prisma} from '@prisma/client'

export const createAqSaleCart = async ({useGlobalProps, userData, cartItems, transactionPrisma}) => {
  const {session} = useGlobalProps

  const args: Prisma.AqSaleCartCreateArgs = {
    data: {
      userId: useGlobalProps.session.id,
      aqCustomerId: userData.aqCustomerId,
      paymentMethod: userData.paymentMethod,
      date: getMidnight(),
      AqSaleRecord: {
        create: [
          ...cartItems.map(item => {
            const payload = {
              data: {
                userId: session.id,
                aqCustomerId: userData.aqCustomerId,
                aqProductId: item.selectedProduct.id,
                aqPriceOptionId: item.selectedPriceOption.id,
                quantity: item.quantity,
                price: (item?.selectedPriceOption?.price ?? 0) * item.quantity,
                date: getMidnight(),
              },
            }
            return {...payload.data}
          }),
        ],
      },
    },
  }

  const newCartRes = await fetchUniversalAPI(`aqSaleCart`, `create`, args.data, transactionPrisma)
  if (newCartRes.success) {
    toast.success(`${cartItems?.length} 件の受注を登録しました`)
  } else {
    toast.error(newCartRes.message)
  }

  return newCartRes
}

export const createPriceOption = async ({useGlobalProps, userData, cartItems, transactionPrisma}) => {
  const targetItems = cartItems.filter(item => item.setAsDefaultPrice)
  const createdPriceOptions = await Promise.all(
    targetItems.map(async item => {
      const payload = {
        aqCustomerId: userData.aqCustomerId,
        aqProductId: item.selectedProduct.id,
        aqPriceOptionId: item.selectedPriceOption.id,
      }
      const args: Prisma.AqCustomerPriceOptionUpsertArgs = {
        where: {
          unique_aqCustomerId_aqProductId_aqPriceOptionId: payload,
        },
        create: payload,
        update: payload,
      }
      return await (
        await fetchUniversalAPI(`aqCustomerPriceOption`, `upsert`, args, transactionPrisma)
      ).result
    })
  )

  const count = createdPriceOptions.length
  if (count > 0) {
    toast.success(`${count}件のデフォルト価格を設定しました`)
  }
}
