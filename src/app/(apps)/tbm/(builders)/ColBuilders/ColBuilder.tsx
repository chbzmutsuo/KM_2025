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
import {tbmProductColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmProductColBuilder'
import {odometerInputColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/odometerInputColBuilder'
import {tbmCustomerColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/tbmCustomerColBuilder'

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
  static tbmProduct = tbmProductColBuilder
  static odometerInput = odometerInputColBuilder
  static tbmCustomer = tbmCustomerColBuilder
  static tbmBase_MonthConfig = (props: columnGetterType) => {
    const {tbmBaseId} = props.ColBuilderExtraProps ?? {}
    return new Fields([
      {id: 'tbmBaseId', label: '営業所', forSelect: {}, form: {defaultValue: tbmBaseId, disabled: tbmBaseId}},
      {id: 'yearMonth', label: '年月', type: 'month'},
      {id: 'keiyuPerLiter', label: '軽油単価', type: 'float'},
    ])
      .customAttributes(({col}) => ({
        ...col,
        form: {
          ...col.form,
          ...defaultRegister,
        },
      }))
      .transposeColumns()
  }
}
