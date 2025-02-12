import {R_Stack} from '@components/styles/common-components/common-components'
import EmptyPlaceholder from '@components/utils/loader/EmptyPlaceHolder'
import {ReactNode} from 'react'
import {props, styling} from 'src/cm/components/styles/common-components/type'
import {cl} from 'src/cm/lib/methods/common'

const getStyles = styling => {
  const {wrapper, label, value} = styling?.styles ?? {}
  return {wrapper, label, value}
}
const getClasses = styling => {
  const {
    wrapper = `p-1 px-2 leading-4 col-stack gap-0.5`,
    label = `text-[.75rem]  text-gray-400`,
    value = ``,
  } = styling?.classes ?? {}
  return {wrapper, label, value}
}

const spread = (styling, key: `label` | `value` | `wrapper`) => {
  return {
    style: getStyles(styling)[key],
    className: getClasses(styling)[key],
  }
}

export const LabelValue = (props: props & {label: any; value?: any; styling?: styling; children?: any}) => {
  const {styling, label, value, className, style, children, ...rest} = props

  return (
    <div
      style={spread(styling, `wrapper`).style}
      className={cl(`row-stack  flex-nowrap items-center gap-1 `, spread(styling, `wrapper`).className)}
      {...rest}
    >
      <dt {...spread(styling, `label`)}>
        <>
          <span>
            <span>{label}</span>
          </span>
          <span className={!label ? 'opacity-0' : ''}>:</span>
        </>
      </dt>

      <dd {...spread(styling, `value`)}>
        <span>{value || children}</span>
      </dd>
    </div>
  )
}
export const ParameterCard = (props: {label: any; value: any; styling?: styling; children?: any}) => {
  const {label, value, children, styling} = props

  return (
    <div className={`relative w-fit border-[.0313rem] shadow-md`}>
      <div className={`border-primary-main  absolute left-0 h-full border-l-[.25rem]`} style={{minWidth: 5}}></div>
      <div style={getStyles(styling).wrapper} className={getClasses(styling).wrapper}>
        <div style={getStyles(styling).label} className={getClasses(styling).label}>
          {label}
        </div>
        <div style={getStyles(styling).value} className={getClasses(styling).value}>
          {value || children}
        </div>
      </div>
    </div>
  )
}

export const KeyValue = (props: {label: string; children?: ReactNode}) => {
  return (
    <R_Stack className={`gap-[2px] `}>
      {props.label && <small>{props.label}:</small>}
      {props.children ? (
        <span className={`text-sm`}>{props.children}</span>
      ) : (
        <EmptyPlaceholder className={`text-orange-500`}>-</EmptyPlaceholder>
      )}
    </R_Stack>
  )
}
