import {getMonthlyTbmDriveData, meisaiKey} from '@app/(apps)/tbm/(server-actions)/getMonthlyTbmDriveData'
import {getUserListWithCarHistory} from '@app/(apps)/tbm/(server-actions)/getUserListWithCarHistory'
import {getMidnight} from '@class/Days'
import {FitMargin} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
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
  const {monthlyTbmDriveData, ConfigForMonth, userList} = await getMonthlyTbmDriveData({whereQuery, tbmBaseId})
  const userListWithCarHistory = await getUserListWithCarHistory({
    tbmBaseId,
    whereQuery,
  })

  return (
    <FitMargin className={`p-2`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      {CsvTable({
        records: userList.map(item => {
          const userSchedule = monthlyTbmDriveData.rows.filter(row => {
            const {schedule} = row
            const {User} = schedule
            return User.id === item.id
          })

          const sumFormMeisai = (dataKey: meisaiKey) => {
            return userSchedule.reduce((acc, cur) => {
              const value = cur.keyValue?.[dataKey]?.value
              return acc + (Number(value) ?? 0)
            }, 0)
          }
          const userWithCarHistory = userListWithCarHistory.filter(user => user.user.id === item.id)

          const sumFormRuisekiKyori = (dataKey: 'nempiShiyoryo' | 'fuelCost' | 'totalSokoKyori') => {
            return userWithCarHistory.reduce((acc, cur) => {
              const value = cur.allCars.reduce((acc, cur) => {
                return acc + (cur[dataKey] ?? 0)
              }, 0)

              return acc + (Number(value) ?? 0)
            }, 0)
          }

          const user = item

          const saleAmount = sumFormMeisai(`N_postalFee`) + sumFormMeisai(`P_generalFee`) + sumFormMeisai(`S_driverFee`)
          return {
            csvTableRow: [
              {label: 'コード', cellValue: user.code},
              {label: 'ドライバ', cellValue: user.name},
              {label: '件数', cellValue: userSchedule.length},
              {label: `通行料(郵便)`, cellValue: sumFormMeisai(`N_postalFee`)},
              {label: `高速代（郵便）`, cellValue: '手動'},
              {label: `通行料(一般)`, cellValue: sumFormMeisai(`P_generalFee`)},
              {label: `高速代(一般）`, cellValue: '手動'},
              {label: `合計（高速代）`, cellValue: sumFormMeisai(`O_postalHighwayFee`) + sumFormMeisai(`Q_generalHighwayFee`)},
              {label: `合計（通行料）`, cellValue: sumFormMeisai(`N_postalFee`) + sumFormMeisai(`P_generalFee`)},
              {label: `高速代30％`, cellValue: sumFormMeisai(`V_thirteenPercentOfPostalHighway`)},
              {label: `高速代-通行料`, cellValue: sumFormMeisai(`U_jomuinFutan`)},
              {label: `高速代-通行料`, cellValue: sumFormMeisai(`W_general`)},
              {label: `高速超過額`, cellValue: sumFormMeisai(`X_highwayExcess`)},
              {label: `給与算定運賃高`, cellValue: sumFormMeisai(`T_JomuinUnchin`)},
              {label: `当月運賃高（円）`, cellValue: sumFormMeisai(`S_driverFee`)},
              {label: `当月売上高（円）`, cellValue: saleAmount},
              {label: `当月燃料使用量（L)`, cellValue: sumFormRuisekiKyori(`nempiShiyoryo`)},
              {label: `当月燃料代`, cellValue: sumFormRuisekiKyori(`fuelCost`)},
              {label: `洗車機代`, cellValue: `洗車機代`},
              {label: `当月走行距離(㎞)`, cellValue: sumFormRuisekiKyori(`totalSokoKyori`)},
            ],
          }
        }),
      }).WithWrapper({})}
      {/* <NempiKanriCC {...{vehicleList, fuelByCarWithVehicle, lastRefuelHistoryByCar}} /> */}
    </FitMargin>
  )
}
