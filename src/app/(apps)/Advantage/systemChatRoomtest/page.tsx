import SystemChat from '@app/(apps)/Advantage/(utils)/components/chat/systemChat/SystemChat'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {PrismaModelNames} from '@cm/types/prisma-types'

const DynamicMasterPage = async props => {
  const query = await props.searchParams;
  const params = await props.params;
  const dataModelName = params.dataModelName as PrismaModelNames
  const {session} = await initServerComopnent({query})

  let chatRoomId = query.chatRoomId ? Number(query.chatRoomId) : undefined
  if (!chatRoomId) {
    const {result: chatRoom} = await fetchUniversalAPI('systemChatRoom', 'upsert', {
      userId: session?.id,
      where: {userId: session?.id},
    })
    chatRoomId = chatRoom.id
  }

  const {result: chatRoom} = await fetchUniversalAPI('systemChatRoom', 'findUnique', {
    where: {
      chatRoomId,
    },
    include: {
      SystemChat: {
        include: {User: {}},
      },
    },
  })

  return
  return (
    <div className={` mx-auto `}>
      <SystemChat {...{chatRoom}} />
    </div>
  )
}

export default DynamicMasterPage
