import {formDataType} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/NippoForm'
import {nippoOptions} from '@app/(apps)/tsukurunger/(pages)/daily/[tsConstructionId]/input/page'
import {Arr} from '@class/Arr'
import {DH} from '@class/DH'
import {MidTsNippoTsWorkContent} from '@prisma/client'

import {P_TsNippo} from 'scripts/generatedTypes'

export type tsNippoOptionKeyId =
  | 'user'
  | 'tsRegularSubcontractor'
  | 'tsSubcontractor'
  | 'tsMachinery'
  | 'tsWorkContent'
  | 'tsMaterial_道路&生コン'
  | 'tsMaterial_常用ダンプ&二次製品'
  | 'tsMaterial_大空ﾘｻｲｸﾙｾﾝﾀｰ&産廃'
  | 'tsMaterial_管材'
  | 'tsMaterial_副資材'
  | 'tsMaterial_フェンス'
  | 'tsMaterial_保安材'
  | 'tsMaterial_残土処分'
  | 'tsMaterial_送料'
  | 'tsMaterial_外注費'

export type groupLabelType = '作業員' | '常用下請け' | '下請け' | '機械' | '作業内容' | '材料' | 'その他費用'

export type optionKey = {
  id: tsNippoOptionKeyId
  devideBy: number
  groupLabel: groupLabelType
  modelName: string
  relationalModelName: string
  materialGroupName: string
}

type NippoType = P_TsNippo & {MidTsNippoTsWorkContent: MidTsNippoTsWorkContent[]}
export class TsNippo {
  Nippo: NippoType
  inputValues = {}

  constructor(Nippo) {
    this.Nippo = Nippo as NippoType
    const midTables = Arr.uniqArray(TsNippo.optionKeys.map(d => d.relationalModelName))

    if (midTables.some(name => this.Nippo[name] === undefined)) {
      throw new Error(`TsNippo is not valid`)
    }
  }

  filterWorkContentActiveNippo = () => {
    return this?.Nippo?.MidTsNippoTsWorkContent?.length > 0
  }
  filterActiveNippo = () => {
    return true
    // return this.getTotalPrice().sum > 0 || this?.Nippo?.MidTsNippoTsWorkContent?.length > 0
  }

  importToTsNippo = (props: {formData: formDataType; nippoOptions: nippoOptions}) => {
    const {formData, nippoOptions} = props

    TsNippo.optionKeys.forEach(d => {
      const {id, modelName, relationalModelName} = d

      let selectedValues = formData[id]
      if (id.includes('tsMaterial')) {
        const MaterialRelatedKeys = TsNippo.optionKeys.filter(d => d.id.includes('tsMaterial')).map(d => d.id)

        selectedValues = MaterialRelatedKeys.reduce((acc, cur) => {
          return acc.concat(formData[cur])
        }, [] as any).flat()
      }

      if (this.Nippo[relationalModelName] === undefined) {
        throw new Error(`relationalModelName is undefined`)
      }

      const newRelationalModels = selectedValues.map(d => {
        const {value, count, price} = d
        const ModelName = DH.capitalizeFirstLetter(modelName)

        const options = nippoOptions[modelName]
        const ModelData =
          this.Nippo[relationalModelName].find(d => d[ModelName]?.id === value) ?? options.find(d => d.id === value)

        return {
          ...ModelData,
          count,
          price,
        }
      })

      this.Nippo[relationalModelName] = newRelationalModels
    })
    return this
  }

  static optionKeys = [
    {id: 'user', devideBy: 8, groupLabel: `作業員`},
    {id: 'tsRegularSubcontractor', devideBy: 8, groupLabel: `常用下請け`},
    {id: 'tsSubcontractor', devideBy: 100, groupLabel: `下請け`},
    {id: 'tsMachinery', devideBy: 1, groupLabel: `機械`},
    {id: 'tsWorkContent', devideBy: 1, groupLabel: `作業内容`},
    {id: 'tsMaterial_道路&生コン', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_常用ダンプ&二次製品', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_大空ﾘｻｲｸﾙｾﾝﾀｰ&産廃', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_管材', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_副資材', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_フェンス', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_保安材', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_残土処分', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_送料', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_外注費', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_その他1', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_その他2', devideBy: 1, groupLabel: `材料`},
    {id: 'tsMaterial_その他3', devideBy: 1, groupLabel: `材料`},
  ].map(d => {
    const [modelName, materialGroupName] = d.id.split(`_`)
    const relationalModelName = `MidTsNippo${DH.capitalizeFirstLetter(modelName)}`
    return {...d, modelName, relationalModelName, materialGroupName}
  }) as optionKey[]

  static midTables = Arr.uniqArray(TsNippo.optionKeys.map(d => d.relationalModelName)).map(relationalModelName => {
    const {groupLabel, modelName} = TsNippo.optionKeys.find(d => d.relationalModelName === relationalModelName) ?? {}

    return {groupLabel, relationalModelName, modelName}
  }) as {groupLabel: string; relationalModelName: string; modelName: string}[]

  getTotalPrice() {
    const expenseTableList = [
      //各種中間テーブル
      ...TsNippo.midTables.filter(d => d.groupLabel !== `作業内容`),
    ]
    const prices: totalPriceSingleItemType[] = expenseTableList
      .map((d, tIdx) => {
        const {groupLabel, modelName, relationalModelName} = d

        const midTableData = this.Nippo[relationalModelName]

        if (midTableData === undefined) {
          throw new Error(`midTableData is undefined`)
        }

        return midTableData.map((d, i) => {
          const SourceModel = d[DH.capitalizeFirstLetter(modelName)]

          const {id: sourceItemId, name: sourceItemName, vendor} = SourceModel ?? {}
          const {price} = d
          return {groupLabel, sourceItemName, vendor, sourceItemId, price, relationalModelName}
        })
      })
      .flat()

    console.log(prices) //////logs

    this.Nippo.TsNippoRemarks.forEach(d => {
      const {price} = d
      const groupLabel = `その他費用`
      const sourceItemName = d.name

      const sourceItemId = d.id

      const obj: totalPriceSingleItemType = {
        groupLabel,
        sourceItemName,
        sourceItemId,
        price,
        midTableName: `TsNippoRemarks`,
        vendor: `not exist`,
      }

      prices.push(obj)
    })

    return {
      prices,
      sum: prices.reduce((acc, cur) => acc + cur.price, 0) ?? 0,
    }
  }
}

export type totalPriceSingleItemType = {
  groupLabel: string
  sourceItemName: string
  sourceItemId: number
  price: number
  midTableName: string
  vendor: string
}
