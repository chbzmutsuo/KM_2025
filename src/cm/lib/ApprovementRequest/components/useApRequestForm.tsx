'use client'

import {useCallback} from 'react'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'

import useGlobal from '@hooks/globalHooks/useGlobal'

import {Fields} from '@class/Fields/Fields'
import {Prisma} from '@prisma/client'
import {ApRequestConfig} from '@lib/ApprovementRequest/apRequest-types'

import {colType} from '@cm/types/types'

import {DH} from '@class/DH'
import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'

export const useApRequestForm = (props: {
  defaultDate
  ApRequestTypeConfigs: ApRequestConfig
  ApRequestType: any
  maxReceiver?: number
  theApRequest?: MappeadApRequest
  editable?: boolean
  formData?: any
}) => {
  const {session, router, toggleLoad} = useGlobal()
  const {defaultDate, ApRequestType, ApRequestTypeConfigs, maxReceiver, theApRequest, formData} = props

  const {ApCustomField} = ApRequestType
  const {receiverColumns, totalColumns: columns} = createColumns({
    ApCustomField,
    ApRequestType,
    ApRequestTypeConfigs,
    maxReceiver,
  })

  const defaultValues = {
    ...formData,
    ...Object.fromEntries([
      ...columns.flat().map(d => {
        const id = d.id
        const isDateType = [`datetime`, `date`].includes(DH.switchColType({type: d.type}))

        const value = theApRequest?.cf?.[id]?.value

        if (!value && isDateType) {
          return [id, defaultDate]
        }

        return [id, value]
      }),

      ...new Array(maxReceiver).fill(``).map((_, i) => {
        const id = `receiver${i + 1}`
        const value = theApRequest?.ApReceiver?.[i]?.User?.id
        return [id, value]
      }),
    ]),
  }

  const {BasicForm, latestFormData} = useBasicFormProps({
    columns,
    formData: defaultValues,
  })

  const onSubmit = useCallback(
    async ({data}) => {
      const ApReceiverCreate = receiverColumns
        .map(d => {
          if (!data[d.id]) return null
          return {User: {connect: {id: Number(data[d.id])}}}
        })
        .filter(d => d)

      const ApRequestUpsertPayload: Prisma.ApRequestUpsertArgs = {
        where: {id: theApRequest?.id ?? 0},
        create: {
          ApRequestTypeMaster: {connect: {id: ApRequestType.id}},
          ApSender: {create: {User: {connect: {id: session.id}}}},
          ApReceiver: {
            create: ApReceiverCreate,
          },
          ApCustomFieldValue: {
            create: createApCustomFieldValueCreateArgs({data: latestFormData, ApCustomField, mode: `create`, theApRequest}),
          },
        },
        update: {
          ApRequestTypeMaster: {connect: {id: ApRequestType.id}},
          ApSender: {
            connect: {id: theApRequest?.ApSender?.id ?? 0},
          },
          ApCustomFieldValue: {
            update: createApCustomFieldValueCreateArgs({data: latestFormData, ApCustomField, mode: `update`, theApRequest}),
          },
        },
      }
      if (!confirm(`一度申請した稟議は取り下げができません。よろしいですか？`)) return

      return toggleLoad(
        async () => {
          const apRequestUpsertRes = await fetchUniversalAPI(`apRequest`, `upsert`, ApRequestUpsertPayload)
          return apRequestUpsertRes
        },
        {refresh: true}
      )
    },
    [session, ApRequestType, receiverColumns, toggleLoad, latestFormData]
  )

  return {
    Form: BasicForm,
    columns,
    defaultValues,
    onSubmit,
  }
}

const createColumns = ({ApCustomField, ApRequestType, ApRequestTypeConfigs, maxReceiver}) => {
  const receiverColumns = new Array(maxReceiver).fill(``).map((_, i) => {
    const colObj: colType = {
      id: `receiver${i + 1}`,
      label: `承認者${i + 1}`,
      type: `select`,
      forSelect: {config: {modelName: `user`}},
    }

    return colObj
  }) as any
  const columns = new Fields([
    ...receiverColumns,
    ...(ApCustomField ?? []).map(d => {
      const type = d.type as any

      const options = ApRequestTypeConfigs[ApRequestType.name]?.cfList?.find(e => e.name === d.name)?.options
      const forSelect = [`radio`].includes(type)
        ? {
            optionsOrOptionFetcher: options,
          }
        : undefined
      return {
        id: d.name,
        label: d.name,
        type,
        form: {
          register: d.required ? {required: `必須です`} : undefined,
        },
        forSelect,
      }
    }),
  ]).transposeColumns()

  return {receiverColumns, totalColumns: columns}
}

const createApCustomFieldValueCreateArgs = ({data, ApCustomField, mode, theApRequest}) => {
  const customeFieldList = ApCustomField.flat().filter(d => data[d.name])

  const ApCustomFieldValueCreateArgs = customeFieldList.map(d => {
    const type = d.type as any
    let value = data?.[d.name] as any

    let valueKey = 'string'
    if ([`date`, `datetime`].includes(type)) {
      valueKey = 'date'

      value = new Date(value)
    }
    if ([`number`].includes(type)) valueKey = 'number'
    if ([`radio`].includes(type)) valueKey = 'string'

    const currentApCustomFieldValue = theApRequest?.ApCustomFieldValue.find(e => e.ApCustomField.name === d.name)
    let result = {}

    if (mode === `create`) {
      result = {
        ApCustomField: {connect: {id: d.id}},
        [valueKey]: value,
      }
    } else if (mode === `update`) {
      result = {
        where: {id: currentApCustomFieldValue?.id ?? 0},
        data: {
          ApCustomField: {connect: {id: d.id}},
          [valueKey]: value,
        },
      }
    }

    return result
  })
  return ApCustomFieldValueCreateArgs
}
