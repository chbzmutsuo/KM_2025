import {mapAdjustOptionValue} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/MySelectMethods-server'

export const OptionsFromArray = ({givenArrayCols}) => {
  const Array_OP = {}
  givenArrayCols.forEach(col => {
    if (Array.isArray(col?.forSelect?.optionsOrOptionFetcher)) {
      const result = mapAdjustOptionValue(col?.forSelect?.optionsOrOptionFetcher ?? [])

      Array_OP[col.id] = result
    }
  })

  return Array_OP
}
