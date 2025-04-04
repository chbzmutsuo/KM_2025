'use client'
import useUnchinChildCreator from '@app/(apps)/tbm/(globalHooks)/useUnchinChildCreator'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {DH} from '@class/DH'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {R_Stack} from '@components/styles/common-components/common-components'
import {KeyValue} from '@components/styles/common-components/ParameterCard'
import {PencilSquareIcon} from '@heroicons/react/20/solid'

export const tbmMonthlyConfigForRouteGroupBuilder = (props: columnGetterType) => {
  const HK_UnchinChildCreator = useUnchinChildCreator()

  return new Fields([
    {
      id: 'pickupTime',
      label: '接車時間',
      type: 'time',
      td: {style: {width: 110}},
    },
    {
      id: 'vehicleType',
      label: '車種',
      type: 'text',
      td: {style: {width: 110}},
    },

    {
      id: `fee-history`,
      label: `運賃/請求運賃(最新)`,
      form: {hidden: true},
      format: (value, row) => {
        const latestTbmRouteGroupFee = row.TbmRouteGroupFee[0]
        // const currentUntin=

        return (
          <R_Stack className={`  w-[200px]`}>
            <PencilSquareIcon
              {...{
                className: `h-5 t-link onHover`,
                onClick: () => HK_UnchinChildCreator.setGMF_OPEN({TbmRouteGroup: row}),
              }}
            />
            <div>
              <KeyValue {...{label: '運賃'}}>{DH.WithUnit(latestTbmRouteGroupFee?.driverFee, '円')}</KeyValue>
              <KeyValue {...{label: '請求運賃'}}>{DH.WithUnit(latestTbmRouteGroupFee?.billingFee, '円')}</KeyValue>
            </div>
          </R_Stack>
        )
      },
    },
    {
      id: 'postalFee',
      label: '通行量(郵便)',
      type: 'number',
      td: {style: {width: 110}},
    },
    {
      id: 'generalFee',
      label: '通行量(一般)',
      type: 'number',
      td: {style: {width: 110}},
    },

    {
      id: 'tollFee',
      label: '通行料（税抜）',
      type: 'number',
      td: {style: {width: 110}},
    },
  ])
    .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
    .transposeColumns()
}
