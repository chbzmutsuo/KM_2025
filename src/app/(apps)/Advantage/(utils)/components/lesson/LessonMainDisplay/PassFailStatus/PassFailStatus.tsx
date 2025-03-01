import {ColBuilder} from '@app/(apps)/Advantage/(utils)/class/ColBuilder'

import ChildCreator from '@cm/components/DataLogic/RTs/ChildCreator/ChildCreator'

import Accordion from '@cm/components/utils/Accordions/Accordion'
import {TrophyIcon} from '@heroicons/react/20/solid'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {cl} from '@cm/lib/methods/common'
import {Button} from '@components/styles/common-components/Button'
import {Center} from '@components/styles/common-components/common-components'

const PassFailStatus = ({LessonLog, useGlobalProps}) => {
  const {toggleLoad} = useGlobalProps
  const isPassed = LessonLog?.isPassed
  const colors = isPassed ? `text-yellow-500 border-yellow-600` : `text-gray-500 border-gray-600 opacity-20`

  return (
    <>
      <Accordion {...{label: `承認コーチ`, defaultOpen: true}}>
        <ChildCreator
          {...{
            ParentData: LessonLog,
            models: {parent: 'lessonLog', children: `lessonLogAuthorizedUser`},
            columns: ColBuilder.lessonLogAuthorizedUser({
              useGlobalProps,
              ColBuilderExtraProps: {
                userId: useGlobalProps.session.id,
              },
            }),
            additional: {
              include: {User: {}},
            },
            useGlobalProps,
          }}
        />
      </Accordion>
      <Accordion {...{label: `合否状況`, defaultOpen: true}}>
        <Center>
          {isPassed ? (
            <Trophy
              onClick={() => {
                if (confirm(`合格を取り消しますか？`)) {
                  toggleLoad(
                    async () => {
                      await fetchUniversalAPI(`lessonLog`, `update`, {
                        where: {
                          id: LessonLog.id,
                        },
                        data: {isPassed: !LessonLog.isPassed},
                      })
                    },
                    {refresh: true}
                  )
                }
              }}
            />
          ) : (
            <Button
              color={`red`}
              onClick={async e => {
                if (!isPassed) {
                  if (confirm(`合格にしますか？`)) {
                    toggleLoad(
                      async () => {
                        await fetchUniversalAPI(`lessonLog`, `update`, {
                          where: {
                            id: LessonLog.id,
                          },
                          data: {
                            isPassed: !LessonLog.isPassed,
                          },
                        })
                      },
                      {refresh: true}
                    )
                  }
                }
              }}
            >
              合格にする
            </Button>
          )}
        </Center>
      </Accordion>
    </>
  )
}

export default PassFailStatus
export const Trophy = heroiconProps => {
  return (
    <TrophyIcon
      {...heroiconProps}
      className={cl(
        `onHover w-[150px] rounded-[100%] border-[2px] border-yellow-600 p-2  text-yellow-500   shadow-md`,
        heroiconProps.className
      )}
    />
  )
}
