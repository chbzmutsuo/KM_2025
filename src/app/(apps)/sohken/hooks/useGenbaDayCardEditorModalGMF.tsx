import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@class/Fields/Fields'
import {Button} from '@components/styles/common-components/Button'
import {R_Stack} from '@components/styles/common-components/common-components'

import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {atomTypes} from '@hooks/useJotai'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

import {P_GenbaTask} from 'scripts/generatedTypes'

export const useGenbaDayCardEditorModalGMF = () => {
  return useGlobalModalForm<atomTypes[`GenbaDayCardEditorModalGMF`]>(`GenbaDayCardEditorModalGMF`, null, {
    mainJsx: props => {
      const close = props.close
      const {router, toggleLoad} = useGlobal()

      const {taskMidTable, genbaId, genbaDayId} = props.GMF_OPEN
      const {data: GenbaTask = []} = usefetchUniversalAPI_SWR(`genbaTask`, `findMany`, {
        where: {genbaId: genbaId ?? 0},
      })

      const {BasicForm, latestFormData} = useBasicFormProps({
        formData: {
          genbaTaskId: Number(taskMidTable?.genbaTaskId),
          requiredNinku: Number(taskMidTable?.GenbaTask?.requiredNinku),
        },
        columns: new Fields([
          {
            id: 'genbaTaskId',
            label: 'タスク',
            form: {...defaultRegister},
            forSelect: {
              optionsOrOptionFetcher: GenbaTask.map((d: P_GenbaTask) => {
                return {value: d.name, id: d.id, color: ''}
              }),
            },
          },
          {
            id: 'requiredNinku',
            label: '人工',
            type: `number`,
            form: {},
          },
        ]).transposeColumns(),
      })

      const onSubmit = async data => {
        toggleLoad(async () => {
          const genbaTaskId = Number(data.genbaTaskId)
          const args: Prisma.GenbaDayTaskMidTableUpsertArgs = {
            where: {id: taskMidTable?.id ?? 0},
            create: {genbaTaskId, genbaDayId},
            update: {
              genbaTaskId,
              genbaDayId,
            },
          }
          const res = await fetchUniversalAPI(`genbaDayTaskMidTable`, `upsert`, args)

          await fetchUniversalAPI(`genbaTask`, `update`, {
            where: {id: genbaTaskId},
            data: {requiredNinku: Number(data.requiredNinku)},
          })

          toastByResult(res)
          router.refresh()
          close()
        })
      }
      return (
        <div>
          <BasicForm {...{onSubmit, latestFormData}}>
            <R_Stack className={` justify-between gap-4 `}>
              <Button
                color={`red`}
                type={`button`}
                onClick={async () => {
                  if (!confirm('削除しますか？')) return

                  toggleLoad(async () => {
                    await fetchUniversalAPI(`genbaDayTaskMidTable`, `delete`, {
                      where: {
                        id: taskMidTable.id,
                      },
                    })
                  })
                  close()
                }}
              >
                削除
              </Button>
              <Button>確定</Button>
            </R_Stack>
          </BasicForm>
        </div>
      )
    },
  })
}
