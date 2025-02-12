'use client'

import {Advantage} from '@app/(apps)/Advantage/(utils)/class/Advantage'
import {cl} from '@cm/lib/methods/common'
import {HREF} from '@cm/lib/methods/urls'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
import {ChevronDoubleRightIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import Link from 'next/link'

const LessonList = ({bigCategories}) => {
  const {session, query} = useGlobal()

  const {data: myLessonLog = []} = usefetchUniversalAPI_SWR(`lessonLog`, 'findMany', {
    where: {userId: session?.id},
  })

  return (
    <>
      <div className={`p-1`}>
        <C_Stack className={` gap-8`}>
          {bigCategories?.map((BC, i) => {
            return (
              <Paper key={i} className={`p-2`}>
                <div>
                  <p className={`text-3xl font-bold`} style={{fontWeight: 900}}>
                    {BC.name}{' '}
                  </p>

                  <C_Stack className={`gap-4`}>
                    {BC.MiddleCategory.map((MC, j) => {
                      return (
                        <Paper key={j} className={`p-2`}>
                          <div className={`col-stack md:row-stack`}>
                            <p className={`w-40 text-xl font-bold`}>{MC.name}</p>
                            <R_Stack className={`gap-2`}>
                              {MC.Lesson.map((lesson, k) => {
                                //一つ前のレッスン
                                const prevLesson = (() => {
                                  const TheLessonLog = myLessonLog?.find(log => log.lessonId === MC.Lesson?.[k - 1]?.id)
                                  return {...Advantage.getLessonLogInfo({LessonLog: TheLessonLog})}
                                })()

                                // 最新のレッスン
                                const currentLesson = (() => {
                                  const TheLessonLog = myLessonLog?.find(log => log.lessonId === MC.Lesson?.[k - 0]?.id)
                                  return {...Advantage.getLessonLogInfo({LessonLog: TheLessonLog})}
                                })()

                                const isActive = prevLesson.isPassed || k === 0

                                const classesBeforePayment = cl(
                                  currentLesson.isInProcess
                                    ? !currentLesson.isPaid
                                      ? 'bg-blue-400 border-2 border-blue-600  animate-pulse'
                                      : ''
                                    : 'bg-blue-200 animate-pulse '
                                )
                                const classesAfterPayment = cl(
                                  currentLesson.isPassed ? 'bg-blue-main text-white' : '',
                                  currentLesson.isInProcess ? 'bg-blue-200 animate-pulse  text-white' : ''
                                )

                                return (
                                  <div key={k} className={`col-stack md:row-stack mx-auto items-center`}>
                                    <Link
                                      key={k}
                                      href={HREF(`/Advantage/lesson/${lesson.id}`, {}, query)}
                                      className={cl(
                                        `icon-btn mx-auto w-[270px] md:w-fit`,
                                        `text-sub-main px-8 py-2`,
                                        isActive
                                          ? currentLesson.isPaid
                                            ? classesAfterPayment
                                            : classesBeforePayment
                                          : 'disabled bg-gray-400 '
                                      )}
                                    >
                                      {lesson.name}
                                    </Link>
                                    {k !== MC.Lesson.length - 1 && <ChevronDoubleRightIcon className={`hidden w-5 md:block`} />}
                                  </div>
                                )
                              })}
                            </R_Stack>
                            {/* <MemberViwer
                            maxCount={4}
                            itemStyle={{
                              width: 'fit-content',
                              fontSize: 18,
                              background: '#f5f5f5',
                            }}
                            items=
                          /> */}
                          </div>
                        </Paper>
                      )
                    })}
                  </C_Stack>
                </div>
              </Paper>
            )
          })}
        </C_Stack>
      </div>
    </>
  )
}

export default LessonList
