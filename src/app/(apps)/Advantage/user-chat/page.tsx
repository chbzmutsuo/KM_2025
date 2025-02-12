import {QueryBuilder} from '@app/(apps)/Advantage/(utils)/class/QueryBuilder'
import SystemChat from '@app/(apps)/Advantage/(utils)/components/chat/systemChat/SystemChat'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import prisma from '@cm/lib/prisma'

const UserChatPage = async props => {
  const query = await props.searchParams;
  const {session} = await initServerComopnent({query})
  const include = QueryBuilder.getInclude({}).systemChatRoom.include

  let chatRoomId: any = undefined
  let chatRoom = await prisma.systemChatRoom.findFirst({
    include,
    where: {userId: session.id},
  })
  chatRoomId = chatRoom?.id
  if (!chatRoom) {
    const newChatRoom = await prisma.systemChatRoom.create({
      data: {
        userId: session.id,
      },
    })
    chatRoomId = newChatRoom.id
  }

  chatRoom = await prisma.systemChatRoom.findUnique({
    include,
    where: {id: chatRoomId},
  })

  return (
    <>
      <SystemChat {...{chatRoom}} />
    </>
  )
}

export default UserChatPage
