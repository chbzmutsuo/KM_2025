'use client'

import {ColBuilder} from '@app/(apps)/masterKey/class/ColBuilder'
import {ClientDefaultPage} from '@app/(apps)/masterKey/class/pageBuilders/ClientDefaultPage'
import useTargetMasterKeyClientIds from '@app/(apps)/masterKey/lib/useTargetMasterKeyClientIds'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import GlobalAccordion from '@components/utils/Accordions/GlobalAccordion'
import BasicModal from '@components/utils/modal/BasicModal'
import {TableCellsIcon, UsersIcon} from '@heroicons/react/20/solid'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {absSize} from '@lib/methods/common'

export class PageBuilder {
  static masterKeyClientGroup = {
    form: (props: DetailPagePropType) => {
      const {selectedClientIds} = useTargetMasterKeyClientIds()
      const {data: clients = []} = usefetchUniversalAPI_SWR(`masterKeyClient`, `findMany`, {
        where: {
          OR: selectedClientIds.map(id => {
            return {id}
          }),
        },
      })

      const Modals = () => {
        return (
          <R_Stack className={`  my-2 gap-10`}>
            <BasicModal
              alertOnClose={false}
              btnComponent={
                <Button>
                  <R_Stack>
                    <TableCellsIcon className={`w-7`}></TableCellsIcon>
                    <strong>ダッシュボード</strong>
                  </R_Stack>
                </Button>
              }
              {...{
                style: {...absSize({width: `90vw`, height: `90vh`})},
              }}
            >
              <div>歩留ページを表示します</div>
              {/* <DashBoardPage /> */}
            </BasicModal>
            <BasicModal
              alertOnClose={false}
              btnComponent={
                <Button>
                  <R_Stack>
                    <TableCellsIcon className={`w-7`}></TableCellsIcon>
                    <strong>歩留</strong>
                  </R_Stack>
                </Button>
              }
              {...{
                style: {...absSize({width: `90vw`, height: `90vh`})},
              }}
            >
              <div>歩留ページを表示します</div>
            </BasicModal>

            <BasicModal
              btnComponent={
                <Button>
                  <R_Stack>
                    <UsersIcon className={`w-7`}></UsersIcon>
                    <strong>ユーザー一覧</strong>
                  </R_Stack>
                </Button>
              }
            >
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},

                  models: {parent: props.dataModelName, children: `user`},
                  columns: ColBuilder.user(props),
                  useGlobalProps: props.useGlobalProps,
                }}
              />
            </BasicModal>
          </R_Stack>
        )
      }

      return (
        <div>
          <Modals />
          <C_Stack>
            {clients.map(client => {
              const label = `${client.name} (${client.email})`

              const DetailPageProp = {...props, additional: {}, formData: client}
              DetailPageProp.dataModelName = 'masterKeyClient'

              DetailPageProp.columns = ColBuilder.masterKeyClient(DetailPageProp)
              return (
                <div key={client.id} className={`mb-[50px] w-[95vw]  rounded-lg bg-gray-200  p-1 `}>
                  <GlobalAccordion
                    {...{
                      id: `${client.id}-client-accordion`,
                      label,
                      styling: {classes: {wrapper: `bg-transparent`}},
                      defaultOpen: true,
                      closable: true,
                    }}
                  >
                    <ClientDefaultPage {...{...DetailPageProp}} />
                  </GlobalAccordion>
                </div>
              )
            })}
          </C_Stack>
        </div>
      )
    },
  }
}
