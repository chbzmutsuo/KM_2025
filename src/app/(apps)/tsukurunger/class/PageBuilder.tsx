'use client'

import {ConstructionLinks} from '@app/(apps)/tsukurunger/(pages)/daily/[tsConstructionId]/template'
import {ColBuilder} from '@app/(apps)/tsukurunger/class/ColBuilder'

import {roleMaster} from '@class/builders/PageBuilderVariables'

import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import Accordion from '@components/utils/Accordions/Accordion'

import {HREF} from '@lib/methods/urls'

import {NippoList} from '@app/(apps)/tsukurunger/(parts)/nippo/NippoList'

import {Fields} from '@class/Fields/Fields'
import GlobalIdSelector from '@components/GlobalIdSelector/GlobalIdSelector'
import {useGlobalPropType} from '@hooks/globalHooks/useGlobal'
import MidTable from '@components/DataLogic/RTs/MidTable/MidTable'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
export class PageBuilder {
  static roleMaster = roleMaster
  static tsConstruction = {
    form: (props: DetailPagePropType) => {
      const constructionId = props.formData?.id

      const {data: userList = []} = usefetchUniversalAPI_SWR(`user`, `findMany`, {
        where: {
          UserRole: {some: {RoleMaster: {name: `下請`}}},
          apps: {has: `tsukurunger`},
        },
      } as Prisma.UserFindManyArgs)

      return (
        <C_Stack>
          <div>
            <ConstructionLinks {...{constructionId}} />
          </div>
          <div>
            <R_Stack className={`max-w-xl items-stretch`}>
              <div>
                <Accordion {...{label: `現場`, defaultOpen: true, closable: false}}>
                  <MyForm {...{...props}} />
                </Accordion>
              </div>

              <div>
                <Accordion {...{label: `日報`, defaultOpen: true, closable: false}}>
                  <div className={`w-[300px]`}>
                    <NippoList {...{tsConstructionId: constructionId}} />
                  </div>
                </Accordion>
              </div>
            </R_Stack>
          </div>
          <div>
            <Accordion {...{label: `下請アカウント`, defaultOpen: false, closable: true}}>
              <MidTable
                {...{
                  ParentData: props.formData ?? {},
                  models: {
                    parent: `tsConstruction`,
                    mid: `tsConstructionSubConUserMidTable`,
                    another: `user`,
                  },
                  uniqueRelationalKey: `unique_userId_tsConstructionId`,
                  candidates: [...userList],
                }}
              />
            </Accordion>
          </div>
          <div>
            <Accordion {...{label: `契約内訳`, defaultOpen: true, closable: false}}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},
                  models: {parent: props.dataModelName, children: `tsWorkContent`},
                  columns: ColBuilder.tsWorkContent(props),
                  useGlobalProps: props.useGlobalProps,

                  myTable: {
                    drag: {},
                    delete: {
                      requiredUserConfirmation: false,
                    },
                  },
                }}
              />
            </Accordion>
          </div>
        </C_Stack>
      )
    },
  }
  static tsMainContractor = {
    form: (props: DetailPagePropType) => {
      const {query} = props.useGlobalProps
      return (
        <R_Stack className={`max-w-xl items-stretch`}>
          <div className={`w-fit`}>
            <Accordion {...{label: `元請け業者`, defaultOpen: true, closable: false}}>
              <MyForm {...{...props}} />
            </Accordion>
          </div>

          <div className={`w-fit`}>
            <Accordion {...{label: `現場`, defaultOpen: true, closable: false}}>
              <ChildCreator
                {...{
                  editType: {
                    type: `page`,
                    pathnameBuilder: props => HREF(`/${props.rootPath}/tsConstruction/${props.record?.id}`, {}, query),
                  },
                  myTable: {style: {width: `fit-content`}},
                  ParentData: props.formData ?? {},
                  models: {parent: props.dataModelName, children: `tsConstruction`},
                  columns: ColBuilder.tsConstruction(props),
                  additional: {include: {TsNippo: {}}},
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
    const {admin} = useGlobalProps.accessScopes()
    if (!admin) return
    return () => {
      const columns = Fields.transposeColumns([
        {
          ...{id: 'g_userId', label: ''},
          form: {},
          forSelect: {
            config: {
              modelName: `user`,
              where: {apps: {has: `tsukurunger`}},
              select: {id: `number`, name: 'text'},
            },
          },
        },
      ])
      return (
        <>
          <GlobalIdSelector {...{useGlobalProps, columns}} />
        </>
      )
    }
  }
}
