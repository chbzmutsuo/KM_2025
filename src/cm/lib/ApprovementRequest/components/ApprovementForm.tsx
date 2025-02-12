import {Fields} from '@class/Fields/Fields'
import {Alert} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import { R_Stack} from '@components/styles/common-components/common-components'
import Accordion from '@components/utils/Accordions/Accordion'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {ApRequestForm} from '@lib/ApprovementRequest/components/ApRequestForm'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'
import React from 'react'

export default function ApprovementForm({
  theApReceiver,
  ApRequestType,
  ApRequestTypeConfigs,
  theApRequest,

  handleApprovementFormModalClose,
  isSuperUser = false,
}) {
  const useGlobalProps = useGlobal()
  const {session, accessScopes, router} = useGlobalProps

  const columns = new Fields([
    ...new Fields([
      {
        id: 'status',
        label: 'ステータス',
        forSelect: {
          optionsOrOptionFetcher: [
            {value: '却下', color: '#FF0000'},
            {value: '承認', color: '#008000'},
          ],
        },
      },
      {id: 'comment', label: 'コメント', form: {}},
    ]).plain,
  ]).transposeColumns()

  if (session.id == theApReceiver.userId || isSuperUser) {
    const {BasicForm} = useBasicFormProps({columns})
    const onSubmit = async data => {
      const args: Prisma.ApRequestUpdateArgs = {
        where: {id: theApRequest.id},
        data: {
          ApReceiver: {
            update: {
              where: {id: theApReceiver.id},
              data: {status: data.status},
            },
          },
        },
      }
      await fetchUniversalAPI(`apRequest`, `update`, {
        where: args.where,
        ...args.data,
      })
      // await fetchUniversalAPI(`apReceiver`, `update`, {
      //   where: {id: theApReceiver.id},
      //   status: data.status,
      // })
      handleApprovementFormModalClose(null)
      router.refresh()
    }

    return (
      <div>
        <strong>{theApReceiver.User?.name}</strong>
        <R_Stack className={` items-start justify-around gap-8`}>
          <Accordion {...{label: `起案内容`, defaultOpen: true}}>
            <ApRequestForm {...{ApRequestList: history, ApRequestType, ApRequestTypeConfigs, theApRequest}} />
          </Accordion>
          <Accordion {...{label: `承認入力`, defaultOpen: true}}>
            <BasicForm onSubmit={onSubmit}>
              <Button>確定</Button>
            </BasicForm>
          </Accordion>
        </R_Stack>
      </div>
    )
  }
  return (
    <Alert color={`red`}>
      <div>ユーザー権限がありません</div>
    </Alert>
  )
}
