'use client'

import {UserColBuilder} from './UserColBuilder'
import {TbmVehicleColBuilder} from './TbmVehicleColBuilder'
import {TbmBaseColBuilder} from './TbmBaseColBuilder'
import {TbmRouteGroupColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRouteGroupColBuilder'
import {TbmRouteColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRouteColBuilder'
import {TbmBillingAddressColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmBillingAddressColBuilder'
import {TbmOperationGroupColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmOperationGroupColBuilder'
import {TbmRefuelHistoryColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/TbmRefuelHistoryColBuilder'

export class ColBuilder {
  static user = UserColBuilder
  static tbmVehicle = TbmVehicleColBuilder
  static tbmBase = TbmBaseColBuilder
  static tbmRouteGroup = TbmRouteGroupColBuilder
  static tbmRoute = TbmRouteColBuilder
  static tbmBillingAddress = TbmBillingAddressColBuilder
  static tbmOperationGroup = TbmOperationGroupColBuilder
  static tbmRefuelHistory = TbmRefuelHistoryColBuilder
}
