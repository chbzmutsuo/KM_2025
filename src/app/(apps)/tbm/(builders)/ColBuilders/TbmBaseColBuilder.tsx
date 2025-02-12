'use client'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'
import {Button} from '@components/styles/common-components/Button'

export const TbmBaseColBuilder = (props: columnGetterType) => {
  const {selectedBase, setselectedBase, setselectedRouteGroup} = useSelectedBase()

  return new Fields([
    {id: 'name', label: '名称', form: {...defaultRegister}},
    {
      id: 'selectedBase',
      label: 'コース編集',
      format: (value, row) => {
        const active = selectedBase?.id === row?.id
        return (
          <Button
            {...{
              color: active ? `primary` : ``,
              active,
              size: `sm`,
              onClick: () => {
                setselectedBase(row)
                setselectedRouteGroup(null)
              },
            }}
          >
            コース編集
          </Button>
        )
      },
    },
  ]).transposeColumns()
}
