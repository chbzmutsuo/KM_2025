'use client'

import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import ChildCreator from '@cm/components/DataLogic/RTs/ChildCreator/ChildCreator'
import {ColBuilder} from '@app/(apps)/Advantage/(utils)/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/Advantage/(utils)/class/QueryBuilder'

import Accordion from '@cm/components/utils/Accordions/Accordion'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {DetailPagePropType} from '@cm/types/types'

const AdminLessonDetail = (props: DetailPagePropType) => {
  const useGlobalProps = useGlobal()

  const {formData, dataModelName} = props
  const lesson = formData ?? {}

  const itemWidth = 550
  const commonProps = {
    defaultOpen: true,
    styling: {
      styles: {
        label: {fontSize: `1.5rem`, width: '90vw', maxWidth: itemWidth},
      },
    },
  }
  return (
    <>
      <R_Stack className={`mx-auto  items-start justify-around gap-x-[20px] gap-y-[160px]`}>
        <Accordion {...{label: `管理者設定情報`, ...commonProps}}>
          <div className={`mx-auto w-fit`}>
            <MyForm {...{...props}} />
          </div>
        </Accordion>
        <Accordion {...{label: `レッスン動画・画像`, ...commonProps}}>
          <LessonImages {...{lesson, useGlobalProps}} />
        </Accordion>
      </R_Stack>
      <R_Stack>
        <Accordion {...{label: `受講状況`, ...commonProps}}>
          <Attendance {...{lesson, useGlobalProps, dataModelName}} />
        </Accordion>
      </R_Stack>
      <div></div>
    </>
  )
}

export default AdminLessonDetail

const LessonImages = ({lesson, useGlobalProps}) => (
  <ChildCreator
    {...{
      // myTable: {style: {width: 450}},
      useGlobalProps,
      ParentData: lesson ?? {},
      models: {parent: 'lesson', children: 'lessonImage'},
      columns: ColBuilder.lessonImage({useGlobalProps}),
      additional: {
        orderBy: [{type: 'asc'}],
        where: {lessonId: lesson?.id},
        payload: {lessonId: lesson?.id},
      },

      nonRelativeColumns: [],
    }}
  />
)

const Attendance = ({lesson, useGlobalProps, dataModelName}) => {
  const {session, query} = useGlobalProps
  return (
    <C_Stack>
      <div className={`my-2 border-b-2 py-2 `}>
        <p>
          このレッスンに申し込んだ受講者の一覧です。 <br />
          「入金」「合格」等のステータスを変更することができます。
        </p>
      </div>
      <ChildCreator
        {...{
          ParentData: lesson,
          models: {
            parent: dataModelName,
            children: 'lessonLog',
          },
          columns: ColBuilder.lessonLog({
            useGlobalProps,
          }),

          additional: {
            payload: {
              lessonId: lesson.id,
            },
            include: QueryBuilder.getInclude({
              session,
              query,
            })?.lessonLog?.include,
          },
          myForm: undefined,

          nonRelativeColumns: [],
          useGlobalProps,
        }}
      />
    </C_Stack>
  )
}
