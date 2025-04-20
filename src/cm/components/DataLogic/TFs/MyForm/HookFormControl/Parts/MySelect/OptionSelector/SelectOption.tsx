import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {contextsType} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/my-select-types'
import {ColoredText} from 'src/cm/components/styles/common-components/colors'

import {cl} from 'src/cm/lib/methods/common'
import {breakLines} from 'src/cm/lib/value-handler'

import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'

export const SelectOption = (props: {contexts: contextsType; option: optionType; optionStyle: any}) => {
  const contexts = props.contexts

  const {option, optionStyle} = props
  const {filteredOptions, handleOptionClick} = contexts.MySelectContextValue
  const {currentValue} = contexts.controlContextValue
  const {rootPath} = useGlobal()

  const tabitakuColor = `shadow-none border-[1px] bg-primary-light border-primary-main `

  const label = option?.['label'] ?? '指定しない'
  const unselect = !option['label']
  const isActiveOption = option?.id === currentValue

  if (typeof label === `object`) return <></>
  return (
    <span
      // type="button"
      id={`option-${option.id}`}
      onClick={() => {
        setTimeout(async () => {
          await handleOptionClick(option, filteredOptions)
        }, 50)
      }}
      className={'onHover '}
    >
      <ColoredText
        style={{maxWidth: `80vw`, ...optionStyle}}
        bgColor={option.color ?? '#d1d1d1'}
        className={cl(
          unselect ? 'bg-sub-main text-white' : '',
          isActiveOption ? '!bg-sub-main  !text-white   ' : '',
          rootPath === 'estimate' ? tabitakuColor : ''
        )}
      >
        {breakLines(label)}
      </ColoredText>
    </span>
  )
}
