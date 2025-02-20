'use client'

import { RegisterOptions} from 'react-hook-form'

import {funcOrVar} from '@lib/methods/common'
import {DH} from '@class/DH'

export const useRegisterOrigin = ({newestRecord, col, ReactHookForm, onFormItemBlur, formData, latestFormData}) => {
  const shownButDisabled = funcOrVar(col?.form?.disabled, {record: newestRecord, col})

  const currentValue = ReactHookForm.watch(col?.id)
  const registerProps: RegisterOptions = funcOrVar(col?.form?.register, {latestFormData, col, ReactHookForm})

  return {
    currentValue: currentValue,
    shownButDisabled,
    Register: ReactHookForm.register(col?.id, {
      ...registerProps,

      onBlur: async e => {
        const {target} = e
        const {id, value, name} = target

        if (onFormItemBlur) {
          const validate = col?.form?.register?.validate
          if (validate) {
            const message = await validate?.(value, formData)
            if (message) {
              ReactHookForm.setValue(col.id, null)
              return alert(message)
            }
          }

          const newlatestFormData = {...latestFormData, [name]: value}
          await onFormItemBlur({id, value, name, e, newlatestFormData, ReactHookForm})
        }
      },

      setValueAs: value => {
        const result = DH.convertDataType(value ?? null, col?.type, `server`)
        return result
      },
    }),
  }
}
