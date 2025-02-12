import {DH} from 'src/cm/class/DH'
import {MinusIcon} from '@heroicons/react/20/solid'
import {showResetBtn} from '@hooks/useBasicForm/hookformMethods'
import {useCallback} from 'react'

export const useResetBtn = ({col, field, useResetValue, isBooleanType, Register, currentValue, ControlOptions}) => {
  const convertedType = DH.switchColType({type: col.type})
  let nullvalue
  switch (convertedType) {
    case 'text':
    case 'color':
    case 'time': {
      nullvalue = ''
      break
    }

    default: {
      nullvalue = null
      break
    }
  }

  const ResetBtnCallBack = useCallback(() => {
    return (
      <>
        {showResetBtn({col, isBooleanType, Register, currentValue, ControlOptions}) && !ControlOptions.shownButDisabled && (
          <div
            onClick={() => {
              useResetValue({col, field})
            }}
          >
            <MinusIcon className={`  h-4   text-gray-400   hover:cursor-pointer`}></MinusIcon>
          </div>
        )}
      </>
    )
  }, [col, isBooleanType, Register, currentValue, ControlOptions, useResetValue, field])

  return {ResetBtnCallBack}
}
export default useResetBtn
