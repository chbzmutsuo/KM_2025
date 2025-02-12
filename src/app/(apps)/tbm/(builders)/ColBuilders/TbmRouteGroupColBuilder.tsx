'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {Button} from '@components/styles/common-components/Button'

export const TbmRouteGroupColBuilder = (props: columnGetterType) => {
  const {selectedRouteGroup, setselectedRouteGroup} = props.ColBuilderExtraProps ?? {}
  return new Fields([
    {id: 'name', label: '名称', form: {...defaultRegister}},
    {
      id: 'selectedRouteGroup',
      label: '内訳編集',
      format: (value, row) => {
        const active = selectedRouteGroup?.id === row?.id
        return (
          <Button
            {...{
              color: active ? `primary` : ``,
              active,
              size: `sm`,
              onClick: () => setselectedRouteGroup(row),
            }}
          >
            内訳編集
          </Button>
        )
      },
    },
  ]).transposeColumns()
}
