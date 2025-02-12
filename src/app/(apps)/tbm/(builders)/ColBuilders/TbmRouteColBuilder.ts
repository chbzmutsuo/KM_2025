'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const TbmRouteColBuilder = (props: columnGetterType) => {
  return new Fields([
    {id: 'tbmBillingAddressId', label: '請求先支社', form: {...defaultRegister}, forSelect: {}},
    {id: 'departure', label: '出発地', form: {...defaultRegister}},
    {id: 'destination', label: '目的地', form: {...defaultRegister}},
    {id: 'farePrice', label: '運賃', form: {...defaultRegister}, type: `float`},
    {id: 'tollPrice', label: '通行料', form: {...defaultRegister}, type: `float`},
    {id: 'driverSalary', label: '運転手給与', form: {...defaultRegister}, type: `float`},
  ]).transposeColumns()
}
