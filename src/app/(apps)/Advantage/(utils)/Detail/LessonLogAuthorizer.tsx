'use client'

import {anyObject} from '@cm/types/types'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Paper} from '@components/styles/common-components/paper'
import {R_Stack} from '@components/styles/common-components/common-components'

const LessonLogAuthorizer = (
  props: {
    latestFormData: anyObject
  } & anyObject
) => {
  const {latestFormData} = props
  const useglobalProps = useGlobal()
  const {toggleLoad} = useglobalProps

  const {data: coaches} = usefetchUniversalAPI_SWR(
    'user',
    'findMany',
    {
      where: {membershipName: 'コーチ'},
    },
    {
      deps: [],
    }
  )
  const {data: lessonLog} = usefetchUniversalAPI_SWR('lessonLog', 'findUnique', {
    where: {id: latestFormData?.id},
    include: {LessonLogAuthorizedUser: {include: {User: {}}}},
  })

  if (!lessonLog || !coaches) {
    return <Paper>データを一度作成後に、利用してください</Paper>
  }

  const authorizerIds = lessonLog?.LessonLogAuthorizedUser?.filter(log => log.active).map(log => log.userId)

  return (
    <div>
      <R_Stack>
        {coaches?.map(user => {
          const authorized = authorizerIds?.includes(user.id)

          return (
            <button
              type="button"
              key={user.id}
              className={`icon-btn ${authorized ? 'bg-primary-main text-white' : 'opacity-30'}`}
              onClick={async e => {
                await toggleLoad(async () => {
                  await fetchUniversalAPI('lessonLogAuthorizedUser', 'upsert', {
                    userId: user.id,
                    lessonLogId: lessonLog.id,
                    active: !authorized,

                    where: {
                      unique_userId_lessonLogId: {
                        userId: user.id,
                        lessonLogId: lessonLog.id,
                      },
                    },
                  })
                })
              }}
            >
              {user.name}
            </button>
          )
        })}
      </R_Stack>
    </div>
  )
}

export default LessonLogAuthorizer
