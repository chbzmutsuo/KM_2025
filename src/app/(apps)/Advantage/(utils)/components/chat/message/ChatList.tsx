import ChatSender from '@app/(apps)/Advantage/(utils)/components/chat/message/ChatSender'
import MessageList from '@app/(apps)/Advantage/(utils)/components/chat/message/MessageList'
import {C_Stack} from '@components/styles/common-components/common-components'

import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'

const ChatList = ({tickets, settickets, messages, setmessages, LessonLog, additional, lastMessageRef, scrollToBottom}) => {
  const useGlobalProps = useGlobal()
  const {height, toggleLoad} = useGlobalProps

  const chatInputterHeight = 250
  const chatListHeight = height - chatInputterHeight - 120
  const deleteMessage = async id => {
    if (confirm('本当に削除しますか？')) {
      await toggleLoad(async () => {
        const result = await fetchUniversalAPI('comment', 'delete', {where: {id: id}})
        toastByResult(result)
        return result
      })
    }
  }

  return (
    <div>
      <C_Stack className={`t-paper   justify-between`}>
        <div style={{height: chatListHeight, minHeight: chatListHeight, overflow: 'auto'}}>
          <MessageList {...{messages, setmessages, deleteMessage, lastMessageRef}} />
        </div>
        <hr />

        <div>
          <div onClick={scrollToBottom}></div>
          <ChatSender
            {...{
              chatInputterHeight,
              tickets,
              settickets,
              scrollToBottom,
              lastMessageRef,
              LessonLog,
              messages,
              setmessages,
              additional,
            }}
          />
        </div>
      </C_Stack>
    </div>
  )
}
export default ChatList
