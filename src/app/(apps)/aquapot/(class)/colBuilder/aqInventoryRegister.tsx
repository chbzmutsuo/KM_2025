import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {getMidnight} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export const aqInventoryRegister = (props: columnGetterType) => {
  return new Fields([
    {
      id: 'date',
      label: `登録日`,
      form: {defaultValue: getMidnight()},
      type: `date`,
    },
    {
      id: 'aqProductId',
      label: `商品 `,
      form: {...defaultRegister},
      forSelect: {},
      onFormItemBlur: async props => {
        if (props.name === `aqProductId`) {
          const {result: TheProduct} = await fetchUniversalAPI(`aqProduct`, `findUnique`, {
            where: {id: props.newlatestFormData.aqProductId},
          })
          const customerId = TheProduct.aqDefaultShiireAqCustomerId
          if (customerId) {
            props.ReactHookForm.setValue(`aqCustomerId`, customerId)
          } else {
            props.ReactHookForm.setValue(`aqCustomerId`, null)
          }
        }
      },
    },
    {
      id: 'aqCustomerId',
      label: `仕入れ先顧客`,
      form: {...defaultRegister},
      forSelect: {},
    },
    {id: 'quantity', label: `数量`, form: {...defaultRegister}, type: `number`},
    {id: 'remarks', label: `備考`, form: {}, type: `textarea`, td: {style: {width: 300}}},
  ]).transposeColumns()
}
