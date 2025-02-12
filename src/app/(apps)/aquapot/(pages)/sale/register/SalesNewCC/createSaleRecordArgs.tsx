import {CartItem} from '@app/(apps)/aquapot/(pages)/sale/register/SalesNewCC/SalesNewCC'

export const createSaleRecordArgs = (props: {date: Date; userId: number; aqCustomerId: number; item: CartItem}) => {
  const {date, userId, aqCustomerId, item} = props
  const {taxRate} = item?.selectedProduct
  const price = (item?.selectedPriceOption?.price ?? 0) * item.quantity
  const taxedPrice = Math.round((price * (1 + taxRate / 100) * 100) / 100)
  return {
    User: {
      connect: {id: userId},
    },
    AqCustomer: {
      connect: {id: aqCustomerId},
    },
    AqProduct: {
      connect: {id: item.selectedProduct.id},
    },
    AqPriceOption: {
      connect: {id: item.selectedPriceOption.id},
    },

    remarks: item.remarks,
    quantity: item.quantity,
    price: price,
    date,
    taxRate: taxRate,
    taxedPrice,
  }
}
