'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import TbmUserDetail from '@app/(apps)/tbm/(builders)/PageBuilders/detailPage/TbmUserDetail'
import TbmVehicleDetail from '@app/(apps)/tbm/(builders)/PageBuilders/detailPage/TbmVehicleDetail'
import {autoCreateMonthConfig} from '@app/(apps)/tbm/(pages)/eigyoshoSettei/components/autoCreateMonthConfig'
import RouteDisplay from '@app/(apps)/tbm/(pages)/eigyoshoSettei/components/RouteDisplay'

import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {TextBlue, TextRed} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import PlaceHolder from '@components/utils/loader/PlaceHolder'

import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'
import useWindowSize from '@hooks/useWindowSize'

export default function EigyoshoSetteiClient({days, currentMonth, tbmBase, whereQuery}) {
  const useGlobalProps = useGlobal()

  const {pathname, query, toggleLoad} = useGlobalProps
  const {width, PC} = useWindowSize()
  // const minWidth = 1000
  // const maxWidth = width * 0.95
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

  if (!width) return <PlaceHolder></PlaceHolder>

  return (
    <div className={`pt-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <BasicTabs
        {...{
          id: 'driveSchedule',
          showAll: false,
          TabComponentArray: [
            // {
            //   label: <TextRed>配車管理【月別】</TextRed>,
            //   component: <HaishaTable {...{tbmBase, days, whereQuery}} />,
            // },
            {
              label: <TextRed>便設定【月別】</TextRed>,
              component: (
                <C_Stack>
                  <Button
                    {...{
                      onClick: async () => {
                        await autoCreateMonthConfig({toggleLoad, currentMonth, tbmBaseId: tbmBase?.id})
                      },
                    }}
                  >
                    前月データ引き継ぎ
                  </Button>
                  <RouteDisplay {...{tbmBase, whereQuery}} />
                </C_Stack>
              ),
            },

            {
              label: <TextRed>ガソリン・軽油</TextRed>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,

                    models: {parent: `tbmBase`, children: `tbmBase_MonthConfig`},
                    columns: ColBuilder.tbmBase_MonthConfig(ColBuiderProps),
                  }}
                />
              ),
            },

            {
              label: <TextBlue> 車両マスタ</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ParentData: tbmBase,
                    useGlobalProps,
                    additional: {
                      include: {TbmBase: {}, TbmVehicleMaintenanceRecord: {}},
                      orderBy: [{vehicleNumber: `asc`}],
                    },
                    EditForm: TbmVehicleDetail,
                    models: {parent: `tbmBase`, children: `tbmVehicle`},
                    columns: ColBuilder.tbmVehicle(ColBuiderProps),
                  }}
                />
              ),
            },

            {
              label: <TextBlue> ドライバー/ユーザー</TextBlue>,
              component: (
                <ChildCreator
                  {...{
                    ...childCreatorProps,
                    models: {parent: `tbmBase`, children: `user`},
                    columns: ColBuilder.user(ColBuiderProps),
                    EditForm: TbmUserDetail,
                  }}
                />
              ),
            },
            {
              label: <TextBlue> 荷主マスタ</TextBlue>,
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
            // {
            //   label: <TextBlue> 商品マスタ</TextBlue>,
            //   component: (
            //     <ChildCreator
            //       {...{
            //         ...childCreatorProps,
            //         models: {parent: `tbmBase`, children: `tbmProduct`},
            //         columns: ColBuilder.tbmProduct(ColBuiderProps),
            //       }}
            //     />
            //   ),
            // },
          ],
        }}
      />
    </div>
  )
}
