'use client'

import {ColBuilder} from '@app/(apps)/yoshinari/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/yoshinari/class/QueryBuilder'
import {userForSelect} from '@app/(apps)/yoshinari/constants/forSelectConfig'
import {roleMaster} from '@class/builders/PageBuilderVariables'
import {Fields} from '@class/Fields/Fields'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import GlobalIdSelector from '@components/GlobalIdSelector/GlobalIdSelector'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {T_LINK} from '@components/styles/common-components/links'

import Accordion from '@components/utils/Accordions/Accordion'
import {useGlobalPropType} from '@hooks/globalHooks/useGlobal'
import {getApCustomField} from '@lib/ApprovementRequest/lib'
import {HREF} from '@lib/methods/urls'

export class PageBuilder {
  static roleMaster = roleMaster
  static user = {
    form: (props: DetailPagePropType) => {
      const {useGlobalProps} = props
      const {fullLoad} = useGlobalProps
      const {admin} = useGlobalProps.accessScopes()

      return (
        <div>
          <R_Stack className={` items-start`}>
            <Accordion {...{label: `基本設定`, defaultOpen: true, closable: false}}>
              <R_Stack className={`  items-stretch`}>
                <section>
                  <Accordion {...{label: `ユーザー情報`, defaultOpen: true, closable: false}}>
                    <MyForm {...{...props}} />
                  </Accordion>
                </section>
                <section>
                  <Accordion {...{label: `勤務パターン履歴`, defaultOpen: true, closable: false}}>
                    <ChildCreator
                      {...{
                        ParentData: props.formData ?? {},
                        myTable: {},
                        models: {parent: props.dataModelName, children: `userWorkTimeHistoryMidTable`},
                        columns: ColBuilder.userWorkTimeHistoryMidTable({
                          useGlobalProps,
                          ColBuilderExtraProps: {
                            userId: props.formData?.id,
                          },
                        }),

                        useGlobalProps: props.useGlobalProps,
                        additional: {
                          toggleLoadFunc: fullLoad,
                          orderBy: [{from: `asc`}],
                          include: QueryBuilder.getInclude({}).userWorkTimeHistoryMidTable.include,
                        },
                      }}
                    />
                  </Accordion>
                  <Accordion {...{label: `有給パターン履歴`, defaultOpen: true, closable: false}}>
                    <ChildCreator
                      {...{
                        ParentData: props.formData ?? {},
                        myTable: {},
                        models: {parent: props.dataModelName, children: `userPayedLeaveTypeMidTable`},
                        columns: ColBuilder.userPayedLeaveTypeMidTable({
                          useGlobalProps,
                          ColBuilderExtraProps: {
                            userId: props.formData?.id,
                          },
                        }),

                        useGlobalProps: props.useGlobalProps,
                        additional: {
                          toggleLoadFunc: fullLoad,
                          orderBy: [{from: `asc`}],
                          include: QueryBuilder.getInclude({}).userPayedLeaveTypeMidTable.include,
                        },
                      }}
                    />
                  </Accordion>
                </section>
              </R_Stack>
            </Accordion>
            <Accordion {...{label: `有給関連`, defaultOpen: true, closable: false}}>
              <section>
                <R_Stack className={`  items-stretch`}>
                  <Accordion {...{label: `付与履歴(システムによる自動制御)`, defaultOpen: true, closable: false}}>
                    <ChildCreator
                      {...{
                        ParentData: props.formData ?? {},
                        myTable: {create: true, delete: true, update: true},
                        models: {parent: props.dataModelName, children: `paidLeaveGrant`},
                        columns: ColBuilder.payedLeaveGrant({useGlobalProps, ColBuilderExtraProps: {User: props.formData}}),
                        useGlobalProps: props.useGlobalProps,
                      }}
                    />
                  </Accordion>
                </R_Stack>
              </section>
            </Accordion>
          </R_Stack>
        </div>
      )
    },
  }
  static payedLeaveType = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className={`items-start`}>
          <div>
            <Accordion {...{label: `基本情報`, defaultOpen: true, closable: false}}>
              <MyForm {...{...props}} />
            </Accordion>
          </div>

          {props.formData?.id && (
            <Accordion {...{label: `経過年数別付与数`, defaultOpen: true, closable: true}}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},

                  models: {parent: props.dataModelName, children: `payedLeaveAssignmentCount`},
                  columns: ColBuilder.payedLeaveAssignmentCount(props),
                  useGlobalProps: props.useGlobalProps,
                  additional: {
                    orderBy: [{monthsAfter: `asc`}],
                  },
                }}
              />
            </Accordion>
          )}
        </R_Stack>
      )
    },
  }
  static workType = {
    top: (props: DetailPagePropType) => {
      return (
        <div>
          <small className={`text-error-main`}>
            労働条件が変更になる場合、過去の記録は変更せず、新規の勤務タイプを設定してください。
            <br />
            過去のものを変更すると、各種勤怠データが変わる可能性があります。
          </small>
        </div>
      )
    },
    form: (props: DetailPagePropType) => {
      const {query} = props.useGlobalProps
      return (
        <C_Stack>
          <T_LINK href={HREF(`/yoshinari/workTypeCalendar/${props.formData?.id ?? 0}`, {}, query)}>カレンダー設定</T_LINK>
          <R_Stack className={`items-start`}>
            <div>
              <Accordion {...{label: `基本情報`, defaultOpen: true, closable: false}}>
                <MyForm {...{...props}} />
              </Accordion>
            </div>

            {/* {props.formData?.id && (
              <Accordion {...{label: `カレンダー`, defaultOpen: true, closable: true}}>
                <div></div>
                <div className={`bg-white p-1`}>
                  <CalendarCC {...{workType: props.formData}} />
                </div>
              </Accordion>
            )} */}
          </R_Stack>
        </C_Stack>
      )
    },
  }
  static apRequestTypeMaster = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className={` items-stretch`}>
          <div>
            <Accordion {...{label: `基本情報`, defaultOpen: true, closable: true}}>
              <MyForm {...{...props}} />
            </Accordion>
          </div>

          <div>
            <Accordion {...{label: `カスタムフィールド`, defaultOpen: true, closable: true}}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},
                  myTable: {drag: {}},
                  models: {parent: props.dataModelName, children: `apCustomField`},
                  columns: getApCustomField(props),
                  useGlobalProps: props.useGlobalProps,
                }}
              />
            </Accordion>
          </div>
        </R_Stack>
      )
    },
  }
  static getGlobalIdSelector = (props: {useGlobalProps: useGlobalPropType}) => {
    const {useGlobalProps} = props
    return () => {
      const columns = Fields.transposeColumns([
        {
          ...{id: 'g_userId', label: 'ユーザー名'},
          form: {},
          forSelect: {
            config: {
              modelName: `user`,
              where: userForSelect.where,
              select: {id: `number`, name: 'text'},
            },
          },
        },
      ])
      const scopes = useGlobalProps.accessScopes()

      return (
        <R_Stack>
          {scopes.admin ? <GlobalIdSelector {...{useGlobalProps, columns}} /> : <span>{useGlobalProps.session.name}</span>}
        </R_Stack>
      )
    }
  }
}
