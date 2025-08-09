import type {CSSProperties, ReactNode, Ref, MouseEventHandler, KeyboardEventHandler, FocusEventHandler} from 'react'
import type {JSX} from 'react'
import type {
  FieldPathValue,
  FieldValues,
  InternalFieldName,
  Message,
  UseFormReturn,
  ValidateResult,
  ValidationRule,
} from 'react-hook-form'
import {twMerge} from 'tailwind-merge'

// エイリアスimport
import type {acceptType, FileData, fileInfo} from '@cm/types/file-types'
import type {ControlContextType, ControlOptionType} from '@cm/types/form-control-type'
import type {PrismaModelNames} from '@cm/types/prisma-types'

// 相対パスimport
import type {optionType, transposeColumnsOptionProps} from 'src/cm/class/Fields/col-operator-types'
import type {useGlobalPropType} from 'src/cm/hooks/globalHooks/useGlobal'
import type {myFormDefaultUpsertPropType} from '@cm/lib/formMethods/separateFormData'
import type {prismaDataExtractionQueryType} from 'src/cm/components/DataLogic/TFs/Server/Conf'
import type {ClientPropsType2} from '@cm/components/DataLogic/TFs/PropAdjustor/types/propAdjustor-types'
import type {EasySearchObject} from 'src/cm/class/builders/QueryBuilderVariables'
import {forSelcetType, multipleSelectProps} from '@cm/types/select-types'
import {upsertControllerType} from '@cm/types/form-types'
import {anyObject} from '@cm/types/utility-types'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

// --- JSX関連 ---
export type JSXReturnFunc = (props: any) => JSX.Element

// --- カラム型・テーブル型 ---
export type colTypeStr =
  | 'json'
  | 'url'
  | 'text'
  | 'price'
  | 'ratio'
  | 'selectId'
  | 'number'
  | 'int'
  | 'datetime-local'
  | 'float'
  | 'date'
  | 'boolean'
  | 'rating'
  | 'time'
  | 'month'
  | 'year'
  | 'datetime'
  | 'color'
  | 'select'
  | 'file'
  | 'slate'
  | 'email'
  | 'password'
  | 'textarea'
  | 'confirm'
  | 'string'
  | 'review'
  | 'array'
  | 'rate'
  | ''

// --- カラム・フォーム関連型 ---
export type TdcreateFormPropss = {
  style?: CSSProperties | ((value, record) => any) | any
  hidden?: boolean
  rowSpan?: number
  colSpan?: number
  rowIndex?: any
  colIndex?: any
  reverseLabelTitle?: boolean
}

export type onFormItemBlurType = (props: {
  e: React.BaseSyntheticEvent
  id: string
  value: any
  name: string
  newlatestFormData: anyObject
  ReactHookForm: UseFormReturn
}) => any

// --- セレクト・オプション関連型 ---

export type OptionCreatorProps = {searchedInput} & ControlContextType

export type getItems = (props: ControlContextType & {searchFormData: anyObject}) => Promise<{
  optionsHit: optionType[]
  searchFormData: anyObject
}>

export type allowCreateOptionsType = {
  creator?: () => {
    getCreatFormProps?: (props: ControlContextType & {searchFormData: anyObject}) => {
      columns: colType[][]
      formData: anyObject
    }
  }
}

export type colTdProps = {
  withLabel?: boolean
  editable?: {
    upsertController?: upsertControllerType
    style?: CSSProperties
  }
  getRowColor?: dataFormatterType
  divider?: anyObject
  linkTo?: {
    format?: dataFormatterType
    href?: (record: anyObject) => string
  }
} & TdcreateFormPropss

export type editFormatType = ClientPropsType2 & {
  ReactHookForm: anyObject
}

