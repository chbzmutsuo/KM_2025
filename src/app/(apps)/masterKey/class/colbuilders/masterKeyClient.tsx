import {Fields} from '@cm/class/Fields/Fields'
import {columnGetterType} from '@cm/types/types'

export const MasterKeyClient = (props: columnGetterType) => {
  const data = new Fields([
    {...{id: `name`, label: `名前`}, form: {}},
    //
  ])
  return data.transposeColumns()
}
