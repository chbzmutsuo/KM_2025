'use client'
import React from 'react'

import SimpleTable from '@cm/components/utils/SimpleTable'

import ChildCreator from '@cm/components/DataLogic/RTs/ChildCreator/ChildCreator'
import {ColBuilder} from '@app/(apps)/Advantage/(utils)/class/ColBuilder'

import BuyTicket from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/BuyTicket'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Alert} from '@components/styles/common-components/Alert'

const Payment = ({LessonLog, useGlobalProps, settickets}) => {
  const {accessScopes} = useGlobal()
  const {isCoach} = accessScopes().getAdvantageProps()

  const {isPassed, isPaid} = LessonLog ?? {}
  return (
    <section>
      <div className={`max-w-sm items-stretch   `}>
        <BuyTicket {...{LessonLog, settickets}} />
        <ChildCreator
          {...{
            ParentData: LessonLog,
            models: {parent: 'lessonLog', children: 'ticket'},
            myTable: {
              style: {maxHeight: 400},
              update: isCoach ? true : false,
              delete: isCoach,
              create: false,
            },
            additional: {
              payload: {userId: LessonLog?.userId ?? 0},
              orderBy: [{createdAt: 'asc'}],
            },
            useGlobalProps,
            columns: ColBuilder.ticket({
              useGlobalProps,
              ColBuilderExtraProps: {
                inLessonPage: true,
              },
            }),
          }}
        />

        <Alert color="blue">
          ご入金先
          <SimpleTable
            {...{
              headerArr: ['銀行名', '支店', '口座', '口座番号'],
              bodyArr: [['三井住友銀行', '伊丹支店', '普通355', '5165611']],
            }}
          />
        </Alert>
      </div>
    </section>
  )
}

export default Payment