export type registerType = {
  required?: Message | ValidationRule<boolean>
  min?: ValidationRule<number | string>
  max?: ValidationRule<number | string>
  maxLength?: ValidationRule<number>
  minLength?: ValidationRule<number>
  validate?: (value?: string, formValues?: any) => ValidateResult | Promise<ValidateResult>
  value?: FieldPathValue<FieldValues, string>
  setValueAs?: (value?: any) => any
  shouldUnregister?: boolean
  onChange?: (event?: any) => void
  onBlur?: (event?: any) => void
  disabled?: boolean
  deps?: InternalFieldName | InternalFieldName[]
}

export type colFormProps = {
  showResetBtn?: boolean
  placerHolder?: any
  file?: {
    accept?: acceptType
    backetKey: string
  }
  send?: boolean //prisma送信時に含めるかどうか(default true)
  descriptionNoteAfter?: dataFormatterType | string
  style?: CSSProperties
  defaultValue?: any
  register?: registerType

  editFormat?: (props: ControlContextType) => any
  addFormat?: JSXReturnFunc | any
  disabled?: boolean | ((props: {record: any; col: any}) => boolean)
} & TdcreateFormPropss

export type colTypeOptional = {
  isMain?: boolean

  surroundings?: {
    form?: {
      left?: any
      right?: any
    }
  }

  onFormItemBlur?: onFormItemBlurType
  type?: colTypeStr
  inputProps?: {
    step?: number
    min?: number
    required?: boolean
    placeholder?: string
  } & anyObject
  inputTypeAs?: colTypeStr
  th?: {
    format?: (col: colType) => any
    style?: CSSProperties
    divider?: anyObject
    hidden?: boolean
    // format: dataFormatterType
  }
  affix?: {
    label?: string
    prefix?: string
    suffix?: string
  }
  format?: dataFormatterType
  multipleSelect?: multipleSelectProps
  forSelect?: forSelcetType

  td?: colTdProps
  form?: colFormProps | null
  search?: anyObject
  sort?: anyObject
  // Register?: anyObject
  originalColIdx?: number // このカラムが元々のカラムの何番目か（自動計算のため手動は不要）
}

export type colType = {
  id: string
  label: any
} & colTypeOptional

export type columnGetterType = {
  useGlobalProps: useGlobalPropType
  transposeColumnsOptions?: transposeColumnsOptionProps
  ColBuilderExtraProps?: anyObject & {UseRecordsReturn?: UseRecordsReturn}
}

// --- テーブル・フォーム全体の型 ---
export type MyTableType =
  | {
      NoDataElement?: () => JSX.Element
      className?: string
      configPosition?: 'popover' | 'top'
      tableId?: string
      style?: anyObject
      create?: anyObject | boolean
      delete?: anyObject | boolean | {allowByRecord: (props: {record: any}) => void}
      update?: anyObject | boolean
      search?: anyObject | boolean
      sort?: anyObject | boolean
      pagination?: {countPerPage?: number}
      drag?: anyObject | boolean
      header?: anyObject | boolean
      AdditionalActionButtonObject?: {
        [key: string]: (props: {record: any}) => JSX.Element
      }
      fixedCols?: number
      customActions?: (props: {ClientProps2: ClientPropsType2}) => JSX.Element
      showHeader?: boolean
      showRecordIndex?: boolean
      hideEasySearch?: boolean
      useWrapperCard?: boolean
    }
  | undefined

export type extraFormStateType = {
  files?: {[key in PrismaModelNames | string]?: FileData[]}
}

type myformCreateDeleteMethod = ((props: myFormDefaultUpsertPropType) => void) | boolean | anyObject

export type MyFormType = {
  create?: upsertControllerType
  delete?: myformCreateDeleteMethod
  style?: anyObject
  className?: string
  showHeader?: (formData: anyObject) => JSX.Element
  customActions?: JSXReturnFunc
  basicFormClassName?: string
  basicFormControlOptions?: ControlOptionType
  onFormItemBlur?: onFormItemBlurType
}

export type MyModalType = {
  style?: CSSProperties
}

