'use client'
import {tbmMonthlyConfigForRouteGroupBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmMonthlyConfigForRouteGroupBuilder'

import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {colType, columnGetterType} from '@cm/types/types'
import {createUpdate, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {useState} from 'react'
import {toast} from 'react-toastify'

export const TbmRouteGroupColBuilder = (props: columnGetterType) => {
  const {yearMonth, showMonthConfig = false, tbmBaseId} = props.ColBuilderExtraProps ?? {}
  const {useGlobalProps} = props

  const regularStyle = {minWidth: 100, color: `#43639a`, fontSize: 12}

  let colsource: colType[] = [
    {
      id: 'code',
      label: 'CD',
      form: {...defaultRegister, defaultValue: null},
      td: {style: {...regularStyle, minWidth: 60}},
    },
    {
      id: 'tbmBaseId',
      label: '営業所',
      forSelect: {},
      form: {
        ...defaultRegister,
        defaultValue: tbmBaseId,
        disabled: tbmBaseId,
      },
      td: {style: {...regularStyle}},
    },
    {
      id: 'routeKbn',
      label: '区分',
      td: {style: {...regularStyle}},

      form: {...defaultRegister, defaultValue: ``},
    },
    {
      id: 'name',
      label: '名称',
      td: {style: {...regularStyle, minWidth: 160}},
      form: {...defaultRegister},
    },
    {
      id: `tbmCustomerId`,
      label: `取引先`,
      td: {style: {...regularStyle, minWidth: 160}},
      form: {
        defaultValue: (alreadyRegisteredFormData, formData, col) => {
          return formData?.Mid_TbmRouteGroup_TbmCustomer?.TbmCustomer?.id
        },
      },
      forSelect: {},
      // td: {editable: {upsertController: TbmRouteGroupUpsertController as any}},
      format: (val, routeGroup) => {
        return <div>{routeGroup.Mid_TbmRouteGroup_TbmCustomer?.TbmCustomer?.name}</div>
      },
    },
    {
      id: `tbmProductId`,
      label: `商品`,
      td: {style: {...regularStyle, minWidth: 150}},
      form: {
        defaultValue: (alreadyRegisteredFormData, formData, col) => {
          return formData?.Mid_TbmRouteGroup_TbmProduct?.TbmProduct?.id
        },
      },
      forSelect: {},
      format: (val, routeGroup) => {
        return <div>{routeGroup.Mid_TbmRouteGroup_TbmProduct?.TbmProduct?.name}</div>
      },
    },
  ]

  if (showMonthConfig) {
    colsource = [
      ...colsource,
      ...tbmMonthlyConfigForRouteGroupBuilder({useGlobalProps})
        .flat()
        .map(col => {
          const dataKey = col.id
          return {
            id: dataKey,
            label: col.label,
            format: (val, row) => {
              if (col.format) {
                return col.format(val, row, col)
              }

              const MonthConfig = row?.TbmMonthlyConfigForRouteGroup?.[0]
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

      {
        id: `運行回数`,
        label: `運行\n回数`,
        td: {style: {minWidth: 50}},
        format: (val, row) => {
          const {TbmDriveSchedule} = row
          return <div>{TbmDriveSchedule.length}</div>
        },
      },
    ]
  }

  return new Fields([
    ...colsource,

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
