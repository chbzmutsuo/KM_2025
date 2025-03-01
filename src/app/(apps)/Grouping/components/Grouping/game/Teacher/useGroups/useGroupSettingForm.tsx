import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {DH} from '@class/DH'
import {Fields} from '@class/Fields/Fields'

import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export type useGroupSettingFormReturnType = ReturnType<typeof useGroupSettingForm>
export default function useGroupSettingForm({Game, groupConfigMaster, defaultCount}) {
  const formData = {
    groupCreationMode: `groupMemberCount`,
    count: defaultCount,
    criteria: groupConfigMaster.groupType.options[0].id,
    genderConfig: groupConfigMaster.gender.options[0].id,
  }

  const columns = new Fields([
    {
      id: `groupCreationMode`,
      label: `割り振り単位は？`,
      forSelect: {
        radio: {},
        optionsOrOptionFetcher: groupConfigMaster.groupCreationMode.options,
      },
    },
    {id: `count`, label: `〇〇班（人）ずつ？`, type: `number`},
    {
      id: `criteria`,
      label: `どういうグループ？`,
      forSelect: {
        radio: {},
        optionsOrOptionFetcher: groupConfigMaster.groupType.options,
      },
    },
    {
      id: `genderConfig`,
      label: `男女は？`,
      forSelect: {
        radio: {},
        optionsOrOptionFetcher: groupConfigMaster.gender.options,
      },
    },
  ])
    .customAttributes(({col}) => ({...col, form: {...defaultRegister}}))
    .transposeColumns()

  const defaultValue = {...formData, ...DH.clean(Game.GroupCreateConfig)}

  const {latestFormData, BasicForm, ReactHookForm} = useBasicFormProps({
    onFormItemBlur: async props => {
      const gameId = Game.id
      const keyValue = {[props.name]: props.value}

      const res = await fetchUniversalAPI(`groupCreateConfig`, `upsert`, {
        where: {gameId},
        create: {gameId, ...keyValue},
        update: {gameId, ...keyValue},
      })
    },
    columns,
    formData: defaultValue,
    values: defaultValue,
  })

  return {
    ReactHookForm,
    groupConfigFormValues: latestFormData as typeof formData,
    GroupConfigForm: BasicForm,
  }
}
