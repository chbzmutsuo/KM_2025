import {Fields} from '@cm/class/Fields/Fields'

import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'
import {fetchUniversalAPI, toastByResult, updateWithImageAndAddUrlToLatestFormData} from '@lib/methods/api-fetcher'
import {Button} from '@components/styles/common-components/Button'

const ChatSendForm = ({toggleLoad, textareaStyle, chatRoom, session, messages, setmessages, scrollToBottom}) => {
  const chatColumns = Fields.transposeColumns([
    {id: 'url', label: 'メッセージ', type: 'file', form: {}},
    {
      id: 'message',
      label: 'メッセージ',
      type: 'textarea',
      form: {style: {...textareaStyle, height: 100}},
    },
  ])
  const {latestFormData, BasicForm, extraFormState, ReactHookForm, setextraFormState} = useBasicFormProps({
    columns: chatColumns,
  })

  const onSubmit = async data => {
    toggleLoad(async () => {
      const latestFormDataWithImagUrls = await updateWithImageAndAddUrlToLatestFormData({
        latestFormData,
        extraFormState,
        columns: chatColumns,
      })

      // return
      const res = await fetchUniversalAPI('systemChat', 'upsert', {
        ...latestFormDataWithImagUrls,

        systemChatRoomId: chatRoom.id,
        userId: session?.id,
        where: {id: 0},
        include: {User: {}},
      })

      setmessages([...messages, res.result])
      toastByResult(res)
      setextraFormState({})
      ReactHookForm.reset()

      setTimeout(() => {
        scrollToBottom()
      }, 100)
    })
  }

  return (
    <>
      <BasicForm
        {...{
          latestFormData,
          wrapperClass: 'row-stack justify-around  gap-0 items-center  items-stretch ',
          ControlOptions: {
            showLabel: false,
            ControlStyle: {width: 500, maxWidth: '90vw', margin: 'auto'},
          },
        }}
      ></BasicForm>
      <div className={`absolute bottom-[40px] right-[10px]`}>
        <Button onClick={onSubmit} className={` w-fit rounded-sm `}>
          送信
        </Button>
      </div>
    </>
  )
}

export default ChatSendForm
