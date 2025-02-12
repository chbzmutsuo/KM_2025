import React, {useEffect} from 'react'
import {DH} from 'src/cm/class/DH'
import {anyObject} from '@cm/types/types'
import {ControlContextType} from '@cm/types/form-control-type'
const MyInput = React.forwardRef((props: {controlContextValue: ControlContextType}, ref) => {
  const {latestFormData, col, ReactHookForm, formProps, Register, currentValue, liftUpNewValueOnChange, field, ControlStyle} =
    props.controlContextValue as ControlContextType
  useEffect(() => {
    if (currentValue) {
      ReactHookForm.setValue(col.id, currentValue)
    }
  }, [])

  const convertedType = DH.switchColType({type: col.type})

  const step = col.inputProps?.step ?? (col.type === 'float' ? '0.1' : '')

  const style = {...ControlStyle}

  const datalistId = `${col.id}-dataList`

  const DataList = () => {
    if (col?.inputProps?.datalist) {
      return (
        <datalist id={datalistId}>
          {col?.inputProps?.datalist?.map((item: anyObject) => {
            return <option key={item.value} value={item.value} />
          })}
        </datalist>
      )
    }
    return null
  }

  return (
    <>
      <input
        {...col?.inputProps}
        list={datalistId}
        placeholder={col.form?.placerHolder}
        step={step}
        control={ReactHookForm.control}
        type={convertedType}
        style={style}
        className={formProps.className}
        {...{
          ...Register,
          onChange: e => {
            liftUpNewValueOnChange({id: col.id, newValue: e.target.value, ReactHookForm})
          },
          onBlur: field?.onBlur,
        }}
      />
      <DataList />
    </>
  )
})

export default MyInput
