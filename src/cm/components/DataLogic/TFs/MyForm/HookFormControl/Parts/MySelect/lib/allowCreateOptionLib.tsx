import {Fields} from 'src/cm/class/Fields/Fields'
import {getItems} from '@cm/types/types'
import {ForSelectConfig} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/Class/ForSelectConfig'
import {OrSearchArray} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/Class/OrSearchArray'
import {parseContexts} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/useInitMySelect'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export const getAllowCreateDefault = ({contexts}) => {
  const {latestFormData} = parseContexts(contexts)
  const dataModeName = contexts.controlContextValue.col?.forSelect?.config?.modelName

  const SearchFunc = () => {
    const getSearchFormProps = () => {
      const columns = new Fields([{id: `name`, label: ``, form: {}}]).transposeColumns()
      return {columns, formData: {}}
    }

    const getItems: getItems = async props => {
      const col = props.col

      const {selectWithColType, where} = new ForSelectConfig(col, {latestFormData}).getConfig()

      const OR = OrSearchArray.mapGetOrQuery({
        select: selectWithColType,
        object: {name: props.searchFormData.name},
      })

      const {result} = await fetchUniversalAPI(dataModeName, `findMany`, {where: {...where, OR}})

      return {optionsHit: result, searchFormData: props.searchFormData}
    }

    return {getSearchFormProps, getItems}
  }
  const CreateFunc = () => {
    const getCreatFormProps = () => {
      const columns = new Fields([{id: `name`, label: ``, form: {}}]).transposeColumns()
      return {columns, formData: {}}
    }

    return {getCreatFormProps}
  }
  return {SearchFunc, CreateFunc}
}
