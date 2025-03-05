import {colType, columnGetterType} from '@cm/types/types'
import {Fields} from '@class/Fields/Fields'
import {getMidnight} from '@class/Days'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
export const TbmRefuelHistoryColBuilder = (props: columnGetterType) => {
  const {session} = props.useGlobalProps
  const userId = session?.id
  const {tbmVehicleId, lastOdometerEnd} = props.ColBuilderExtraProps ?? {}

  let colSource: colType[] = [
    // {id: 'tbmOperationGroupId', label: '運行', form: {}, forSelect: {}},
  ]

  if (!tbmVehicleId) {
    colSource = [
      ...colSource,
      {
        id: 'tbmVehicleId',
        label: '車両',
        form: {
          ...defaultRegister,
          defaultValue: tbmVehicleId,
          disabled: tbmVehicleId ? true : false,
        },
        forSelect: {},
      },
    ]
  }

  colSource = [
    ...colSource,
    {
      id: 'date',
      label: '日付',
      form: {
        ...defaultRegister,
        defaultValue: getMidnight(),
      },
      type: `date`,
    },

    {
      id: 'userId',
      label: '',
      forSelect: {},
      form: {
        defaultValue: userId,
        disabled: userId,
      },
    },
    {
      id: 'type',
      label: '区分',
      form: {...defaultRegister},
      forSelect: {optionsOrOptionFetcher: [`自社`, `他社`]},
    },
    {
      id: 'amount',
      label: '給油量',
      form: {
        ...defaultRegister,
      },
      type: `float`,
    },
    {
      id: 'odometer',
      label: 'オドメーター',
      form: {
        ...defaultRegister,
      },
      type: `float`,
    },
  ]

  return (
    new Fields(colSource)
      // .showSummaryInTd({convertColId: {tbmVehicleId: 'TbmVehicle.name'}})
      .customAttributes(({col}) => {
        return {...col, search: {}}
      })
      .transposeColumns()
  )
}
