'use client'

import {aqCustomerRecordCol} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerRecordCol'
import {aqCustomerSubscription} from '@app/(apps)/aquapot/(class)/colBuilder/aqCustomerSubscription'
import {getAqProduct} from '@app/(apps)/aquapot/(class)/colBuilder/getAqProduct'

import {AQCUSTOMER_STATUS_LIST, CUSTOMER_MODEL_CONST, TAX_TYPE} from '@app/(apps)/aquapot/(constants)/options'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {DH} from '@class/DH'

import {defaultMultipleSelectFormat} from '@class/Fields/lib/defaultFormat'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {Paper} from '@components/styles/common-components/paper'

import GlobalModal from '@components/utils/modal/GlobalModal'
import MyPopover from '@components/utils/popover/MyPopover'
export const aqSaleRecord = (props: columnGetterType) => {
  return new Fields([
    {
      id: `createdAt`,
      label: `登録時間`,
      type: `datetime`,
    },
    {id: `date`, label: `購入日`, type: `date`},
    {id: `aqCustomerId`, label: `顧客名`, forSelect: {}},
    {id: `userId`, label: `担当者`, forSelect: {}},

    // {id: `AqProduct.code`, label: `商品コード`, forSelect: {}},
    {id: `aqProductId`, label: `商品名`, forSelect: {}},
    {
      id: `AqPriceOption.name`,
      label: `価格オプション`,
      format: (value, row) => {
        return `${row.AqPriceOption.name}(${DH.toPrice(row.AqPriceOption.price)}円)`
      },
    },
    {id: `quantity`, label: `数量`, type: `number`},
    {id: `price`, label: `価格`, type: `price`},
    {id: `taxRate`, label: `消費税率`},
    {id: `taxedPrice`, label: `価格（税込）`, type: `price`},
    {id: `AqSaleCart.paymentMethod`, label: `支払方法`},

    // {
    //   id: `aqSaleCartId`,
    //   label: `カートID`,
    //   forSelect: {
    //     config: {
    //       select: {id: true, name: false},
    //       nameChanger: op => {
    //         return {...op, name: op.id}
    //       },
    //     },
    //   },
    // },
  ])
    .customAttributes(col => ({
      ...col,
      td: {withLabel: false},
    }))
    .transposeColumns()
}
