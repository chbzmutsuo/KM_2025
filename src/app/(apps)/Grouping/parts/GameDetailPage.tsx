'use client'
import React from 'react'
import MidTable from '@cm/components/DataLogic/RTs/MidTable/MidTable'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import usefetchUniversalAPI_SWR from '@cm/hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
import Accordion from '@cm/components/utils/Accordions/Accordion'
import {HREF} from '@cm/lib/methods/urls'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {RoleSetting} from '@app/(apps)/Grouping/components/Grouping/game/Teacher/RoleSetting'
import {Paper} from '@components/styles/common-components/paper'
import TaskScoring from '@app/(apps)/Grouping/parts/TaskScoring'
import {Button} from '@components/styles/common-components/Button'
import Link from 'next/link'

export default function GameDetailPage(props) {
  const useGlobalProps = useGlobal()
  const {session, query} = useGlobalProps
  const game = props.formData ?? {}
  const {getGroupieScopes} = useGlobalProps.accessScopes()
  const {schoolId, teacherId} = getGroupieScopes()

  const queryObject: Prisma.StudentFindManyArgs = {
    where: {schoolId},
    include: {
      Classroom: {},
    },
    orderBy: [{Classroom: {grade: 'asc'}}, {Classroom: {class: 'asc'}}, {attendanceNumber: 'asc'}],
  }
  const {data: student, isLoading} = usefetchUniversalAPI_SWR('student', 'findMany', {...queryObject}, {deps: []})

  const gamePath = HREF(`/Grouping/game/main/${game.secretKey}`, {as: 'teacher'}, query)
  const {router} = useGlobalProps

  return (
    <C_Stack>
      <Link href={gamePath}>
        <Button color={`blue`}>PLAY</Button>
      </Link>
      <>
        {/* <Button>Play</Button>
        <Button onClick={() => settaskScoringOpen(true)}>学習内容添削</Button>
        <BasicModal
          {...{
            open: taskScoringOpen,
            handleClose: () => settaskScoringOpen(false),
            style: {maxWidth: `95vw`, maxHeight: `95vh`},
          }}
        >
          <div className={`w-[90vw]`}>
            <TaskScoring {...{game}} />
          </div>
        </BasicModal> */}
        {/* <Accordion {...{className: ``, label: `学習内容添削`, defaultOpen: true, closable: false}}></Accordion> */}
      </>

      <R_Stack className={`items-start gap-10`}>
        <C_Stack>
          <Accordion {...{className: `min-w-[350px]`, label: `プロジェクト情報`, defaultOpen: true, closable: false}}>
            <Paper>
              <MyForm {...props} />
            </Paper>
          </Accordion>
        </C_Stack>

        <C_Stack>
          <Accordion {...{className: `min-w-[350px]`, label: `参加者設定`, defaultOpen: true, closable: false}}>
            <Paper>
              <MidTable
                {...{
                  ParentData: game,
                  relation: 'manyToMany',
                  candidates: student,
                  models: {
                    parent: 'game',
                    mid: 'gameStudent',
                    another: 'student',
                  },
                  groupBy: {
                    keyArray: ['Classroom.grade', 'Classroom.class'],
                    joinWith: '-',
                  },
                  keysToShow: {
                    keyArray: ['name'],
                    joinWith: '-',
                  },
                  uniqueRelationalKey: 'unique_gameId_studentId',
                }}
              />
            </Paper>
          </Accordion>
          <Accordion {...{className: `min-w-[280px]`, label: `役割設定`, defaultOpen: true, closable: false}}>
            <Paper>
              <RoleSetting {...{Game: game, useGlobalProps}} />
            </Paper>
          </Accordion>
        </C_Stack>
      </R_Stack>
      <TaskScoring {...{game}} />
    </C_Stack>
  )
}
