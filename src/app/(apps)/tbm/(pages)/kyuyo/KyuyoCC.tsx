'use client'
import {getKyuyoTableList, KyuyoRecord} from '@app/(apps)/tbm/(server-actions)/getKyuyoTableList'
import {Calc} from '@class/Calc'

import {FitMargin} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'

import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {useEffect, useState} from 'react'

const InlineInputKey = [`P_Other1`, `Q_Other2`, `S_Shokuhi`, `T_MaebaraiKin`, `AD_Rate`]
export default function KyuyoCC(props) {
  const {yearMonth, whereQuery, tbmBaseId, TbmBase_MonthConfig} = props
  const [kyuyoTableList, setkyuyoTableList] = useState<KyuyoRecord[]>([])
  const initFetch = async () => {
    const {kyuyoTableList: data} = await getKyuyoTableList({whereQuery, tbmBaseId})

    setkyuyoTableList(data)
  }

  useEffect(() => {
    initFetch()
  }, [])

  return (
    <FitMargin className={`pt-4`}>
      <NewDateSwitcher {...{monthOnly: true}} />
      {CsvTable({
        records: kyuyoTableList.map(item => {
          const {keyValue, user} = item

          return {
            csvTableRow: Object.keys(keyValue).map(key => {
              const data = item.keyValue[key]

              if (InlineInputKey.includes(key)) {
                let dataKey = key.split(`_`)[1]
                dataKey = String(dataKey).toLowerCase()

                return {
                  ...data,
                  cellValue: (
                    <Input
                      {...{
                        yearMonth,
                        user,
                        dataKey,
                        value: data.cellValue,
                        myKyuyoTableRecord: data,
                        initFetch,
                      }}
                    />
                  ),
                }
              } else {
                return {...data, cellValue: typeof data.cellValue === `number` ? Calc.round(data.cellValue, 0) : data.cellValue}
              }
            }),
          }
        }),
      }).WithWrapper({
        className: `text-sm max-w-[95vw] max-h-[80vh] t-paper`,
      })}
    </FitMargin>
  )
}

const Input = ({yearMonth, user, dataKey, value, initFetch}) => {
  const onInput = async e => {
    const value = e.target.value

    const unique_userId_yearMonth = {
      yearMonth: yearMonth,
      userId: user.id,
    }
    await fetchUniversalAPI(`kyuyoTableRecord`, `upsert`, {
      where: {unique_userId_yearMonth},
      ...createUpdate({...unique_userId_yearMonth, [dataKey]: Number(value)}),
    })

    initFetch()
  }
  return (
    <input
      type="number"
      {...{
        defaultValue: value,
        className: `border-b bg-gray-200 w-[100px]`,

        onKeyDown: e => {
          if (e.key === `Enter`) {
            onInput(e)
          }
        },
        onBlur: onInput,
      }}
    />
  )
}
