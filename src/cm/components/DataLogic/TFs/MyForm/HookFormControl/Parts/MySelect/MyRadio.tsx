import useInitMySelect from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/useInitMySelect'
import {Button} from 'src/cm/components/styles/common-components/Button'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {getColorStyles} from 'src/cm/lib/methods/common'
import React from 'react'

export default function MyRadio(props) {
  const {contexts} = useInitMySelect(props)
  const {MySelectContextValue, controlContextValue} = contexts

  return (
    <R_Stack className={`  justify-start gap-1.5 pb-1`}>
      {MySelectContextValue.options.map((op, i) => {
        const isActive = op.id === controlContextValue.currentValue

        return (
          <div key={i}>
            <Button
              type={`button`}
              className={`rounded text-[14px]`}
              onClick={() => {
                controlContextValue.ReactHookForm.setValue(controlContextValue.col.id, op.id)
                controlContextValue.field.onBlur()
              }}
              active={isActive}
              style={{...getColorStyles(op.color ?? `#202020`)}}
            >
              {op.label}
            </Button>
          </div>
        )
      })}
    </R_Stack>
  )
}
