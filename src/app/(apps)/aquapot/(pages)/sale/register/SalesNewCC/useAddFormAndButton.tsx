'use client'

import {useState} from 'react'

import {Prisma} from '@prisma/client'

import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {CartItem} from '@app/(apps)/aquapot/(pages)/sale/register/SalesNewCC/SalesNewCC'
import {v4 as uuidv4} from 'uuid'
export const useAddFormAndButton = ({latestFormData, setcartItems}) => {
  const {aqProducts, aqCustomerPriceOption, loading} = useProductsAndPriceOptions({aqCustomerId: latestFormData.aqCustomerId})

  const upsertToCart = ({date, selectedProduct, selectedPriceOption, quantity, setAsDefaultPrice, remarks}) => {
    const newItem: CartItem = {
      uuid: uuidv4(),
      selectedProduct,
      selectedPriceOption,
      quantity,
      setAsDefaultPrice,
      remarks,
    }

    setcartItems(prev => {
      const index = prev.findIndex(d => d.selectedProduct.id === newItem.selectedProduct.id)

      if (index !== -1) {
        prev[index] = newItem
        return [...prev]
      } else {
        return [...prev, newItem]
      }
    })
    toggleForm()
  }

  const [formOpen, setformOpen] = useState<any>(null)
  const toggleForm = () => (formOpen ? setformOpen(null) : setformOpen({}))

  return {
    loading,
    formOpen,
    setformOpen,
    toggleForm,
    upsertToCart,
    aqProducts,
    aqCustomerPriceOption,
  }
}
export default useAddFormAndButton

export const useProductsAndPriceOptions = ({aqCustomerId}) => {
  const {data: aqCustomerPriceOption} = usefetchUniversalAPI_SWR(`aqCustomerPriceOption`, `findMany`, {
    where: {aqCustomerId: aqCustomerId ?? 0},
  } as Prisma.AqCustomerPriceOptionFindManyArgs)

  const {data: aqProducts} = usefetchUniversalAPI_SWR(`aqProduct`, `findMany`, {
    include: {AqPriceOption: {include: {AqCustomerPriceOption: {}}}},
  } as Prisma.AqProductFindManyArgs)

  const kimuchi = aqProducts?.find(d => d.name.includes(`キムチ`))

  return {
    loading: aqProducts && aqCustomerPriceOption ? false : true,
    aqProducts,
    aqCustomerPriceOption,
  }
}
