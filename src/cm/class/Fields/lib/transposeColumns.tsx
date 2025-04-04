'use client'
import {DH} from 'src/cm/class/DH'

import {anyObject, colType, colTypeStr} from '@cm/types/types'
import {ColorBlock} from 'src/cm/components/styles/common-components/colors'
import {NestHandler} from 'src/cm/class/NestHandler'

import {transposeColumnsOptionProps} from 'src/cm/class/Fields/col-operator-types'

import ContentPlayer from 'src/cm/components/utils/ContentPlayer'
import {judgeColType} from 'src/cm/class/Fields/lib/methods'
import {defaultFormat} from 'src/cm/class/Fields/lib/defaultFormat'
import {formatDate} from '@class/Days'
import {MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'

export const transposeColumns = (columns: colType[], transposeColumnsOptions?: transposeColumnsOptionProps) => {
  const {autoSplit} = transposeColumnsOptions ?? {}

  columns = columns.map((col: colType, originalColIdx: number) => {
    const type = judgeColType(col) as colTypeStr
    col = {...col, originalColIdx, type: type}

    if (col.format === undefined) {
      // 色選択の場合
      if (col.type === 'color') {
        col.format = (value, row) => <ColorBlock bgColor={value} style={{height: 20, width: 20, ...col?.td?.style}}></ColorBlock>
        DH.makeObjectOriginIfUndefined(col, 'td', {
          ...col.td,
          style: {width: 30, ...col.td?.style},
        })
      }

      if (col.type === `date`) {
        if (col?.td?.hidden !== false) {
          col.td = {...col.td, style: {minWidth: 120, ...col.td?.style}}
        }
      }
      if (col.type === `datetime`) {
        col.format = (value, row, col) => <MarkDownDisplay>{formatDate(value, `YYYY/MM/DD(ddd) HH:mm`)}</MarkDownDisplay>
      }

      if (col.type === 'textarea') {
        col.td = {...col.td}
      }

      if (col.type === 'file') {
        col.format = (value, row, col) => (
          <div className={`w-fit py-[2px]`}>
            <ContentPlayer
              styles={{
                main: {...col?.form?.style},
                thumbnail: {...col?.td?.style},
              }}
              src={row[col.id]}
            />
          </div>
        )
      }

      if (col.forSelect) {
        col.form = {...col.form}
        col.format = defaultFormat
      }

      if (String(col.id).includes('.')) {
        col.format = (value, row) => {
          const unnest = NestHandler.GetNestedValue(col.id, row)

          return <div>{unnest} </div>
        }
      }
    }

    return col
  })

  const autoSplited = getAutoSplit({autoSplit, columns})

  const result = autoSplited as unknown as colType[][]

  return result
}

const getAutoSplit = ({autoSplit, columns}) => {
  /**auto split の場合は、一つ図指定しなくても、ここでrowIdxやcolIdxを作ってくれる */
  let tableRowIdxAcc = 0
  let formRowIdxAcc = 0
  if (autoSplit) {
    columns = columns.map((col: colType, i) => {
      if (autoSplit?.table && col?.th?.hidden !== false) {
        const idx = autoSplit?.table ? (tableRowIdxAcc % autoSplit?.table) + 1 : undefined
        if (!col?.td?.hidden) {
          col = DH.makeObjectOriginIfUndefined(col, 'td', {}) as unknown as colType & {
            td: anyObject
          }
          if (col.td) {
            col['td']['rowIndex'] = idx
          }
        }

        const isDivider = col?.th?.divider
        if (!isDivider) {
          const addRowCount = col.td?.rowSpan ?? 1
          tableRowIdxAcc += addRowCount
        }
      }

      if (autoSplit?.form && col.form) {
        const idx = autoSplit?.form ? Math.floor(formRowIdxAcc / autoSplit?.form) + 1 : undefined
        if (col?.form && col.th?.divider === undefined) {
          DH.makeObjectOriginIfUndefined(col, 'form', {})
          col.form['colIndex'] = idx
        }

        const isDivider = col?.th?.divider
        if (!isDivider) {
          formRowIdxAcc += 1
        }
      }
      return {...col}
    })
  }

  /**指定 または autoSplitで作れたidxでテーブル形成 */
  const newColumns = {}
  columns.map((obj, i) => {
    const rowIndex = obj?.td?.rowIndex ?? 'undefined'
    if (rowIndex) {
      DH.makeObjectOriginIfUndefined(newColumns, rowIndex, [])
      newColumns[rowIndex].push(obj)
    }
  })

  const autoSplitted: colType[] = Object.keys(newColumns).map(rowIndex => {
    const row = newColumns[rowIndex]
    return row
  })
  return autoSplitted
}
