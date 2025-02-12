import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import React from 'react'
import {UseFormReturn} from 'react-hook-form'
import {anyObject} from '@cm/types/types'

const FormButtons = React.memo((props: anyObject) => {
  const {myForm} = props
  const ReactHookForm: UseFormReturn = props.ReactHookForm
  const {formState} = ReactHookForm
  const {isSubmitting, isValid} = formState

  return (
    <R_Stack className={` sticky bottom-0  justify-end bg-white p-2`}>
      {myForm?.create !== false && (
        <button name="update" type="submit" className={`t-btn `} disabled={isSubmitting}>
          確定
        </button>
      )}
    </R_Stack>
  )
})
export default FormButtons
