import {cl, funcOrVar, ObjectMap} from 'src/cm/lib/methods/common'
import {isMultiItem, parseMultiId} from 'src/cm/lib/methods/multipleItemLib'
import {useForm, UseFormReturn, useWatch} from 'react-hook-form'
import {formPropType} from '@cm/types/form-control-type'
import {colType} from '@cm/types/types'
import {DH} from 'src/cm/class/DH'
import {controlDefaultStyle} from '@constants/defaults'

export const initColumns = props => {
  const {autoApplyProps} = props
  const columns = props.columns

  if (autoApplyProps) {
    columns?.flat()?.map(col => {
      if (!col.form) {
        col.form = autoApplyProps?.form
      }

      return col
    })
  }
  return columns
}

export const getLatestFormData = ({formData, ReactHookForm}) => {
  const {control} = ReactHookForm as UseFormReturn
  const latestFormData = {
    ...formData,
    ...useWatch({control}),
  }

  // Object.keys(latestFormData).forEach(key => {
  //   if (latestFormData[key] === null) {
  //     delete latestFormData[key]
  //   }
  // })

  return latestFormData
}

export const makeDefaultValues = ({columns, formData}) => {
  let columnObject = {}
  const defaultValues = Object.fromEntries(
    columns.flat().map((col: colType) => {
      const key = col.id

      if (DH.switchColType({type: col.type}) === `boolean`) {
        const value = formData?.[key] === `on` ? true : formData?.[key] === `off` ? false : formData?.[key]
        return [key, value]
      }

      if (isMultiItem(key)) {
        const {model, idx, colId} = parseMultiId(key)
        const value = formData?.[model]?.[idx]?.[colId]
        return [key, value]
      } else {
        const alreadyRegisteredFormData = formData?.[key]

        const defaultValue = funcOrVar(col?.form?.defaultValue, alreadyRegisteredFormData, formData, col)

        const value = alreadyRegisteredFormData ?? defaultValue

        /**columnObjectnについか */
        if (col?.form) {
          columnObject = {...columnObject, [col.id]: col}
        }

        return [key, value]
      }
    })
  )

  defaultValues['id'] = formData?.id
  ObjectMap(defaultValues, (key, value) => {
    if (value === 'true' || value === 'false') {
      defaultValues[key] = value === 'true' ? true : false
    }
  })
  defaultValues[`password`] ? (defaultValues[`password`] = undefined) : undefined

  return {defaultValues, columnObject}
}

export const useFormValues = () => {
  const {getValues} = useForm()

  return {
    ...useWatch(), // subscribe to form value updates
    ...getValues(), // always merge with latest form values
  }
}

// export const Register = () => {}

export const getStyleProps = ({ControlOptions, col}) => {
  const isBooleanType = judgeBooleanType({col})

  const {controlWrapperClassBuilder} = ControlOptions ?? {}

  const flexDirection = getFlexDirection(ControlOptions, isBooleanType)
  const wrapperClass = getWrapperClass(controlWrapperClassBuilder, col, ControlOptions)
  const id = `controlWrapper-${col.id}`

  const ControlStyle = {
    ...(isBooleanType ? {} : controlDefaultStyle),
    ...ControlOptions?.ControlStyle,
    ...col?.form?.style,
    ...(isBooleanType ? {width: `100%`} : {}),
  }

  return {id, flexDirection, wrapperClass, ControlStyle, isBooleanType}

  function getFlexDirection(ControlOptions, isBooleanType) {
    const {direction = 'vertical'} = ControlOptions ?? {}
    let flexDirection = 'items-center gap-1 mb-0.5  '
    if (direction === 'horizontal' || isBooleanType) {
      flexDirection = cl(flexDirection, `row-stack  flex-nowrap   `)
    } else {
      flexDirection = cl(flexDirection, `col-stack   items-stretch `)
    }
    return flexDirection
  }

  function getWrapperClass(controlWrapperClassBuilder, col, ControlOptions) {
    const fullWidth = ControlOptions?.direction === 'horizontal' ? '' : 'w-full'
    const controlWrapperClassBuilderClass = controlWrapperClassBuilder ? controlWrapperClassBuilder({col}) : ''

    return cl(fullWidth, controlWrapperClassBuilderClass)
  }

  function judgeBooleanType({col}) {
    const isBooleanType = ['boolean', 'confirm'].includes(col?.type ?? '')

    return isBooleanType
  }
}

export const getFormProps = ({ControlOptions, isBooleanType, Register, col, errorMessage, currentValue}) => {
  const defaultControlClassName = 'myFormControl  text-[16px]'
  const {controllClassName} = ControlOptions

  const normalInputClass = cl(controllClassName ? controllClassName : defaultControlClassName)

  const formProps: formPropType = {
    className: cl(
      // Register?.disabled ? 'disabled bg-gray-300' : '',
      isBooleanType ? '' : normalInputClass,
      ControlOptions?.shownButDisabled ? ' disabled bg-gray-300' : '',
      errorMessage ? `errorFormControl` : '',
      currentValue ? '' : 'empty'
    ),
    type: col?.type ?? '',
  }
  formProps['type'] === 'price' && (formProps['type'] = 'number')

  return formProps
}

export const showResetBtn = ({col, isBooleanType, Register, currentValue, ControlOptions}) => {
  return Boolean(
    currentValue &&
      !isBooleanType &&
      col.type !== 'file' &&
      Register?.disabled !== true &&
      col.type !== 'rating' &&
      col.type !== 'textarea' &&
      !ControlOptions.shownButDisabled &&
      ControlOptions?.showResetBtn !== false &&
      col.form?.showResetBtn !== false
  )
}
