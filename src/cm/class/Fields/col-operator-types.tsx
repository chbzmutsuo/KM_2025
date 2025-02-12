import {anyObject, colType} from '@cm/types/types'

export type transposeColumnsOptionProps = {
  autoSplit?: {
    table?: number
    form?: number
  }
} & anyObject

export type optionsOrOptionFetcherProps = {
  latestFormData?: anyObject
  col: colType
  // additionalQuery?: anyObject
}

export type optionsOrOptionFetcherType = (
  props: optionsOrOptionFetcherProps
) => Promise<{optionObjArr: optionType[]; modelName?: string}>

export type optionType = {
  value: any
  name?: any
  color?: any
  id?: any
  label?: any
} & anyObject
