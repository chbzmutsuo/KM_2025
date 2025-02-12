import {groups} from '@app/(apps)/tsukurunger/class/constants'
import {getMidnight} from '@class/Days'
import {Fields} from '@class/Fields/Fields'
const createOptionsFromArr = options => {
  const excludeKeys = [
    `id`,
    `createdAt`,
    `updatedAt`,
    `active`,
    `sortOrder`,
    `price`,
    `materialType`,
    `unit`,
    // `remarks`,
    `billedAt`,
  ]
  return options.map(op => {
    const keysInData = Object.keys(op)
    const effectiveKeys = keysInData.filter(key => !excludeKeys.includes(key) && op[key])

    // const displayKes = effectiveKeys.filter(key => key !== `remarks`)

    const label = effectiveKeys.map(key => `[${op[key]}]`).join(` `)
    const displayLabel = effectiveKeys.map(key => `[${op[key]}]`).join(` `)
    return {...op, value: op.id, label, displayLabel}
  })
}

export const getNippoFormcols = ({Genba, nippoOptions}) => {
  const materialGroups = groups

  const materialCols = materialGroups.map(group => {
    const {id, name} = group
    return {
      id,
      label: name,
      forSelect: {
        optionsOrOptionFetcher: createOptionsFromArr(nippoOptions[id]),
      },
      td: {hidden: true},
    }
  })

  return new Fields([
    {id: 'date', label: `日付`, type: `date`, form: {defaultValue: getMidnight()}},

    {
      id: 'mainContractor',
      label: `元請け業者`,
      form: {
        defaultValue: Genba.TsMainContractor?.name,
        disabled: true,
      },
    },
    {
      id: 'constructionName',
      label: `現場名`,

      form: {
        defaultValue: Genba?.name,
        disabled: true,
      },
    },

    {
      id: 'user',
      label: `作業員`,
      form: {descriptionNoteAfter: `基準数値=8`, defaultValue: 8},

      forSelect: {
        optionsOrOptionFetcher: nippoOptions.user.map(d => {
          return {...d, value: d.id, label: d.name}
        }),
      },
    },
    {
      id: 'tsRegularSubcontractor',
      label: `常用下請け業者`,
      form: {descriptionNoteAfter: `基準数値=8`, defaultValue: 8},
      forSelect: {
        optionsOrOptionFetcher: createOptionsFromArr(nippoOptions.tsRegularSubcontractor),
      },
    },
    {
      id: 'tsSubcontractor',
      label: `下請け業者`,
      forSelect: {
        optionsOrOptionFetcher: createOptionsFromArr(nippoOptions.tsSubcontractor),
      },
      form: {descriptionNoteAfter: `基準数値=100`, defaultValue: 100},
    },

    {
      id: 'tsWorkContent',
      label: `作業内容`,
      forSelect: {
        optionsOrOptionFetcher: createOptionsFromArr(nippoOptions.tsWorkContent),
      },
    },

    ...materialCols,
    {
      id: 'tsMachinery',
      label: `使用機械`,
      forSelect: {
        optionsOrOptionFetcher: createOptionsFromArr(nippoOptions.tsMachinery),
      },
    },
  ])
    .transposeColumns()
    .flat()
}
