'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const TbmDriveScheduleBuilder = (props: columnGetterType) => {
  const tbmDriveSchedule = props.ColBuilderExtraProps?.tbmDriveSchedule

  const {date, userId, tbmVehicleId, tbmRouteGroupId} = tbmDriveSchedule ?? {}
  return new Fields([
    {
      id: 'date',
      label: '日付',
      form: {
        ...defaultRegister,
        defaultValue: date,
        disabled: date,
      },
      type: 'date',
    },
    {
      id: 'userId',
      label: 'ドライバ',
      form: {
        ...defaultRegister,
        defaultValue: userId,
        disabled: userId,
      },
      forSelect: {},
    },

    {
      id: 'tbmVehicleId',
      label: '車両',
      form: {
        ...defaultRegister,
        defaultValue: tbmVehicleId,
        disabled: tbmVehicleId,
      },
      forSelect: {},
    },
    {
      id: 'tbmRouteGroupId',
      label: 'ルート',
      form: {
        ...defaultRegister,
        defaultValue: tbmRouteGroupId,
        disabled: tbmRouteGroupId,
      },
      forSelect: {},
    },
  ]).transposeColumns()
}
