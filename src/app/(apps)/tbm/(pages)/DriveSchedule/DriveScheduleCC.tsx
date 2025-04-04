'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import TbmUserDetail from '@app/(apps)/tbm/(builders)/PageBuilders/detailPage/TbmUserDetail'
import TbmVehicleDetail from '@app/(apps)/tbm/(builders)/PageBuilders/detailPage/TbmVehicleDetail'
import {autoCreateMonthConfig} from '@app/(apps)/tbm/(pages)/DriveSchedule/ autoCreateMonthConfig'
import CalendarSetter from '@app/(apps)/tbm/(pages)/DriveSchedule/CalendarSetter'
import HaishaTable from '@app/(apps)/tbm/(pages)/DriveSchedule/HaishaTable/HaishaTable'
import RouteDisplay from '@app/(apps)/tbm/(pages)/DriveSchedule/RouteDisplay'
import {Days, getMidnight, toUtc} from '@class/Days'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {TextBlue, TextRed} from '@components/styles/common-components/Alert'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, FitMargin} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import Redirector from '@components/utils/Redirector'
import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {createUpdate, toastByResult} from '@lib/methods/api-fetcher'
import {HREF} from '@lib/methods/urls'
import {doTransaction} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {endOfMonth} from 'date-fns'

export default function DriveScheduleCC({days, tbmBase, whereQuery}) {
  const useGlobalProps = useGlobal()

  const {pathname, width, query, toggleLoad, PC} = useGlobalProps
  const minWidth = width * 0.95
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
  if (!query.from && !query.month) {
    return <PlaceHolder />
  }

  if (!PC) {
    return <div>このページは、PC専用です。</div>
  }
  const theMonth = toUtc(query.from || query.month)

  const dateWhere = {
    gte: theMonth,
    lte: getMidnight(endOfMonth(theMonth)),
  }

  const {data: calendar = [], isLoading} = usefetchUniversalAPI_SWR(`tbmCalendar`, `findMany`, {
    where: {tbmBaseId: tbmBase?.id, date: dateWhere},
    orderBy: {date: 'asc'},
  })
  const defaultSelectedDays = calendar.filter(c => c.holidayType === '稼働').map(c => c.date)

  if (!query.mode) {
    return <Redirector {...{redirectPath: HREF(pathname, {mode: 'DRIVER'}, query)}} />
  }

  if (!width || isLoading) return <PlaceHolder></PlaceHolder>
  return (
    <div className={`pt-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <BasicTabs
        {...{
          style: {
            minWidth: minWidth,
            margin: 'auto',
          },
          id: 'driveSchedule',
          showAll: false,
          TabComponentArray: [
            {
              label: <TextRed>配車管理【月別】</TextRed>,
              component: <HaishaTable {...{tbmBase, days, whereQuery}} />,
            },
            {
              label: <TextRed>便設定【月別】</TextRed>,
              component: (
                <C_Stack>
                  <Button
                    {...{
                      onClick: async () => {
                        await autoCreateMonthConfig({toggleLoad, MONTH: theMonth, tbmBaseId: tbmBase?.id})
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
              label: <TextRed>営業所設定【月別】</TextRed>,
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
              label: <TextBlue> ドライバー</TextBlue>,
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
            {
              label: <TextBlue>営業所カレンダ</TextBlue>,
              component: (
                <CalendarSetter
                  {...{
                    days,
                    calendar,
                    defaultSelectedDays,
                    onConfirm: async ({selectedDays}) => {
                      if (!confirm('変更を反映しますか？')) return

                      const res = await doTransaction({
                        transactionQueryList: days.map(day => {
                          const isSelected = selectedDays.some(d => Days.isSameDate(d, day))
                          const unique_tbmBaseId_date = {tbmBaseId: tbmBase?.id, date: day}

                          return {
                            model: 'tbmCalendar',
                            method: 'upsert',
                            queryObject: {
                              where: {unique_tbmBaseId_date},
                              ...createUpdate({...unique_tbmBaseId_date, holidayType: isSelected ? '稼働' : ''}),
                            },
                          }
                        }),
                      })
                      toastByResult(res)
                    },
                  }}
                />
              ),
            },
          ],
        }}
      />
    </div>
  )
}
