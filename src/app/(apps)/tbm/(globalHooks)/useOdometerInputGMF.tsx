import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {Button} from '@components/styles/common-components/Button'
import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {atomTypes} from '@hooks/useJotai'
import {createUpdate, fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import React from 'react'

export default function useOdometerInputGMF() {
  return useGlobalModalForm<atomTypes[`odometerInputGMF`]>(`odometerInputGMF`, null, {
    mainJsx: ({GMF_OPEN, setGMF_OPEN}) => {
      const useGlobalProps = useGlobal()
      const {OdometerInput} = GMF_OPEN ?? {}
      const {date, TbmVehicle, odometerStart, odometerEnd} = OdometerInput ?? {}

      const {BasicForm, latestFormData} = useBasicFormProps({
        formData: {
          date,
          tbmVehicleId: TbmVehicle?.id,
          odometerStart,
          odometerEnd,
        },
        columns: ColBuilder.dometerInput({useGlobalProps}),
      })

      return (
        <BasicForm
          {...{
            latestFormData,
            onSubmit: async data => {
              const {date, tbmVehicleId, odometerStart, odometerEnd} = data
              useGlobalProps.toggleLoad(async () => {
                const res = await fetchUniversalAPI(`odometerInput`, `upsert`, {
                  where: {unique_tbmVehicleId_date: {tbmVehicleId: TbmVehicle?.id, date: date}},
                  ...createUpdate({odometerStart, odometerEnd, tbmVehicleId, date}),
                })
                toastByResult(res)
                setGMF_OPEN(null)
              })
            },
          }}
        >
          <Button>設定</Button>
        </BasicForm>
      )
    },
  })
}
