'use client'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {formatDate} from '@class/Days'
import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType, forSelectConfig} from '@cm/types/types'
import {addMonths, addYears} from 'date-fns'

export const TbmVehicleColBuilder = (props: columnGetterType) => {
  return new Fields([
    ...new Fields([
      {id: 'tbmBaseId', label: '営業所', forSelect: {}, form: {}},
      {id: 'vehicleNumber', label: '車両番号', form: {...defaultRegister}},
      {id: 'type', label: '車種', form: {}},
      {id: 'shape', label: '形状', form: {}},
      {id: 'airSuspension', label: 'エアサス有無', form: {}},
    ]).buildFormGroup({groupName: '車両情報①'}).plain,

    ...new Fields([
      {id: 'oilTireParts', label: 'オイル・タイヤ・備品代', form: {}},
      {id: 'maintenance', label: '整備代', form: {}},
      {id: 'insurance', label: '保険代', form: {}},
    ]).buildFormGroup({groupName: '車両情報②'}).plain,

    ...new Fields([
      {id: 'shodoTorokubi', label: '初度登録日', form: {}, type: `date`},
      {id: 'hokenManryobi', label: '保険満了日', form: {}, type: `date`},

      {
        id: 'sokoKyori',
        label: '走行距離',
        form: {hidden: true},
        format: (value, row) => {
          return `日々の入力から自動計算`
        },
      },

      {
        id: 'sakenManryobi',
        label: '車検満了日',
        form: {hidden: true},
        format: (value, row) => {
          const {TbmVehicleMaintenanceRecord} = row

          const lastInspection = TbmVehicleMaintenanceRecord.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          }).find(item => item.type === '車検')

          if (lastInspection) {
            const nextInspection = addYears(lastInspection.date, 2)
            return `${formatDate(nextInspection, 'short')}`
          }

          return `過去の点検なし`
        },
      },
      {
        id: 'sankagetsuTenkenbi',
        label: '3ヶ月点検',
        form: {hidden: true},
        format: (value, row) => {
          const {TbmVehicleMaintenanceRecord} = row

          const lastInspection = TbmVehicleMaintenanceRecord.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          }).find(item => item.type === '3ヶ月点検')

          if (lastInspection) {
            const nextInspection = addMonths(lastInspection.date, 3)
            return `${formatDate(nextInspection, 'short')}`
          }

          return `過去の点検なし`
        },
      },
      {
        id: 'maintenanceRecord',
        label: '整備記録',
        form: {hidden: true},
        format: (value, row) => {
          const {TbmVehicleMaintenanceRecord} = row
          return `${TbmVehicleMaintenanceRecord.length}件`
        },
      },
    ]).buildFormGroup({groupName: '車両情報③'}).plain,
  ]).transposeColumns()
}

export const getVehicleForSelectConfig = ({tbmBaseId}: {tbmBaseId?: number}) => {
  const result: forSelectConfig = {
    where: {tbmBaseId: tbmBaseId ?? undefined},
    orderBy: [{id: `asc`}],
    select: {
      id: `number`,
      code: `string`,
      vehicleNumber: `string`,
      type: `string`,
      shape: `string`,
      name: false,
    },
    nameChanger(op) {
      const {type, shape} = op
      return {...op, name: op ? [`[${type}]`, op.vehicleNumber, shape].join(` `) : ''}
    },
  }

  return result
}
