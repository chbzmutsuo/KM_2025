'use client'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const tbmMonthlyConfigForRouteGroupBuilder = (props: columnGetterType) => {
  const {selectedBase, setselectedBase, setselectedRouteGroup} = useSelectedBase()

  return new Fields([
    // {id: 'yearMonth', label: '年月', type: `date`, },
    {
      id: 'pickupTime',
      label: '接車時間',
      type: 'time',
      td: {style: {width: 110}},
    },
    {
      id: 'vehicleType',
      label: '車種',
      type: 'text',
      td: {style: {width: 110}},
    },

    // {
    //   id: 'tbmProductId',
    //   label: '商品名',
    //   type: 'text',
    //   td: {style: {width: 110}},
    //   forSelect: {},
    // },
    {
      id: 'postalFee',
      label: '通行量(郵便)',
      type: 'number',
      td: {style: {width: 110}},
    },
    {
      id: 'generalFee',
      label: '通行量(一般)',
      type: 'number',
      td: {style: {width: 110}},
    },
    // {
    //   id: 'postalHighwayFee',
    //   label: '高速(郵便)',
    //   type: 'number',
    //   td: {style: {width: 110}},
    // },
    // {
    //   id: 'generalHighwayFee',
    //   label: '高速（一般）',
    //   type: 'number',
    //   td: {style: {width: 110}},
    // },
    {
      id: 'driverFee',
      label: '運賃',
      type: 'number',
      td: {style: {width: 110}},
    },
    {
      id: 'billingFee',
      label: '請求運賃',
      type: 'number',
      td: {style: {width: 110}},
    },

    {
      id: 'tollFee',
      label: '通行料（税抜）',
      type: 'number',
      td: {style: {width: 110}},
    },
  ])
    .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
    .transposeColumns()
}
