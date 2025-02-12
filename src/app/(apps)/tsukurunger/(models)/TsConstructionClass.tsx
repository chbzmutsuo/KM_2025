import {getExpenseSheetRecordsOrigin} from '@app/(apps)/tsukurunger/(models)/methods/getExpenseSheetRecords'
import {getProgressSheetRecords} from '@app/(apps)/tsukurunger/(models)/methods/getProgressSheetRecordsOrigin'

export class TsConstructionClass {
  TsConstruction

  constructor(TsConstruction) {
    this.TsConstruction = TsConstruction
  }

  getProgressSheetRecords = ({tsConstructionDiscountList, settsConstructionDiscountList}) =>
    getProgressSheetRecords(this, {tsConstructionDiscountList, settsConstructionDiscountList})

  getExpenseSheetRecords = () => getExpenseSheetRecordsOrigin(this)
}
