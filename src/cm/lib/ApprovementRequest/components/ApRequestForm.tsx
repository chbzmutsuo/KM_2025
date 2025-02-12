'use client'

import React from 'react'
import {Button} from '@components/styles/common-components/Button'

import {ApRequestConfig} from '@lib/ApprovementRequest/apRequest-types'

import {anyObject} from '@cm/types/types'

import {Alert} from '@components/styles/common-components/Alert'
import {C_Stack} from '@components/styles/common-components/common-components'
import {useApRequestForm} from '@lib/ApprovementRequest/components/useApRequestForm'
import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import {isDev} from '@lib/methods/common'

export const ApRequestForm = (props: {
  ApRequestTypeConfigs: ApRequestConfig
  ApRequestType: any
  maxReceiver?: number
  theApRequest: MappeadApRequest | undefined
  editable?: boolean
  formData?: anyObject
  defaultDate?: Date
}) => {
  const {ApRequestType, ApRequestTypeConfigs, maxReceiver = 3, theApRequest, editable = false, formData, defaultDate} = props

  const {onSubmit, Form} = useApRequestForm({
    defaultDate,
    ApRequestTypeConfigs,
    ApRequestType,
    maxReceiver,
    theApRequest,
    editable,
    formData,
  })

  const disabled = isDev ? false : !editable && theApRequest

  return (
    <C_Stack>
      {disabled && <Alert color={`red`}>起案後の稟議は変更できません。</Alert>}
      <div className={disabled ? 'disabled opacity-70' : ''}>
        <Form onSubmit={async data => await onSubmit({data})}>
          <Button>確定</Button>
        </Form>
      </div>
    </C_Stack>
  )
}
