import {getTbmBase_MonthConfig} from '@app/(apps)/tbm/(server-actions)/getBasics'
import {getUserListWithCarHistory} from '@app/(apps)/tbm/(server-actions)/getUserListWithCarHistory'
import {getMidnight} from '@class/Days'
import {DH} from '@class/DH'
import {FitMargin, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import EmptyPlaceholder from '@components/utils/loader/EmptyPlaceHolder'
import Redirector from '@components/utils/Redirector'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'

import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const {session, scopes} = await initServerComopnent({query})
  const {tbmBaseId} = scopes.getTbmScopes()
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />

  const yearMonth = whereQuery.gte ?? getMidnight()

  const {TbmBase_MonthConfig} = await getTbmBase_MonthConfig({yearMonth, tbmBaseId})

  const userListWithCarHistory = await getUserListWithCarHistory({
    tbmBaseId,
    whereQuery,
    TbmBase_MonthConfig,
  })

  return (
    <FitMargin className={`pt-4`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      <R_Stack className={`w-full items-start gap-8`}>
        {userListWithCarHistory.map(data => {
          const {user, allCars} = data
          const {id: userId} = user

          return (
            <div key={userId} className={`t-paper w-[500px] p-2`}>
              <R_Stack className={` w-full justify-between`}>
                <span>{user.code}</span>
                <h2 className={` text-2xl`}>{user.name}</h2>
              </R_Stack>
              {allCars.length > 0 ? (
                CsvTable({
                  records: allCars.map(data => {
                    const {car, soukouKyori, heikinNenpi, nenryoiShiyoryo, fuelCost} = data

                    return {
                      csvTableRow: [
                        {
                          label: `車番`,
                          cellValue: car.vehicleNumber,
                        },
                        {
                          label: `走行距離計`,
                          cellValue: DH.WithUnit(soukouKyori, 'km', 1),
                          style: {textAlign: `right`},
                        },
                        {
                          label: `平均燃費`,
                          cellValue: DH.WithUnit(heikinNenpi, 'km/L', 1),
                          style: {textAlign: `right`},
                        },
                        {
                          label: `燃費使用量`,
                          cellValue: DH.WithUnit(nenryoiShiyoryo, 't', 1),
                          style: {textAlign: `right`},
                        },
                        {
                          label: `使用金額`,
                          cellValue: DH.WithUnit(fuelCost, '円', 0),
                        },
                      ],
                    }
                  }),
                }).WithWrapper({className: 't-paper'})
              ) : (
                <EmptyPlaceholder>データがありません</EmptyPlaceholder>
              )}
            </div>
          )
        })}
      </R_Stack>
    </FitMargin>
  )
}
