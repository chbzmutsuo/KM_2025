import {formatDate} from '@cm/class/Days/date-utils/formatters'
import {Fields} from 'src/cm/class/Fields/Fields'

import {colType, columnGetterType} from '@cm/types/types'
import {Absolute, Vr} from 'src/cm/components/styles/common-components/common-components'

import {LabelValue} from '@cm/components/styles/common-components/ParameterCard'
import {getColorStyles} from '@cm/lib/methods/colors'
import ShadPopover from '@cm/shadcn/components/ShadPopover'
import {MarkDownDisplay} from '@cm/components/utils/texts/MarkdownDisplay'

export const defaultRegister = {register: {required: '必須'}}
export const textAreaDefaultStyle = {width: 600, height: 150}

export const dynamicMasterModel = (props: columnGetterType & {dataModelName: string}) => {
  const col1: colType[] = [
    {id: 'name', label: '名称', type: 'text', form: {register: {required: '必須'}}, td: {style: {minWidth: 100}}},
  ]
  if (String(props?.dataModelName)?.includes(`Master`)) {
    col1.push({id: 'color', label: '色', type: 'color', form: {register: {required: '必須'}}})
  }
  const data: colType[] = col1
  return Fields.transposeColumns(data, {...props.transposeColumnsOptions})
}

export const editableTd = {
  td: {editable: {}},
}

export const dateFormatter = props => {
  const {value, prefix = ``, width = 80} = props
  return (
    <div className={`w-[${width}px]`}>
      <span>{prefix}</span>
      <span className={` inline-block `}>{formatDate(value, `YY/M/D(ddd)`)}</span>
    </div>
  )
}

export const dividerCol = ({label, color}) => {
  return new Fields([
    {
      id: `divider_${label}`,
      label: ``,
      form: {hidden: true},
      format: () => {
        return (
          <Vr
            {...{
              style: {backgroundColor: color},
              className: ` relative h-[150px] w-[5px] `,
            }}
          >
            <Absolute>
              <div className={`py-2`}>
                <div
                  {...{style: {...getColorStyles(color)}}}
                  className={`shadow-xs z-10 rounded  py-2  text-[10px]  font-bold
              `}
                >
                  {label}
                </div>
              </div>
            </Absolute>
          </Vr>
        )
      },
    },
  ]).plain
}

export const TableInfoWrapper = (props: {showShadow?: boolean; label?: any; children: any}) => {
  const {showShadow = true, label, children} = props

  return (
    <div className={showShadow ? `shadow-md p-1.5  rounded-lg bg-white  border border-gray-200` : ``}>
      {label && <small className={`text-sm font-bold  text-gray-900`}>{label}</small>}
      <div>{children}</div>
    </div>
  )
}

export const TableInfo = (props: {label; children?: any; value?: any; labelWidthPx?: number; wrapperWidthPx?: number}) => {
  const {label, children, value, labelWidthPx = 60, wrapperWidthPx = 200} = props

  const valueWidth = wrapperWidthPx - labelWidthPx

  const content = children ?? value

  const typeofContent = typeof content

  const Content = typeofContent === `string` ? <MarkDownDisplay>{content}</MarkDownDisplay> : <div>{content}</div>

  return (
    <LabelValue
      {...{
        label: <div>{label}</div>,
        styling: {
          styles: {
            wrapper: {width: wrapperWidthPx},
            label: {minWidth: labelWidthPx},
          },
          classes: {
            wrapper: `text-sm`,
          },
        },
      }}
    >
      {content ? (
        <ShadPopover
          {...{
            PopoverTrigger: (
              <div className={`relative`}>
                {/* <ZoomIn className={`w-4 h-4 text-gray-600 absolute  -right-0! top-1 `} /> */}
                <div style={{width: wrapperWidthPx - labelWidthPx, maxHeight: 40}} className={` truncate`}>
                  {Content}
                </div>
              </div>
            ),
          }}
        >
          {Content}
        </ShadPopover>
      ) : (
        <div></div>
      )}
    </LabelValue>
  )
}
