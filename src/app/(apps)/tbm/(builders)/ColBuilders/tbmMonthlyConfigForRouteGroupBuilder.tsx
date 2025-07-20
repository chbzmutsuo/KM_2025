'use client'

import TbmRouteCl, {TbmRouteData} from '@app/(apps)/tbm/(class)/TbmRouteCl'
import useUnchinChildCreator from '@app/(apps)/tbm/(globalHooks)/useUnchinChildCreator'
import {defaultRegister} from '@cm/class/builders/ColBuilderVariables'
import {NumHandler} from '@cm/class/NumHandler'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {KeyValue} from '@cm/components/styles/common-components/ParameterCard'

export const tbmMonthlyConfigForRouteGroupBuilder = (props: columnGetterType) => {
  const HK_UnchinChildCreator = useUnchinChildCreator()

  return new Fields([
    // {
    //   id: `fee-history`,
    //   label: '付帯作業 / 運賃 \n(最新を表示)',
    //   form: {hidden: true},
    //   format: (value, row) => {
    //     const latestTbmRouteGroupFee = row.TbmRouteGroupFee[0]
    //     const {futaiFee = 0, driverFee = 0} = latestTbmRouteGroupFee ?? {}

    //     return (
    //       <R_Stack className={`gap-1 flex-nowrap w-[220px]`}>
    //         <div className={`min-w-[100px]`}>{NumHandler.WithUnit(futaiFee ?? 0, '')}</div>

    //         <div className={`min-w-[100px]`}>{NumHandler.WithUnit(driverFee ?? 0, '')}</div>
    //       </R_Stack>
    //     )
    //   },
    // },

    {
      id: 'seikyuKaisu',
      label: '請求回数\n(チェック用)',
      type: 'number',
      td: {style: {width: 100}},
    },

    {
      id: 'generalFee',
      label: '通行料\n(一般)',
      type: 'number',
      td: {style: {width: 100}},
    },

    {
      id: 'tsukoryoSeikyuGaku',
      label: '通行料請求額',
      type: 'number',
      td: {style: {width: 100}},
    },
    {
      id: 'postalFee',
      label: `その他情報`,
      type: 'number',

      form: {hidden: true},
      format: (value, row: TbmRouteData) => {
        const {TbmDriveSchedule, TbmMonthlyConfigForRouteGroup} = row
        const monthConfig = TbmMonthlyConfigForRouteGroup?.[0]
        const TbmRouteInst = new TbmRouteCl(row)
        const {tsukoryo, jitsudoKaisu} = TbmRouteInst.getMonthlyData(monthConfig?.yearMonth)

        const latestTbmRouteGroupFee = row.TbmRouteGroupFee[0]
        const {futaiFee = 0, driverFee = 0} = latestTbmRouteGroupFee ?? {}

        return (
          <div style={{width: 240}} className={`grid grid-cols-2`}>
            <KeyValue {...{label: '運賃'}}>{NumHandler.WithUnit(futaiFee ?? 0, '')}</KeyValue>
            <KeyValue {...{label: '実働回数'}}>{jitsudoKaisu}</KeyValue>
            <KeyValue {...{label: '付帯作業'}}>{NumHandler.WithUnit(driverFee ?? 0, '')}</KeyValue>
            <KeyValue {...{label: '通行料(郵便)'}}>{NumHandler.WithUnit(tsukoryo, '')}</KeyValue>
          </div>
        )
      },
    },
  ])
    .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
    .transposeColumns()
}
