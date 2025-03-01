'use client'

import {UserColBuilder} from './UserColBuilder'
import {TbmVehicleColBuilder} from './TbmVehicleColBuilder'
import {TbmBaseColBuilder} from './TbmBaseColBuilder'
import {TbmRouteGroupColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRouteGroupColBuilder'
import {TbmRouteColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRouteColBuilder'
import {TbmBillingAddressColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmBillingAddressColBuilder'
import {TbmOperationGroupColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmOperationGroupColBuilder'
import {TbmRefuelHistoryColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRefuelHistoryColBuilder'
import {TbmDriveScheduleBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmDriveScheduleBuilder'
import {tbmOperationBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmOperationBuilder'
import {tbmMonthlyConfigForRouteGroupBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmMonthlyConfigForRouteGroupBuilder'
import {columnGetterType} from '@cm/types/types'
import {Fields} from '@class/Fields/Fields'
import {defaultRegister} from '@class/builders/ColBuilderVariables'

export class ColBuilder {
  static user = UserColBuilder
  static tbmVehicle = TbmVehicleColBuilder
  static tbmBase = TbmBaseColBuilder
  static tbmRouteGroup = TbmRouteGroupColBuilder
  static tbmRoute = TbmRouteColBuilder
  static tbmBillingAddress = TbmBillingAddressColBuilder
  static tbmOperationGroup = TbmOperationGroupColBuilder
  static tbmRefuelHistory = TbmRefuelHistoryColBuilder
  static tbmDriveSchedule = TbmDriveScheduleBuilder
  static tbmOperation = tbmOperationBuilder
  static tbmMonthlyConfigForRouteGroup = tbmMonthlyConfigForRouteGroupBuilder
  static tbmProduct = (props: columnGetterType) => {
    return new Fields([
      {id: 'code', label: 'コード', type: 'text'},
      {id: 'name', label: '名称', type: 'text'},
    ])
      .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
      .transposeColumns()
  }
  static dometerInput = (props: columnGetterType) => {
    const {date, tbmVehicleId} = props.ColBuilderExtraProps ?? {}
    return new Fields([
      {
        id: 'date',
        label: '日付',
        type: 'date',
        form: {defaultValue: {date}},
      },
      {
        id: 'tbmVehicleId',
        label: '',
        forSelect: {},
        form: {
          defaultValue: {
            tbmVehicleId,
          },
        },
      },
      {
        id: 'odometerStart',
        label: '乗車時オドメータ(km)',
        form: {},
        type: `float`,
      },
      {
        id: 'odometerEnd',
        label: '降車時オドメータ(km)',
        form: {},
        type: `float`,
      },
    ]).transposeColumns()
  }
}
