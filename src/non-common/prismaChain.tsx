import {prismaMethodType, PrismaModelNames} from '@cm/types/prisma-types'
import {requestResultType} from '@cm/types/types'
import {genbaDayUpdateChain} from 'src/non-common/(chains)/getGenbaScheduleStatus/genbaDayUpdateChain'

type chainType = {
  [key in PrismaModelNames]?: {
    when: prismaMethodType[]
    do: (props: {res: requestResultType; queryObject: any}) => Promise<requestResultType>
  }[]
}
export const prismaChain: chainType = {
  genbaDay: [
    {
      when: [`upsert`, `update`, `create`, `updateMany`],
      do: async ({res, queryObject}) => {
        await genbaDayUpdateChain({genbaId: res.result.genbaId})
        return res
      },
    },
  ],
}
