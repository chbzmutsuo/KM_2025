'use client'

import {defaultRegister} from '@class/builders/ColBuilderVariables'

import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'

export const aqCustomerSubscription = (props: columnGetterType) => {
  const {aqCustomerId} = props.ColBuilderExtraProps ?? {}

  const {data} = usefetchUniversalAPI_SWR(`aqProduct`, `findMany`, {where: {name: `サーバー使用料`}})
  const serverProduct = data?.[0]
  return new Fields([
    ...new Fields([
      {
        id: `aqCustomerId`,
        label: `法人名/顧客名`,
        form: {
          ...defaultRegister,
          defaultValue: aqCustomerId,
          disabled: aqCustomerId,
        },
        forSelect: {},
      },
      {
        id: `aqProductId`,
        label: `商品`,
        form: {
          ...defaultRegister,
          defaultValue: serverProduct?.id,
          disabled: serverProduct?.id,
        },
        forSelect: {},
      },
      {id: `aqDeviceMasterId`, label: `デバイス`, form: {...defaultRegister}, forSelect: {}},
      {id: `remarks`, label: `摘要記載`, form: {}, type: `textarea`},
    ]).buildFormGroup({groupName: `商品情報`}).plain,

    ...new Fields([
      {id: `updateDate`, label: `更新日`, form: {...defaultRegister}, type: `date`},
      {id: `maintananceYear`, label: `メンテ年`, form: {...defaultRegister}, type: `number`},
      {id: `maintananceMonth`, label: `メンテ月`, form: {...defaultRegister}, type: `number`},
    ]).buildFormGroup({groupName: `メンテ情報`}).plain,

    {
      id: `price`,
      label: `金額`,
      format: (value, row) => {
        const {AqProduct, AqCustomer} = row
        const {AqCustomerPriceOption} = AqCustomer ?? {}
        const price = AqCustomerPriceOption.find(p => p.AqPriceOption?.aqProductId === AqProduct?.id)?.AqPriceOption.price ?? 0

        return `${price}円`
      },
    },
    {id: `paymentMethod`, label: `支払方法`, format: () => ''},
    {id: `active`, label: `有効`, form: {defaultValue: true}, type: `boolean`},
  ]).transposeColumns()
}
