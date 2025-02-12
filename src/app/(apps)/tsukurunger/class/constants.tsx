import {colType} from '@cm/types/types'

export const materialTypes = [
  `道路`,
  `生コン`,
  `常用ダンプ`,
  `二次製品`,
  `大空ﾘｻｲｸﾙｾﾝﾀｰ`,
  `産廃`,
  `管材`,
  `副資材`,
  `フェンス`,
  `保安材`,
  `残土処分`,
  `送料`,
  `外注費`,
  `その他1`,
  `その他2`,
  `その他3`,
]
export const groups = [
  {keys: [`道路`, `生コン`]},
  {keys: [`常用ダンプ`, `二次製品`]},
  {keys: [`大空ﾘｻｲｸﾙｾﾝﾀｰ`, `産廃`]},
  {keys: [`管材`]},
  {keys: [`副資材`]},
  {keys: [`フェンス`]},
  {keys: [`保安材`]},
  {keys: [`残土処分`]},
  {keys: [`送料`]},
  {keys: [`外注費`]},
  {keys: [`その他1`]},
  {keys: [`その他2`]},
  {keys: [`その他3`]},
].map(group => {
  const name = group.keys.join(`&`)
  const id = `tsMaterial_${name}`
  return {
    id,
    name,
    ...group,
  }
})

export const commonCols: colType[] = [
  {id: 'name', label: '名称', type: 'string'},
  {id: 'vehicle', label: '車両', type: 'string'},
  {id: 'category', label: '区分', type: 'string'},
  {id: 'unitPrice', label: '単価(税抜)', type: 'float'},
  {id: 'unit', label: '単位', type: 'string'},
  {id: 'vendor', label: '業者名', type: 'string'},
  {
    id: 'materialType',
    label: '材料タイプ',
    forSelect: {
      optionsOrOptionFetcher: materialTypes,
    },
  },
]

// export const sheetNames = [
//   {sheetName: `道路`, model: undefined, columns: commonCols},
//   {sheetName: `生コン`, model: undefined, columns: commonCols},
//   {sheetName: `常用ダンプ`, model: undefined, columns: commonCols},
//   {sheetName: `二次製品`, model: undefined, columns: commonCols},
//   {
//     sheetName: `大空ﾘｻｲｸﾙｾﾝﾀｰ`,
//     model: undefined,
//     columns: [
//       {id: 'name', label: '名称', type: 'string'},
//       {id: 'unitPrice', label: '単価(税抜)', type: 'float'},
//       {id: 'unit', label: '単位', type: 'string'},
//     ],
//     spliceIndexes: [0],
//   },
//   {sheetName: `産廃`, model: undefined, columns: commonCols},
//   {sheetName: `管材`, model: undefined, columns: commonCols},
//   {sheetName: `副資材`, model: undefined, columns: commonCols},
//   {sheetName: `フェンス`, model: undefined, columns: commonCols},

//   // {sheetName: `人工`, model: `tsRegularSubcontractor`, columns: commonCols},
// ]

export const taxRate = 10
