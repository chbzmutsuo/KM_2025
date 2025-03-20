'use client'

import {DetailPagePropType} from '@cm/types/types'

import Accordion from '@cm/components/utils/Accordions/Accordion'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import ChildCreator from '@cm/components/DataLogic/RTs/ChildCreator/ChildCreator'
import {ColBuilder} from '@app/(apps)/sohken/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/sohken/class/QueryBuilder'
import {C_Stack, FitMargin, R_Stack} from '@components/styles/common-components/common-components'

import {TaskAsignBtn} from '@app/(apps)/sohken/(parts)/Tasks/TaskAsignBtn'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import {Alert} from '@components/styles/common-components/Alert'

import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'
import UnUsedScheduleDeleteBtn from '@app/(apps)/sohken/(parts)/Tasks/UnUsedScheduleDeleteBtn'

import {Button} from '@components/styles/common-components/Button'
import {Prisma} from '@prisma/client'
import {getMidnight} from '@class/Days'
import {GenbaCl} from '@app/(apps)/sohken/class/GenbaCl'
import {handleUpdateSchedule} from '@app/(apps)/sohken/(parts)/Tasks/handleUpdateSchedule'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
export const GenbaForm = (props: DetailPagePropType) => {
  const genba = props.formData ?? {}
  const {floorThisPlay} = new GenbaCl(genba)

  const {data: allTasks} = usefetchUniversalAPI_SWR(`genbaTaskMaster`, `findMany`, {
    orderBy: [{sortOrder: `asc`}],
  })

  if (!allTasks) return <PlaceHolder />

  const TabComponentArray = props.formData?.id
    ? [
        //
        {
          label: `タスク＆スケジュール`,
          component: genba ? <TaskAndSchedule {...{genba, allTasks}} /> : '',
        },
        {
          label: `現場基本情報`,
          component: <MyForm {...props} />,
        },
      ]
    : [
        {
          label: `現場基本情報`,
          component: <MyForm {...props} />,
        },
      ]

  return (
    <C_Stack>
      <section>
        <h1 className={` text-primary-main  text-2xl`}>
          {genba.name}
          {`(${floorThisPlay})`}
        </h1>
      </section>
      <section>
        <BasicTabs
          {...{
            showAll: false,
            id: `genbaForm`,
            TabComponentArray,
          }}
        ></BasicTabs>
      </section>
    </C_Stack>
  )
}

const TaskAndSchedule = ({genba, allTasks}) => {
  const {include} = QueryBuilder.getInclude({}).genbaDay
  const useGlobalProps = useGlobal()
  const {addQuery, query, toggleLoad} = useGlobalProps
  const showPast = query.showPast

  const {router} = useGlobalProps

  const additionalWhere: Prisma.GenbaDayWhereInput = showPast
    ? {}
    : {
        NOT: {date: {lt: getMidnight()}},
        // NOT: {GenbaDayTaskMidTable: {every: {GenbaTask: {to: {lt: getMidnight()}}}}},
        // OR: [
        //   {
        //     // GenbaDayTaskMidTable: {some: {id: {gte: 0}}},
        //     NOT: {GenbaDayTaskMidTable: {every: {GenbaTask: {to: {lt: getMidnight()}}}}},
        //   },
        // ],
      }

  return (
    <>
      <div></div>
      <R_Stack className={`items-stretch`}>
        <div className={`w-[850px]`}>
          <Accordion {...{label: `タスク一覧設定`, defaultOpen: true, closable: false}}>
            <FitMargin>
              <C_Stack>
                <Alert color={`red`}>
                  <div>
                    <strong>タスク登録とスケジュール作成の手順</strong>
                    <div>①タスクの一覧を登録 </div>
                    <div>②登録後、「反映」ボタンを押すと、スケジュールが作られます。</div>
                  </div>
                </Alert>

                <R_Stack className={` flex-nowrap items-start`}>
                  <ChildCreator
                    {...{
                      ...{ParentData: genba, useGlobalProps},

                      columns: ColBuilder.genbaTask({useGlobalProps, ColBuilderExtraProps: {genbaId: genba.id}}),
                      models: {parent: `genba`, children: `genbaTask`},
                      myForm: {
                        onFormItemBlur: props => {
                          const {from, to} = props.newlatestFormData
                          if (from && !to) {
                            props.ReactHookForm.setValue(`to`, from)
                          }
                        },
                      },
                      myTable: {
                        drag: {},
                        customActions: clientProps => <TaskAsignBtn {...{Genba: genba, allTasks, router}} />,
                        delete: {requiredUserConfirmation: false},
                      },

                      additional: {
                        orderBy: [{from: `asc`}],
                      },
                    }}
                  />
                  <Button
                    onClick={async () => {
                      const {result: genbaTasks} = await fetchUniversalAPI(`genbaTask`, `findMany`, {
                        where: {Genba: {id: genba.id}},
                      })
                      await Promise.all(
                        genbaTasks.map(async item => {
                          toggleLoad(async () => await handleUpdateSchedule({genbaTask: item}), {refresh: true, mutate: true})
                        })
                      )
                    }}
                  >
                    一括反映
                  </Button>
                </R_Stack>
              </C_Stack>
            </FitMargin>
          </Accordion>
        </div>
        <div className={`w-[600px]`}>
          <Accordion {...{label: `現場詳細スケジュール`, defaultOpen: true, closable: false}}>
            <FitMargin>
              <C_Stack>
                <HiddenToggler {...{showPast, addQuery, toggleLoad, genba}} />
                <ChildCreator
                  {...{
                    ...{ParentData: genba, useGlobalProps},
                    columns: ColBuilder.genbaDay({
                      useGlobalProps,
                      ColBuilderExtraProps: {genbaId: genba.id},
                    }),
                    models: {parent: `genba`, children: `genbaDay`},
                    myTable: {
                      update: false,
                      customActions: clientProps => <UnUsedScheduleDeleteBtn {...{genba, router}} />,

                      delete: {requiredUserConfirmation: false},
                      // style: {maxHeight: 1000},
                    },
                    additional: {
                      where: {...additionalWhere, OR: [{status: {not: `不要`}}, {status: null}]},
                      include: {...include},
                      orderBy: [{date: `asc`}],
                    },
                  }}
                />
              </C_Stack>
            </FitMargin>
          </Accordion>
        </div>
      </R_Stack>
    </>
  )
}

const HiddenToggler = ({showPast, addQuery, toggleLoad, genba}) => {
  const toggleHidden = () => {
    return addQuery({showPast: showPast ? undefined : true})
  }
  return (
    <R_Stack>
      <Button {...{onClick: toggleHidden}}>{showPast ? `過去を非表示にする` : `過去を表示する`}</Button>
      <Button
        {...{
          color: 'blue',
          onClick: async item => {
            toggleLoad(async () => {
              const res = await fetchUniversalAPI(`genbaDay`, `updateMany`, {
                where: {genbaId: genba.id},
                data: {finished: false, active: true},
              })
            })
          },
        }}
      >
        ステータスリセット
      </Button>
    </R_Stack>
  )
}
