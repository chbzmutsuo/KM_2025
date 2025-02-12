'use client'

import {aqCustomerRecordCol} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerRecordCol'
import {getAqProduct} from '@app/(apps)/aquapot/(class)/colBuilder/getAqProduct'

import {AQCUSTOMER_STATUS_LIST, CUSTOMER_MODEL_CONST, TAX_TYPE} from '@app/(apps)/aquapot/(constants)/options'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {DH} from '@class/DH'

import {defaultMultipleSelectFormat} from '@class/Fields/lib/defaultFormat'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {AqCustomerSubscription, Prisma} from '@prisma/client'
import {P_AqCustomerSubscription} from 'scripts/generatedTypes'

export const aqCustomerSubscription = (props: columnGetterType) => {
  const {aqCustomerId} = props.ColBuilderExtraProps ?? {}
  return new Fields([
    ...new Fields([
      {id: `aqCustomerId`, label: `法人名/顧客名`, form: {...defaultRegister, defaultValue: aqCustomerId}, forSelect: {}},
      {id: `aqProductId`, label: `商品`, form: {...defaultRegister}, forSelect: {}},
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

        console.log(AqCustomerPriceOption) //////logs

        return `${price}円`
      },
    },
    {id: `paymentMethod`, label: `支払方法`, format: () => ''},
    {id: `active`, label: `有効`, form: {defaultValue: true}, type: `boolean`},
  ]).transposeColumns()
}
