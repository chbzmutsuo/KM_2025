import {getUserListWithCarHistory} from '@app/(apps)/tbm/(server-actions)/getUserListWithCarHistory'
import {Calc} from '@class/Calc'
import {getMidnight} from '@class/Days'
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
  const theDate = whereQuery?.gte ?? getMidnight()

  const userListWithCarHistory = await getUserListWithCarHistory({
    tbmBaseId,
    whereQuery,
  })

  return (
    <FitMargin className={`p-2`}>
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
                    const {car, soukouKyori, heikinNenpi, nempiShiyoryo, fuelCost} = data

                    return {
                      csvTableRow: [
                        {
                          label: `車番`,
                          cellValue: car.vehicleNumber,
                        },
                        {
                          label: `走行距離計`,
                          cellValue: Calc.round(soukouKyori, 1) + ' km',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `平均燃費`,
                          cellValue: Calc.round(heikinNenpi, 1) + ' km/L',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `燃費使用量`,
                          cellValue: Calc.round(nempiShiyoryo, 1) + ' t',
                          style: {textAlign: `right`},
                        },
                        {
                          label: `使用金額`,
                          cellValue: Calc.round(fuelCost, 0) + ' 円',
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

      {/* <ruisekiCC /> */}
    </FitMargin>
  )
}
