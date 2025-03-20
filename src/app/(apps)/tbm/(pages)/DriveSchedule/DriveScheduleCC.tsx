'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {TbmRouteGroupUpsertController} from '@app/(apps)/tbm/(builders)/PageBuilders/TbmRouteGroupUpsertController'
import HaishaTable from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable'
import RouteDisplay from '@app/(apps)/tbm/(pages)/DriveSchedule/RouteDisplay'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {TextBlue, TextRed} from '@components/styles/common-components/Alert'
import {FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function DriveScheduleCC({days, tbmBase, userList, TbmDriveSchedule, whereQuery}) {
  const useGlobalProps = useGlobal()
  const ColBuiderProps = {
    useGlobalProps,
    ColBuilderExtraProps: {tbmBaseId: tbmBase?.id},
  }
  const childCreatorProps = {
    ParentData: tbmBase,
    useGlobalProps,
    additional: {
      include: {TbmBase: {}},
      orderBy: [{code: 'asc'}],
    },
  }

  const {width} = useGlobalProps
  const maxWidth = width * 0.9

  if (!width) return <></>
  return (
    <FitMargin>
      <NewDateSwitcher {...{monthOnly: true}} />
      <BasicTabs
        {...{
          style: {width: maxWidth},
          id: 'driveSchedule',
          showAll: false,
          TabComponentArray: [
            {
              label: <TextRed>配車管理【月別】</TextRed>,
              component: <HaishaTable {...{tbmBase, userList, TbmDriveSchedule, days}} />,
            },
            {
              label: <TextRed>営業所設定【月別】</TextRed>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `tbmBase_MonthConfig`},
                    columns: ColBuilder.tbmBase_MonthConfig(ColBuiderProps),
                    additional: {
                      include: {TbmBase: {}},
                    },
                  }}
                />
              ),
            },
            {label: <TextRed>便設定【月別】</TextRed>, component: <RouteDisplay {...{tbmBase, whereQuery}} />},
            {
              label: <TextBlue> 便マスタ【共通】</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    models: {parent: `tbmBase`, children: 'tbmRouteGroup'},
                    columns: ColBuilder.tbmRouteGroup(ColBuiderProps),
                    myForm: {create: TbmRouteGroupUpsertController},
                    ...childCreatorProps,
                    additional: {
                      ...childCreatorProps.additional,
                      include: {
                        TbmBase: {},
                        Mid_TbmRouteGroup_TbmCustomer: {
                          include: {TbmCustomer: {}},
                        },
                        Mid_TbmRouteGroup_TbmProduct: {
                          include: {TbmProduct: {}},
                        },
                      },
                    },
                  }}
                />
              ),
            },

            {
              label: <TextBlue> ドライバー【共通】</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `user`},
                    columns: ColBuilder.user(ColBuiderProps),
                  }}
                />
              ),
            },
            {
              label: <TextBlue> 車両マスタ【共通】</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `tbmVehicle`},
                    columns: ColBuilder.tbmVehicle(ColBuiderProps),
                  }}
                />
              ),
            },
            {
              label: <TextBlue> 荷主マスタ【共通】</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `tbmCustomer`},
                    columns: ColBuilder.tbmCustomer(ColBuiderProps),
                  }}
                />
              ),
            },
            {
              label: <TextBlue> 商品マスタ【共通】</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `tbmProduct`},
                    columns: ColBuilder.tbmProduct(ColBuiderProps),
                  }}
                />
              ),
            },
          ],
        }}
      />
    </FitMargin>
  )
}
