'use client'
import {Fields} from '@cm/class/Fields/Fields'
import {FileHandler} from '@cm/class/FileHandler'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {C_Stack, R_Stack} from '@cm/components/styles/common-components/common-components'

import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'

import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {cl} from '@cm/lib/methods/common'
import {Button} from '@components/styles/common-components/Button'
import {IconBtn} from '@components/styles/common-components/IconBtn'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Prisma} from '@prisma/client'

import {useState} from 'react'

const BulkNotificationClient = ({students}) => {
  const {session, toggleLoad} = useGlobal()
  const [targets, settargets] = useState<any>([])

  const {latestFormData, BasicForm, extraFormState} = useBasicFormProps({
    columns: Fields.transposeColumns([
      {
        id: `message`,
        label: `メッセージ`,
        type: `textarea`,
        form: {
          style: {width: 500, height: 200},
          register: {required: `必須`},
        },
      },
      {
        id: `url`,
        label: `画像`,
        type: `file`,
        form: {
          file: {backetKey: `systemChat`},
        },
      },
    ]),
  })

  const sendBuklNotification = async () => {
    toggleLoad(async () => {
      const targetStudents = students.filter(student => targets.includes(student.id))

      const files = extraFormState?.files?.url ?? []
      const updatedFileReses = await Promise.all(
        files.map(async file => {
          const backetKey = `systemChat`
          const fileKey = `url`

          const updatedFileRes = await FileHandler.sendFileToS3({
            file: file.file,
            formDataObj: {
              backetKey: `${backetKey}/${fileKey}`,
            },
          })

          return updatedFileRes
        })
      )
      const url = updatedFileReses[0]?.result?.url ?? ''

      const transactionQueryList: transactionQuery[] = await Promise.all(
        targetStudents.map(async student => {
          const {result: systemChatRoom} = await fetchUniversalAPI(`systemChatRoom`, `upsert`, {
            where: {userId: student.id},
            create: {userId: student.id},
            update: {userId: student.id},
          })

          const payload: Prisma.SystemChatCreateArgs = {
            data: {
              message: latestFormData.message,
              url: url,
              read: false,
              userId: student.id,
              systemChatRoomId: systemChatRoom.id,
            },
          }

          return {
            model: `systemChat`,
            method: `create`,
            queryObject: {
              ...payload,
            },
          }
        })
      )

      await fetchTransactionAPI({transactionQueryList})
    })
  }
  return (
    <C_Stack className={` mx-auto  w-fit items-start`}>
      <BasicForm onSubmit={sendBuklNotification}>
        <Button>送信</Button>
      </BasicForm>

      <R_Stack className={` max-w-[calc(140px*6)] gap-0`}>
        {students.map(student => {
          const active = targets.includes(student.id)
          const toggle = () => {
            if (active) {
              settargets(targets.filter(id => id !== student.id))
            } else {
              settargets([...targets, student.id])
            }
          }
          const activeClass = active ? 'bg-blue-500 text-white' : 'bg-white text-black'

          return (
            <div key={student.id} className={cl(`w-[140px] p-2`)}>
              <IconBtn className={cl(activeClass, `p-2`)} onClick={toggle}>
                <R_Stack>
                  <div>{student.name}</div>
                  <IconBtn color={`blue`}>{student?.SystemChatRoom?.SystemChat?.length}</IconBtn>
                </R_Stack>
              </IconBtn>
            </div>
          )
        })}
      </R_Stack>
    </C_Stack>
  )
}

export default BulkNotificationClient
