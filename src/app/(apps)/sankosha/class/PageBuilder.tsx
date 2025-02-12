'use client'

import {DetailPagePropType} from '@cm/types/types'
import {Sankosha} from '@app/(apps)/sankosha/class/Sankosha'

import Accordion from '@components/utils/Accordions/Accordion'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import {Fields} from '@class/Fields/Fields'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {getClientCommonColumnFields} from '@app/(apps)/sankosha/lib/getStorageCols'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
import {Button} from '@components/styles/common-components/Button'
import {getColorStyles} from '@cm/lib/methods/common'
import {ColBuilder} from '@app/(apps)/sankosha/class/ColBuilder'
import BasicTabs from '@components/utils/tabs/BasicTabs'

export class PageBuilder {
  static sankoshaClientA = {
    form: (props: DetailPagePropType) => {
      const {useGlobalProps} = props

      const parentData = props.formData

      const ChildCreatorCommonProps = {
        ParentData: props.formData ?? {},
        additional: {
          include: {SankoshaClientA: {}},
        },
        useGlobalProps,
        columns: new Fields([
          getClientCommonColumnFields(),
          {
            id: `sankoshaClientAId`,
            label: `お客様`,
            forSelect: {},
            form: {...defaultRegister, defaultValue: parentData?.id},
          },
        ]).transposeColumns(),
      }

      const relatedMsters = [
        {id: `sankoshaClientB`, label: `物流センター`},
        {id: `sankoshaClientC`, label: `担当支店`},
        {id: `sankoshaClientD`, label: `販売店`},
        {id: `sankoshaClientE`, label: `エンドユーザー`},
      ]

      return (
        <div>
          <C_Stack className={` items-center gap-10`}>
            <Paper>
              <Accordion {...{label: '基本情報', defaultOpen: true, closable: false}}>
                <MyForm {...props} />
              </Accordion>
            </Paper>

            {!!parentData?.id && (
              <>
                <Paper>
                  <R_Stack>
                    {relatedMsters.map(d => {
                      const modelName = d.id as PrismaModelNames

                      return (
                        <div key={d.id}>
                          <Accordion {...{label: d.label, defaultOpen: true, closable: false}}>
                            <R_Stack>
                              <ChildCreator
                                {...{
                                  ...ChildCreatorCommonProps,
                                  models: {parent: `sankoshaClientA`, children: modelName},
                                }}
                              />
                            </R_Stack>
                          </Accordion>
                        </div>
                      )
                    })}
                  </R_Stack>
                </Paper>
              </>
            )}
          </C_Stack>
        </div>
      )
    },
  }
  static sankoshaProcess = {
    top: (props: DetailPagePropType) => {
      const {useGlobalProps} = props
      const {addQuery, query} = useGlobalProps
      const modes = Sankosha.constans().inputModes()
      return (
        <R_Stack>
          {modes.map(mode => {
            const active = query.inputMode === mode.dataKey
            const color = mode.color
            return (
              <div key={mode.dataKey}>
                <Button
                  {...{
                    active,
                    style: {...getColorStyles(color)},
                    onClick: () => addQuery({inputMode: mode.dataKey}),
                  }}
                >
                  {mode.label}
                </Button>
              </div>
            )
          })}
        </R_Stack>
      )
    },

    form: (props: DetailPagePropType) => {
      const TabComponentArray = [{label: '基本情報', component: <MyForm {...props} />}]

      if (props.formData?.id) {
        TabComponentArray.push({
          label: '画像',
          component: (
            <ChildCreator
              {...{
                ParentData: props.formData ?? {},
                models: {
                  parent: props.dataModelName,
                  children: `sankoshaProductImage`,
                },
                columns: ColBuilder.sankoshaProductImage(props),
                useGlobalProps: props.useGlobalProps,
              }}
            />
          ),
        })
      }

      return (
        <div className={`mx-auto w-fit`}>
          <R_Stack className={` items-start justify-center  gap-10`}>
            <BasicTabs
              {...{
                showAll: false,
                id: 'sankoshaProcess',
                TabComponentArray,
              }}
            >
              <Accordion {...{label: '画像', defaultOpen: true, closable: false}}>
                <ChildCreator
                  {...{
                    ParentData: props.formData ?? {},
                    models: {
                      parent: props.dataModelName,
                      children: `sankoshaProductImage`,
                    },
                    columns: ColBuilder.sankoshaProductImage(props),
                    useGlobalProps: props.useGlobalProps,
                  }}
                />
              </Accordion>
            </BasicTabs>
            {/* <Accordion {...{label: '見積もり情報入力', defaultOpen: true, closable: false}}>
              <R_Stack className={`mb-10 justify-around gap-6`}>
                <R_Stack className={`t-link gap-1`}>
                  <NewspaperIcon className={`  w-5 `} />
                  見積書
                </R_Stack>
                <R_Stack className={`t-link gap-1`}>
                  <NewspaperIcon className={`  w-5 `} />
                  納品書
                </R_Stack>
              </R_Stack>
              <R_Stack>
                <ChildCreator
                  {...{
                    ParentData: props.formData ?? {},
                    models: {parent: `sankoshaProcess`, children: `sankoShaEstimatePriceMasterTable`},
                    columns: ColBuilder.sankoshaEstimatePriceMasterTable({
                      useGlobalProps,
                    }),
                    additional: {
                      include: {SankoshaPriceMaster: {}},
                    },
                    useGlobalProps,
                  }}
                />
              </R_Stack>
            </Accordion> */}
          </R_Stack>
        </div>
      )
    },
  }
}
