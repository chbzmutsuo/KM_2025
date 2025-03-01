import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {Button} from '@components/styles/common-components/Button'
import {R_Stack} from '@components/styles/common-components/common-components'
import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {atomTypes} from '@hooks/useJotai'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'
import React from 'react'

type formData = {
  id: number
  date: Date
  userId: number
  tbmVehicleId: number
  tbmRouteGroupId: number
  tbmBaseId: number
}
export default function useHaishaTableEditorGMF() {
  return useGlobalModalForm<atomTypes[`haishaTableEditorGMF`]>(`haishaTableEditorGMF`, null, {
    mainJsx: ({GMF_OPEN, setGMF_OPEN}) => {
      const useGlobalProps = useGlobal()
      const {user, date, tbmDriveSchedule, tbmBase} = GMF_OPEN ?? {}

      const {BasicForm, latestFormData} = useBasicFormProps({
        columns: ColBuilder.tbmDriveSchedule({
          useGlobalProps,
          ColBuilderExtraProps: {
            tbmBase,

            tbmDriveSchedule: tbmDriveSchedule ?? {
              date,
              userId: user.id,
            },
          },
        }),
      })
      return (
        <BasicForm
          {...{
            latestFormData,
            onSubmit: async (data: formData) => {
              useGlobalProps.toggleLoad(async () => {
                const queryObject: Prisma.TbmDriveScheduleUpsertArgs = {
                  where: {id: tbmDriveSchedule?.id ?? 0},
                  create: data,
                  update: data,
                }

                const res = await fetchUniversalAPI(`tbmDriveSchedule`, `upsert`, queryObject)
                toastByResult(res)
                setGMF_OPEN(null)
              })

              //
            },
          }}
        >
          <R_Stack className={`w-full justify-between gap-6`}>
            <Button
              color={`red`}
              type={`button`}
              {...{
                onClick: async () => {
                  if (confirm(`削除しますか？`)) {
                    useGlobalProps.toggleLoad(async () => {
                      const res = await fetchUniversalAPI(`tbmDriveSchedule`, `delete`, {
                        where: {id: tbmDriveSchedule?.id ?? 0},
                      })
                      toastByResult(res)
                      setGMF_OPEN(null)
                    })
                  }
                },
              }}
            >
              削除
            </Button>
            <Button>設定</Button>
          </R_Stack>
        </BasicForm>
      )
    },
  })
}
