'use client'
import React, {useId, useState} from 'react'
import {DetailPagePropType, requestResultType} from '@cm/types/types'
import FormHeader from 'src/cm/components/DataLogic/TFs/MyForm/FormHeader'
import {myFormDefault} from 'src/cm/constants/defaults'
import {Button} from 'src/cm/components/styles/common-components/Button'
import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'
import {liftUpNewValueOnChangeType} from '@cm/types/form-control-type'
import {UseFormReturn} from 'react-hook-form'
import useDataUpdated from 'src/cm/components/DataLogic/TFs/ClientConf/useDataUpdated'

import {prismaDataExtractionQueryType} from '@components/DataLogic/TFs/Server/Conf'
import {UpsertMain} from '@components/DataLogic/TFs/MyForm/UpsertMain'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {toast} from 'react-toastify'

export default function MyForm(props: DetailPagePropType) {
  const [uploading, setuploading] = useState(false)
  const {addUpdated} = useDataUpdated()

  const prismaDataExtractionQuery = props?.prismaDataExtractionQuery as prismaDataExtractionQueryType
  props = {
    ...props,
    myForm: {...myFormDefault, ...props.myForm},
  }

  const {mutateRecords, dataModelName, myForm, formData, setformData, columns, editType, additional} = props

  const {session} = props.useGlobalProps
  const formId = useId()

  const onFormItemBlur = columns.flat().find(col => col?.onFormItemBlur)?.onFormItemBlur

  const {BasicForm, ReactHookForm, extraFormState, latestFormData} = useBasicFormProps({
    columns: props?.columns,
    formData: formData ?? {},
    values: formData ?? {},
    autoApplyProps: {},
    onFormItemBlur: onFormItemBlur,
  })

  const handleOnSubmit = async () => {
    try {
      if (latestFormData.password) {
        if (!confirm(`フォームの値にパスワードが含まれています。\nパスワードを変更しますか？`)) {
          return alert(`データ更新を中止しました。`)
        }
      }

      setuploading(true)

      const res = await UpsertMain({
        prismaDataExtractionQuery,
        latestFormData,
        upsertController: myForm?.create,
        extraFormState,
        dataModelName,
        additional,
        formData: formData ?? {},
        columns,
      })

      if (res?.success !== true) {
        toast.error(`エラーが発生しました。(no response success)`)
        setuploading(false)
        return res
      }

      //データを取得して、レコードを変更する
      await findTheDataAndChangeRecord({res})
      //モーダルを閉じるなどのクローズ処理を実行する
      await handleClosing(res)
      setformData(null)

      addUpdated()
      setuploading(false)
      return res
    } catch (error) {
      console.error(error.stack)
      setuploading(false)
      return {
        success: false,
        message: `エラーが発生しました:` + error.message,
        error: error,
        result: null,
      }
    }

    async function findTheDataAndChangeRecord({res}) {
      const {result: refetchedDataWithInclude} = await fetchUniversalAPI(dataModelName, `findUnique`, {
        where: {id: res?.result?.id},
        include: additional?.include,
      })

      mutateRecords({record: refetchedDataWithInclude})
    }

    async function handleClosing(res: requestResultType) {
      const hasId = !!formData?.id

      if (editType?.type === 'modal' || !hasId) {
        setformData(null)
      }
    }
  }

  const updateMode = props.formData?.id

  const loggerId = `myform-${props.dataModelName}`
  return (
    <div id={`myform-${formId}`} style={{...myForm?.style, maxHeight: undefined}} className={` m-0.5  `}>
      <section>
        <FormHeader {...{myForm, formData}} />
        <div>{props.myForm?.customActions && props.myForm?.customActions({...props, ReactHookForm})}</div>
      </section>

      <section className={` mx-auto w-fit`}>
        <BasicForm
          {...{
            onSubmit: handleOnSubmit,
            className: props?.myForm?.basicFormClassName,
            ControlOptions: props?.myForm?.basicFormControlOptions,
          }}
        >
          <div className={` sticky bottom-0  w-full    pt-2 text-center `}>
            <Button disabled={uploading} className={` w-[200px] max-w-[80vw] p-1 `} color={updateMode ? 'blue' : 'primary'}>
              {updateMode ? '更新' : '新規作成'}
            </Button>
          </div>
        </BasicForm>
      </section>
    </div>
  )
}

export const liftUpNewValueOnChange: liftUpNewValueOnChangeType = (props: {id; newValue; ReactHookForm: UseFormReturn}) => {
  const {id, newValue, ReactHookForm} = props
  const before = ReactHookForm.getValues()[id]

  try {
    ReactHookForm.setValue(id, newValue)
  } catch (error) {
    console.error(error.stack) //////////
  }
}
