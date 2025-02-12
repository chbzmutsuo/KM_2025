import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import {requestResultType} from '@cm/types/types'
import {genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/getGenbaScheduleStatus'

import {NotifyAfterApRequestStatusUpdate} from 'src/non-common/(chains)/NotifyAfterApRequestStatusUpdate'

type chainType = {
  [key in PrismaModelNames]?: {
    when: prismaMethodType[]
    do: (props: {res: requestResultType; queryObject: any}) => Promise<requestResultType>
  }[]
}
export const prismaChain: chainType = {
  apRequest: [
    {
      when: [`upsert`, `update`, `create`],
      do: async ({res, queryObject}) => {
        await NotifyAfterApRequestStatusUpdate({
          requestId: res.result.id,
        })

        // if (!isDev) {
        //   await prisma.apRequest.update({
        //     where: {id: res.result.id},
        //     data: {status: `確定`, forceApproved: true},
        //   })
        // }

        return res
      },
    },
  ],
  genbaDay: [
    {
      when: [`upsert`, `update`, `create`],
      do: async ({res, queryObject}) => {
        await genbaDayUpdateChain({genbaId: res.result.genbaId})
        return res
      },
    },
  ],
}
