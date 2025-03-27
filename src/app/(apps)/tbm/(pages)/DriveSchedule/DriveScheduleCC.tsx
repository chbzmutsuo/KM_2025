'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import HaishaTable from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable'
import RouteDisplay from '@app/(apps)/tbm/(pages)/DriveSchedule/RouteDisplay'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {TextBlue, TextRed} from '@components/styles/common-components/Alert'
import {FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function DriveScheduleCC({days, tbmBase, whereQuery}) {
  const useGlobalProps = useGlobal()

  const {width} = useGlobalProps
  const maxWidth = width * 0.9
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
    <FitMargin className={`pt-4`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <BasicTabs
        {...{
          style: {width: maxWidth},
          id: 'driveSchedule',
          showAll: false,
          TabComponentArray: [
            {
              label: <TextRed>配車管理【月別】</TextRed>,
              component: <HaishaTable {...{tbmBase, days, whereQuery}} />,
            },
            {label: <TextRed>便設定【月別】</TextRed>, component: <RouteDisplay {...{tbmBase, whereQuery}} />},
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

            {
              label: <TextBlue> ドライバー</TextBlue>,
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
              label: <TextBlue> 車両マスタ</TextBlue>,
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
            {
              label: <TextBlue> 商品マスタ</TextBlue>,
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
