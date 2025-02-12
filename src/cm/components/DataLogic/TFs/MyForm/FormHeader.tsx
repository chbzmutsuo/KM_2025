import React from 'react'
import {anyObject} from '@cm/types/types'

const FormHeader = React.memo((props: anyObject) => {
  const {myForm, formData} = props

  if (myForm.showHeader) {
    return <div className={` bg-white p-2`}>{myForm.showHeader(formData)}</div>
  }
  return <></>
})
export default FormHeader
