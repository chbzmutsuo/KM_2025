'use client'
import {tbmMonthlyConfigForRouteGroupBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmMonthlyConfigForRouteGroupBuilder'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {useState} from 'react'
import {toast} from 'react-toastify'

export const TbmRouteGroupColBuilder = (props: columnGetterType) => {
  const {selectedRouteGroup, setselectedRouteGroup, yearMonth} = props.ColBuilderExtraProps ?? {}
  const {useGlobalProps} = props

  return new Fields([
    {id: 'name', label: '名称', td: {style: {minWidth: 200}}, form: {...defaultRegister}},

    ...tbmMonthlyConfigForRouteGroupBuilder({useGlobalProps})
      .flat()
      .map(col => {
        const dataKey = col.id
        return {
          id: dataKey,
          label: col.label,
          format: (val, row) => {
            const MonthConfig = row.TbmMonthlyConfigForRouteGroup[0]
            const defaultValue = MonthConfig?.[dataKey] ?? ''
            const [value, setvalue] = useState(defaultValue)
            const unique_yearMonth_tbmRouteGroupId = {yearMonth, tbmRouteGroupId: row.id}
            const style = col.td?.style

            return (
              <input
                style={style}
                type={col.type}
                className={`border  pl-1 ${value ? '' : ' opacity-30'}`}
                onChange={e => setvalue(e.target.value)}
                onBlur={async e => {
                  const value = col.type === `number` ? Number(e.target.value) : e.target.value

                  const res = await fetchUniversalAPI(`tbmMonthlyConfigForRouteGroup`, `upsert`, {
                    where: {unique_yearMonth_tbmRouteGroupId},
                    ...createUpdate({
                      ...unique_yearMonth_tbmRouteGroupId,
                      [dataKey]: value ?? '',
                    }),
                  })
                  if (res.success === false) {
                    toast.error(res.message)
                  }
                }}
                value={value ?? null}
              />
            )
          },
        }
      }),

    // {
    //   id: 'selectedRouteGroup',
    //   label: '内訳編集',
    //   format: (value, row) => {
    //     const active = selectedRouteGroup?.id === row?.id
    //     return (
    //       <Button
    //         {...{
    //           color: active ? `primary` : ``,
    //           active,
    //           size: `sm`,
    //           onClick: () => setselectedRouteGroup(row),
    //         }}
    //       >
    //         内訳編集
    //       </Button>
    //     )
    //   },
    // },
  ]).transposeColumns()
}
