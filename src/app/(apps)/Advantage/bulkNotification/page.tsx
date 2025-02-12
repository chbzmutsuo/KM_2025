import BulkNotificationClient from '@app/(apps)/Advantage/bulkNotification/BulkNotificationClient'

import {initServerComopnent} from 'src/non-common/serverSideFunction'
import prisma from '@cm/lib/prisma'

export default async function Page(props) {
  const query = await props.searchParams;
  const {session, scopes} = await initServerComopnent({query})

  const students = await prisma.user.findMany({
    where: {
      membershipName: `生徒`,
    },
    include: {
      SystemChatRoom: {
        include: {SystemChat: true},
      },
    },
  })

  return (
    <div>
      <div className={`p-2`}>
        <BulkNotificationClient {...{students}} />
      </div>
    </div>
  )
}
