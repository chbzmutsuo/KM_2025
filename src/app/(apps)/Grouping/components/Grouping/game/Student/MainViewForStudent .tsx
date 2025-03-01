import React from 'react'
import {getColorStyles} from '@cm/lib/methods/common'

import GroupViewer from '../Teacher/GroupHandler/GroupViewer/GroupViewer'
import {anyObject} from '@cm/types/types'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Alert} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import {Center, C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {IconBtn} from '@components/styles/common-components/IconBtn'

export default function MainViewForStudent({GameCtxValue}) {
  const {Game, player, activeGroup, GAME_CLASS, activeGroupsWithRoles, randomSamplingInfo, toggleLoad} = GameCtxValue

  const roles = Game.LearningRoleMasterOnGame

  const randamlyPicked = randomSamplingInfo?.targetStudentIds?.includes(player?.id)

  const RandomQuestionStarter = () => {
    return (
      <Alert color="red" className={`py-4 text-center`}>
        <Button
          color="red"
          onClick={async e => {
            toggleLoad(async () => {
              await fetchUniversalAPI(`answer`, 'create', {
                data: {gameId: Game.id, studentId: player.id},
              })
            })
          }}
        >
          回答する
        </Button>
      </Alert>
    )
  }

  const ShowGroupViwer = () => {
    const groupsWithRoles = activeGroupsWithRoles
    let me: anyObject = {}
    groupsWithRoles.find((squad, i) => {
      squad.find((s, j) => {
        if (s.Student.id === player.id) {
          me = {...s.Student, groupIndex: i + 1}
        }
      })
    })

    const {name, roleInGroup, groupIndex} = me ?? {}

    const {color} = roles.find(d => d.name === roleInGroup)
    return (
      <div>
        <div className={`col-stack  my-4 items-center gap-4 text-xl`}>
          <R_Stack>
            <IconBtn className={` bg-sub-main  w-fit px-2 text-2xl text-white `}>{groupIndex}</IconBtn>
            <span>班の</span>

            <IconBtn className={`  w-fit px-4 text-2xl `} style={{...getColorStyles(color)}}>
              {me.roleInGroup}
            </IconBtn>
            <span>係です</span>
          </R_Stack>
        </div>
        <GroupViewer {...{GameCtxValue, groupsWithRoles, forStudent: true, studentId: player.id}} />
      </div>
    )
  }

  return (
    <Center className={`t-paper    p-2`}>
      <C_Stack className={`gap-3`}>
        {
          <span className={`text-3xl font-bold`}>
            {player.name} <small>さん</small>
          </span>
        }
        {randamlyPicked && <RandomQuestionStarter />}
        {activeGroup && <ShowGroupViwer />}
      </C_Stack>
    </Center>
  )
}
