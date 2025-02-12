import {DH} from '@class/DH'
import {colType} from '@cm/types/types'

export function makeFormsByColumnObj(columns: any) {
  const validColumnsForEditForm: colType[] = columns.flat().filter(col => col.form && col?.form?.hidden !== true)
  const formsByColumnObj: any = {}

  validColumnsForEditForm.sort((x: colType, y: colType) => {
    return Number(x.originalColIdx) - Number(y.originalColIdx)
  })

  validColumnsForEditForm.forEach((col: colType) => {
    const {id, form, label: label} = col
    const colIndex = col?.form?.colIndex ?? 0

    DH.makeObjectOriginIfUndefined(formsByColumnObj, colIndex, [])
    formsByColumnObj[colIndex].push(col)
  })

  const transposedRowsForForm: colType[][] = Object.keys(formsByColumnObj).map(key => {
    return formsByColumnObj[key]
  })
  const colIndexes = Object.keys(formsByColumnObj)

  return {transposedRowsForForm, colIndexes}
}
