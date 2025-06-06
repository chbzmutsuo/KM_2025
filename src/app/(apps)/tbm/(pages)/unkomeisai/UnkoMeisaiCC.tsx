'use client'

import {MonthlyTbmDriveData} from '@app/(apps)/tbm/(server-actions)/getMonthlyTbmDriveData'
import {formatDate} from '@class/Days/date-utils/formatters'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import PlaceHolder from '@components/utils/loader/PlaceHolder'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {doStandardPrisma} from '@lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export default function UnkoMeisaiCC({monthlyTbmDriveList}: {monthlyTbmDriveList: MonthlyTbmDriveData[]}) {
  const minWidth = 80
  const {toastIfFailed} = useGlobal()
  return (
    <div className={` relative`}>
      {monthlyTbmDriveList.length === 0 && <PlaceHolder>表示するデータがありません</PlaceHolder>}
      {CsvTable({
        records: monthlyTbmDriveList.map((row, rowIdx) => {
          const {keyValue, schedule} = row

          const cols = Object.entries(keyValue).filter(([dataKey, item]) => !item.label.includes(`CD`))

          return {
            csvTableRow: cols.map((props: any, colIdx) => {
              const [dataKey, item] = props

              let value
              if (item.type === `date`) {
                value = formatDate(item.cellValue, 'short')
              } else if ([`O_postalHighwayFee`, `Q_generalHighwayFee`].includes(dataKey)) {
                value = (
                  <input
                    {...{
                      defaultValue: schedule[dataKey],
                      type: 'number',
                      className: `border-b bg-gray-100/70 w-[70px] px-1 text-xs`,
                      onBlur: async (e: any) => {
                        const res = await doStandardPrisma('tbmDriveSchedule', 'update', {
                          where: {id: schedule.id ?? 0},
                          data: {
                            [dataKey]: Number(e.target.value),
                          },
                        })

                        toastIfFailed(res)
                      },
                    }}
                  />
                )
              } else {
                value = item.cellValue
              }

              const baseWidth = 80
              const width = item?.style?.minWidth ?? baseWidth

              const style = {
                fontSize: 13,
                color: typeof value === 'number' && value < 0 ? 'red' : undefined,
                ...item.style,
                minWidth: width,
              }

              return {
                label: <div className="text-xs">{item.label}</div>,
                style,
                cellValue: <div>{value}</div>,
              }
            }),
          }
        }),
      }).WithWrapper({className: `max-w-[calc(95vw-50px)] `})}
    </div>
  )
}