export type additionalPropsType =
  | {
      select?: {[key: string]: boolean}
      omit?: {[key: string]: boolean}
      orderBy?: any[]
      payload?: anyObject
      where?: anyObject
      include?: anyObject | null
      toggleLoadFunc?: any
    }
  | undefined

export type prismaDataType = {
  records: any[]
  totalCount: number
  noData: boolean
  loading: boolean
  beforeLoad?: boolean
}

export type editTypePropType =
  | {
      type: 'modal' | 'page' | 'pageOnSame'
      path?: string
      pathnameBuilder?: (props: {record: any; pathname: string; rootPath: string}) => string
    }
  | undefined
  | null

export type dataMinimumServerType = {
  prismaDataExtractionQuery?: prismaDataExtractionQueryType
  EditForm?: any
  additional?: additionalPropsType
  editType?: editTypePropType
}

export type dataMinimumCommonType = dataMinimumServerType & {
  columns: colType[][]
  useGlobalProps: useGlobalPropType
}

//最低限必要
export type dataMinimul_FormData_Type = dataMinimumCommonType & formDataStateType
export type dataModelNameType = PrismaModelNames

//クライアントで使うformDataを含んだもの
export type formDataStateType = {
  dataModelName: dataModelNameType
  // prismaData: prismaDataType
  formData: anyObject | null | undefined
  setformData: any
}

export type DetailPagePropType = {
  UseRecordsReturn?: UseRecordsReturn
  myForm?: MyFormType
  myTable?: MyTableType
  PageBuilderExtraProps?: anyObject
  records: any[]
  setrecords: any
  mutateRecords: any
  deleteRecord: any
} & dataMinimul_FormData_Type

export type form_table_modal_config = {
  myForm?: MyFormType
  myTable?: MyTableType
  myModal?: MyModalType
}

export type dataFormatterType = (value: any, row: anyObject, col: colType) => any

export type requestResultType = {
  success: boolean
  message: string
  error?: any
  result?:
    | any
    | ({
        fileInfo?: fileInfo
        url?: string
      } & anyObject)
}

export type DetailedPageCCPropType = {
  dataModelName: dataModelNameType
  // prismaData: prismaDataType
  ColBuilder?: anyObject

  EditForm?: any
  additional?: additionalPropsType
  myForm: MyFormType | undefined
  backToListFunction?: () => void
}

export type PageBuilderGetterType = {
  class: anyObject
  getter: string
}

export type serverFetchihngDataType = {
  DetailePageId: number | undefined
  easySearchObject: EasySearchObject
  easySearchWhereAnd: any[]
  EasySearcherQuery: any
  prismaDataExtractionQuery: any
  // prismaData: any
  // easySearchPrismaDataOnServer: easySearchDataSwrType
}

export type globalModalString = 'workLogHistory' | `sateiConnection` | `SaleEditor`

// --- htmlProps型・ユーティリティ関数 ---
export type htmlProps = {
  id?: string
  className?: string
  ref?: Ref<any>
  style?: CSSProperties
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler
  onKeyDown?: KeyboardEventHandler
  onBlur?: FocusEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onMouseDown?: MouseEventHandler
  children?: ReactNode
}

/**
 * htmlPropsをマージするユーティリティ関数
 */
export const mergeHtmlProps = (htmlProps: htmlProps, uniqueProps?: Partial<htmlProps>) => {
  const newObject = {...htmlProps}
  // styleだけobjectマージ
  if (uniqueProps?.style) {
    newObject.style = {...uniqueProps.style, ...newObject.style}
  }
  // classNameはtwMerge
  if (uniqueProps?.className) {
    newObject.className = newObject.className ? twMerge(uniqueProps.className, newObject.className) : uniqueProps.className
  }
  // その他は上書き
  if (uniqueProps) {
    Object.keys(uniqueProps).forEach(key => {
      if (key !== 'style' && key !== 'className') {
        newObject[key] = uniqueProps[key]
      }
    })
  }
  return newObject
}
