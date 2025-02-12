import {optionType} from '@class/Fields/col-operator-types'

export type ApRequestConfig = {
  [ApRequestTypeMasterName: string]: {
    cfList?: {
      name: string
      options?: optionType[]
    }[]
  }
}
