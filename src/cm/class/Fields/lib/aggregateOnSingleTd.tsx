'use client'
import {colType, colTypeOptional, dataFormatterType} from '@cm/types/types'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties, Fragment} from 'react'

import TdContent from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/TableCell/childrens/TdContent'
import {Fields} from 'src/cm/class/Fields/Fields'
import {converDataForClient} from 'src/cm/class/Fields/lib/methods'
import {defaultFormat} from 'src/cm/class/Fields/lib/defaultFormat'
import {CssString} from 'src/cm/components/styles/cssString'
const {table, border} = CssString

export type aggregateOnSingleTdProps = {
  mainTd?: {
    id: string
    C_StackClassName?: string
    entireCellFormat?: dataFormatterType
    th?: {
      stack?: any
    }
  } & colTypeOptional

  mainColForceProps?: colType
  subColForceProps?: colTypeOptional
}

export const aggregateOnSingleTd = (
  props: aggregateOnSingleTdProps & {
    cols: colType[] | any[]
  }
) => {
  const {subColForceProps} = props
  const mainTd = props.mainTd ?? props.cols[0]

  const cols = Fields.mod.setAttribute({
    cols: props.cols,
    attributeSetter: ({col}) => {
      const newCol = {
        ...col,
        format: col.format ?? defaultFormat,
      }
      return newCol
    },
  })

  const {C_StackClassName = `items-start justify-start w-full  `} = mainTd

  // // 初期化
  const mainCol = cols.find(col => col.id === mainTd.id) as colType
  Object.keys(mainTd ?? {}).forEach(key => {
    mainCol[key] = mainTd?.[key]
  })

  // subColsにはformを追加し、tdを削除する
  const subCols: colType[] = cols
    .filter(col => col.id !== mainTd.id)
    .map(col => {
      const td = {...col.td, hidden: true}

      col = {...col, td}

      Object.keys(subColForceProps ?? {}).forEach(key => {
        col[key] = subColForceProps?.[key]
      })
      return {...col}
    })

  const allColisHidden = cols.every(col => col.td?.hidden)

  const NewCol = {...mainCol, td: {style: mainTd?.td?.style, getRowColor: mainTd?.td?.getRowColor, hidden: allColisHidden}}
  const thLabels: any[] = []
  const theaderCols = cols.filter(col => !col.td?.hidden)

  NewCol.id = mainTd.id

  NewCol.format = (value, row) => {
    value = value ? converDataForClient(value, NewCol) : '-'

    const EntireCellFormat = props?.mainTd?.entireCellFormat && props?.mainTd?.entireCellFormat(value, row, mainCol)

    if (EntireCellFormat) {
      return EntireCellFormat
    }

    return ({record, dataModelName, mutateRecords, tdStyle, showHeader}) => {
      return (
        <Fragment>
          <C_Stack className={cl(`stretching-in-td  justify-start gap-0  leading-[16px]`, C_StackClassName)}>
            {EntireCellFormat ??
              theaderCols.map((col, i) => {
                if (i === 0) {
                  col.isMain = true //tdの中にlabelをつけるときに二重になるのフラグをつける
                }

                const value = row[col.id] ? converDataForClient(row[col.id], col) : undefined

                const format = col.format ?? defaultFormat
                thLabels.push(col.label)

                const style = {width: '100%', textAlign: 'start'} as CSSProperties

                const className = cl(border.dottedBottom, table.getCellHeight())

                return (
                  <R_Stack key={i} style={style} className={className}>
                    <TdContent
                      {...{
                        showHeader,
                        value: format(value, row, col),
                        dataModelName,
                        col,
                        record,
                        tdStyle,
                        mutateRecords,
                      }}
                    />
                  </R_Stack>
                )
              })}
          </C_Stack>
        </Fragment>
      )
    }
  }

  const Stack = mainTd.th?.stack ?? theaderCols?.length > 3 ? R_Stack : C_Stack

  const thCols = cols.filter(col => col.th?.hidden !== true)

  NewCol.th = {
    format: () => {
      return (
        <Stack className={`mx-auto items-start justify-start gap-0  leading-4`}>
          {thCols.map((col, i) => {
            return (
              <div className={cl(border.dottedBottom, `text-center`)} key={i}>
                {col.label}
              </div>
            )
          })}
        </Stack>
      )
    },
  }

  const result = [NewCol, ...subCols]

  return result as (colType & colTypeOptional)[]
}
