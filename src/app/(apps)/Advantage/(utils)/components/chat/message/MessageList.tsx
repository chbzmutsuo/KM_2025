import SingleChatItem from '@app/(apps)/Advantage/(utils)/components/chat/message/SingleChatItem'
import useGlobal from '@hooks/globalHooks/useGlobal'

const MessageList = ({messages, setmessages, deleteMessage, lastMessageRef}) => {
  const useGlobalProps = useGlobal()

  return (
    <section className={`h-full p-1`}>
      {messages?.map((commentObject, i) => {
        return (
          <div id={`message-${i}`} key={i} ref={i === messages.length - 1 ? lastMessageRef : null}>
            <SingleChatItem
              {...{
                setmessages,
                useGlobalProps,
                commentObject,
                deleteMessage: () => deleteMessage(commentObject.id),
              }}
            />
          </div>
        )
      })}
      {/* 編集欄 */}
    </section>
  )
}

export default MessageList
