'use client'

import SingleChatItem from '@app/(apps)/Advantage/(utils)/components/chat/message/SingleChatItem'

import useWindowSize from '@cm/hooks/useWindowSize'
import {CSSProperties, useEffect, useRef, useState} from 'react'
import ChatSendForm from '@app/(apps)/Advantage/(utils)/components/chat/systemChat/ChatSendForm'
import PlaceHolder from '@cm/components/utils/loader/PlaceHolder'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {C_Stack} from '@components/styles/common-components/common-components'

const SystemChat = ({chatRoom}) => {
  const User = chatRoom.User
  const useGlobalProps = useGlobal()
  const {toggleLoad, session, query} = useGlobal()
  const [messages, setmessages] = useState<any[]>(chatRoom.SystemChat)
  useEffect(() => {
    setmessages(chatRoom.SystemChat)
  }, [query])

  const {width, height} = useWindowSize()
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const chatInputterHeight = 250
  const chatListHeight = height - chatInputterHeight - 50

  const baseWidth = 700
  const maxWidth = width * 0.9
  const textareaStyle = {width: baseWidth, maxWidth}
  const wrapperStyle: CSSProperties = {
    border: '1px solid #ddd',
    maxHeight: height - 150,
    ...textareaStyle,
  }

  const scrollToBottom = () => {
    const id = lastMessageRef.current?.id ?? ''
    const element = document.getElementById(id)
    element?.scrollIntoView?.({
      behavior: 'smooth',
    })
  }

  const SenderHeight = 180
  const messageListHeight = height - SenderHeight - 150

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 50)
  }, [lastMessageRef.current])

  if (width === 0) return <PlaceHolder />
  return (
    <div className={` relative mx-auto max-w-[700px]`}>
      <div className={``}>{User.name}さんトークルーム</div>
      <div style={{...wrapperStyle, margin: 'auto', marginTop: 40}}>
        <div className={` mx-auto   justify-between`}>
          <div
            style={{
              height: messageListHeight,
              overflow: 'auto',

              background: 'red,',
            }}
          >
            <MessageList {...{messages, setmessages, useGlobalProps, lastMessageRef}} />
          </div>

          <div className={`sticky bottom-0 mx-auto `} style={{height: SenderHeight}}>
            <C_Stack>
              <ChatSendForm
                {...{
                  toggleLoad,

                  textareaStyle,
                  chatRoom,
                  session,
                  messages,
                  setmessages,
                  scrollToBottom,
                }}
              />
            </C_Stack>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SystemChat

const MessageList = ({messages, setmessages, useGlobalProps, lastMessageRef}) => {
  return (
    <section className={` h-full p-1`}>
      {messages?.map((commentObject, i) => {
        return (
          <div key={i} id={`message-${i}`} ref={lastMessageRef}>
            <SingleChatItem
              {...{
                modelName: `systemChat`,
                setmessages,
                commentObject,
                useGlobalProps,
              }}
            />
          </div>
        )
      })}
      {/* 編集欄 */}
    </section>
  )
}
