'use client'

import {Fields} from '@class/Fields/Fields'

import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'

import {useEffect} from 'react'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {PAYMENT_METHOD_LIST} from '@app/(apps)/aquapot/(constants)/options'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {getMidnight} from '@class/Days'
export const useCustomerSelector = ({cartUser, setcartUser, maxWidth}) => {
  const colWidth = maxWidth - 20
  const columns = new Fields([
    {
      id: `date`,
      label: `日付`,
      type: `date`,
      form: {...defaultRegister, style: {width: colWidth}, defaultValue: getMidnight()},
    },
    {
      id: `aqCustomerId`,
      label: `お客様（会社名/役職/氏名）`,
      forSelect: {
        config: {
          select: {
            name: `text`,
            companyName: `text`,
            jobTitle: `text`,
          },
          nameChanger: op => {
            const name = op ? [op.companyName, op.jobTitle, op.name].filter(Boolean).join(` / `) : ''
            return {...op, name}
          },
        },
      },
      form: {...defaultRegister, style: {width: colWidth}},
    },
    {
      id: `paymentMethod`,
      label: `支払方法`,
      forSelect: {optionsOrOptionFetcher: PAYMENT_METHOD_LIST},
      form: {...defaultRegister, style: {width: colWidth}},
    },
  ]).transposeColumns()

  const {BasicForm, latestFormData, ReactHookForm} = useBasicFormProps({
    onFormItemBlur: props => {
      setcartUser(props.newlatestFormData)
    },
    columns,
    formData: cartUser ?? {},
  })

  useEffect(() => {
    const setDefaultPaymentMethod = async () => {
      const {result: theCustomer} = await fetchUniversalAPI(`aqCustomer`, `findUnique`, {
        where: {id: latestFormData.aqCustomerId ?? 0},
      })

      ReactHookForm.setValue(`paymentMethod`, theCustomer?.defaultPaymentMethod)
    }
    setDefaultPaymentMethod()
  }, [latestFormData.aqCustomerId])

  return {
    latestFormData,
    Form: BasicForm,
  }
}
