'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType, forSelectConfig} from '@cm/types/types'
import {TbmBase} from '@prisma/client'

export const TbmVehicleColBuilder = (props: columnGetterType) => {
  return new Fields([
    {id: 'tbmBaseId', label: '営業所', forSelect: {}, form: {}},
    {...{id: 'vehicleNumber', label: '車両番号'}, form: {...defaultRegister}},
    {...{id: 'type', label: '車種'}, form: {}},
    {...{id: 'shape', label: '形状'}, form: {}},
    {...{id: 'airSuspension', label: 'エアサス有無'}, form: {}},
    {...{id: 'oilTireParts', label: 'オイル・タイヤ・備品代'}, form: {}},
    {...{id: 'maintenance', label: '整備代'}, form: {}},
    {...{id: 'insurance', label: '保険代'}, form: {}},
  ]).transposeColumns()
}

export const getVehicleForSelectConfig = (tbmBase?: TbmBase) => {
  const result: forSelectConfig = {
    where: {tbmBaseId: tbmBase?.id ?? undefined},
    orderBy: [{id: `asc`}],
    select: {
      id: `number`,
      code: `string`,
      vehicleNumber: `string`,
      name: false,
    },
    nameChanger(op) {
      return {...op, name: op ? [`[${op.id}]`, op.vehicleNumber].join(` `) : ''}
    },
  }

  return result
}
