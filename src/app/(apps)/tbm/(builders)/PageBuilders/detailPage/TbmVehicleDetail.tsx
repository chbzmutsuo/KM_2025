'use client'

import {R_Stack} from '@components/styles/common-components/common-components'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {DetailPagePropType} from '@cm/types/types'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {Paper} from '@components/styles/common-components/paper'

export default function TbmVehicleDetail(props: DetailPagePropType) {
  const {useGlobalProps} = props
  return (
    <R_Stack className={` items-start gap-4`}>
      <Paper>
        <MyForm {...props}></MyForm>
      </Paper>
      {!!props?.formData?.id && (
        <>
          <Paper>
            整備履歴
            <ChildCreator
              {...{
                ParentData: props.formData ?? {},
                useGlobalProps,
                additional: {
                  orderBy: [{date: `desc`}],
                },

                models: {parent: `tbmVehicle`, children: `tbmVehicleMaintenanceRecord`},
                columns: ColBuilder.tbmVehicleMaintenanceRecord({
                  useGlobalProps,
                  ColBuilderExtraProps: {tbmVehicleId: props.formData?.id},
                }),
              }}
            />
          </Paper>
          <Paper>
            洗車履歴
            <ChildCreator
              {...{
                ParentData: props.formData ?? {},
                useGlobalProps,
                additional: {
                  orderBy: [{date: `desc`}],
                },

                models: {parent: `tbmVehicle`, children: `tbmCarWashHistory`},
                columns: ColBuilder.tbmCarWashHistory({useGlobalProps, ColBuilderExtraProps: {tbmVehicleId: props.formData?.id}}),
              }}
            />
          </Paper>
        </>
      )}
    </R_Stack>
  )
}
