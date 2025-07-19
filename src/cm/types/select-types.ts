// --- セレクト・オプション関連型 ---
import type {CSSProperties} from 'react'
import type {PrismaModelNames} from '@cm/types/prisma-types'
import type {ControlContextType} from '@cm/types/form-control-type'
import type {colType, colTypeStr} from './col-types'
import type {optionType, optionsOrOptionFetcherType} from 'src/cm/class/Fields/col-operator-types'
import type {codeObjectArgs} from '@cm/class/Code'
import type {anyObject} from './utility-types'

export type forSelectConfig = {
  displayExtractKeys?: string[]
  modelName?: PrismaModelNames
  select?: {[key: string]: colTypeStr | boolean}
  where?: anyObject | ((props: {col: colType; latestFormData: anyObject}) => anyObject)
  orderBy?: any
  include?: any
  nameChanger?: (op: optionType & anyObject) => optionType & {name: any}
  messageWhenNoHit?: string
}

export type OptionCreatorProps = {searchedInput: any} & ControlContextType

export type getItems = (props: ControlContextType & {searchFormData: anyObject}) => Promise<{
  optionsHit: optionType[]
  searchFormData: anyObject
}>

export type allowCreateOptionsType = {
  creator?: () => {
    getCreatFormProps?: (props: ControlContextType & {searchFormData: anyObject}) => {
      columns: any[][]
      formData: anyObject
    }
  }
}

export type multipleSelectProps = {
  models: {
    parent: PrismaModelNames
    mid: PrismaModelNames
    option: PrismaModelNames
    uniqueWhereKey: string
  }
}

export type forSelcetType = {
  codeMaster?: codeObjectArgs
  radio?: anyObject
  searcher?: (props: ControlContextType) => {
    getSearchFormProps?: () => {
      columns: any[][]
      formData: anyObject
    }
    getItems?: getItems
  }
  config?: forSelectConfig
  dependenceColIds?: string[]
  allowCreateOptions?: allowCreateOptionsType
  optionsOrOptionFetcher?: optionsOrOptionFetcherType | optionType[] | any[]
  option?: {
    alignment?: {
      direction?: 'row' | 'column'
      justify?: 'start' | 'end' | 'center' | 'between' | 'around'
      alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
    }
    style: CSSProperties
  }
}
