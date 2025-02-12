'use client'

import {colType, colTypeOptional} from '@cm/types/types'
import {aggregateOnSingleTd, aggregateOnSingleTdProps} from 'src/cm/class/Fields/lib/aggregateOnSingleTd'
import {addColIndexs} from 'src/cm/class/Fields/lib/addColIndex'
import {setAttribute} from 'src/cm/class/Fields/lib/setAttribute'
import {transposeColumns} from 'src/cm/class/Fields/lib/transposeColumns'
import {TableInfo, TableInfoWrapper} from '@class/builders/ColBuilderVariables'
import {NestHandler} from '@class/NestHandler'

import {DH} from '@class/DH'

export const defaultSelect = {id: true, name: true}
export const masterDataSelect = {...defaultSelect, color: true}

type freeColType = Exclude<colTypeOptional, 'id' | 'label'>
export type setterType = (props: {col: colType}) => freeColType
export class Fields {
  plain: colType[]
  constructor(array: colType[]) {
    this.plain = array
  }

  setTdMinWidth = ({minWidth, maxWidth = undefined}) => {
    return this.customAttributes(({col}) => {
      return {
        ...col,
        td: {...col?.td, style: {minWidth, maxWidth}},
      }
    })
  }

  showSummaryInTd = (
    props: {
      wrapperLabel?: any
      wrapperWidthPx?: number
      labelWidthPx?: number
      hideUndefinedValue?: boolean
      showShadow?: boolean
      convertColId?: {[key: string]: string}
    } & colTypeOptional
  ) => {
    const columns = this.plain

    const {hideUndefinedValue = false, wrapperWidthPx = 200, labelWidthPx = 80, showShadow = false} = props
    const id = `readOnly_${columns.map(d => d.id).join('_')}`

    return new Fields([
      {
        id: id,
        label: ``,
        form: {hidden: true},
        td: {withLabel: false},
        format: (value, row, col) => {
          const existingValues: any[] = []
          const undefinedLabels: any[] = []
          columns
            .map(col => {
              if (col.format) {
                return {
                  label: col.label,
                  value: col.format(value, row, col),
                }
              } else {
                const pseudoId = props.convertColId?.[col.id] ?? col.id
                let value = NestHandler.GetNestedValue(pseudoId, row)

                value = DH.convertDataType(value, col.type, `client`)
                if (col.type === `price`) {
                  value = DH.toPrice(value)
                }

                if (col.type === `password`) {
                  value = '********'
                }

                return {label: col.label, value: value}
              }
            })
            .forEach(col => {
              if (hideUndefinedValue === false) {
                existingValues.push(col)
              } else {
                if (col.value) {
                  existingValues.push(col)
                } else {
                  undefinedLabels.push(col)
                }
              }
            })

          return (
            <TableInfoWrapper {...{showShadow, label: props.wrapperLabel ?? ''}}>
              {existingValues.map((d, i) => {
                const {value, label} = d

                return (
                  <div key={i}>
                    {hideUndefinedValue === true && !value ? null : (
                      <div className={`border-b border-dashed py-0.5`}>
                        <TableInfo {...{label, value, wrapperWidthPx, labelWidthPx}} />
                      </div>
                    )}
                  </div>
                )
              })}

              {hideUndefinedValue && undefinedLabels.length > 0 && (
                <div className={`mt-1 `}>
                  <small>
                    <TableInfo
                      {...{
                        label: `データ無`,
                        value: <div className={`text-xs opacity-50`}>{undefinedLabels.map(d => d.label).join(`, `)}</div>,
                        wrapperWidthPx,
                        labelWidthPx,
                      }}
                    />
                  </small>
                </div>
              )}
            </TableInfoWrapper>
          )
        },
      },

      ...new Fields(columns).customAttributes(({col}) => ({...col, td: {hidden: true}})).plain,
    ])
  }

  customAttributes = (
    setter: setterType,
    options?: {
      include?: string[]
      exclude?: string[]
    }
  ) => {
    const cols = this.plain

    const defaultInclude = (cols ?? []).map(col => col.id)
    const {include = defaultInclude, exclude} = options ?? {}

    const result = [...cols].map(col => {
      let isTarget: boolean | undefined = undefined

      const isInInclude = include?.includes(col.id)
      const isInExclude = exclude?.includes(col.id)

      if (isInExclude) {
        isTarget = false
      } else if (isInInclude) {
        isTarget = true
      }

      if (isTarget) {
        const newCol = {...col, ...setter({col})}

        // OB.foo(col, newCol)

        return newCol
      } else {
        return col
      }
    })

    this.plain = result
    return new Fields(result)
  }

  setNormalTd = () => {
    return this.customAttributes(({col}) => {
      const withLabel = !col?.td?.withLabel
      return {...col, td: {...col.td, withLabel}}
    })
  }

  aggregateOnSingleTd = (props?: aggregateOnSingleTdProps & {cols?: any}) => {
    const result = aggregateOnSingleTd({...props, cols: this.plain})
    this.plain = result
    return new Fields(result)
  }

  buildFormGroup = ({groupName}) => {
    return this.customAttributes(({col}) => {
      return {...col, form: {...col.form, colIndex: groupName}}
    })
  }

  transposeColumns = () => {
    const cols = this.plain
    return transposeColumns(cols)
  }

  static transposeColumns = transposeColumns
  static mod = {aggregateOnSingleTd, addColIndexs, setAttribute}

  static doShowLabel = (col: colType) => col?.td?.withLabel === true
}
