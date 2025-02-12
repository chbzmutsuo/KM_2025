import {columnGetterType} from '@cm/types/types'
import {Fields} from '@class/Fields/Fields'
import {getMidnight} from '@class/Days'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
export const TbmRefuelHistoryColBuilder = (props: columnGetterType) => {
  const tbmVehicleId = props.ColBuilderExtraProps?.tbmVehicleId
  return new Fields([
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
    {
      id: 'type',
      label: '区分',
      form: {
        ...defaultRegister,
        defaultValue: getMidnight(),
      },
      forSelect: {optionsOrOptionFetcher: [`自社`, `他社`]},
    },
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
    // {id: 'tbmOperationGroupId', label: '運行', form: {}, forSelect: {}},
  ])
    .showSummaryInTd({convertColId: {tbmVehicleId: 'TbmVehicle.name'}})
    .transposeColumns()
}
