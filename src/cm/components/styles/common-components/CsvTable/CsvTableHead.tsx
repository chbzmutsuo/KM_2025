import {CsvTableProps} from '@components/styles/common-components/CsvTable/CsvTable'
import {Counter} from '@components/styles/common-components/Table'
import {MarkDownDisplay} from '@components/utils/texts/MarkdownDisplay'
import {cl} from '@lib/methods/common'

export function CsvTableHead(props: CsvTableProps) {
  const hasHeader = props.headerRecords?.some(d => d.csvTableRow.some(cell => cell.cellValue))

  if (hasHeader === false) {
    return null
  }

  return (
    <thead>
      {props.headerRecords?.map((row, rowIdx) => {
        const {csvTableRow, ...restPropsOnTr} = row

        return (
          <tr key={rowIdx} {...restPropsOnTr} className={cl(restPropsOnTr?.className)}>
            {csvTableRow.map((cell, celIdx) => {
              const stylesInThisColumn = props?.stylesInColumns?.[celIdx]

              const {cellValue, style, className, ...restPropsOnTd} = cell ?? {}

              const isNumber = typeof cellValue === 'number'
              const isString = typeof cellValue === 'string'

              if (cell?.colSpan === 0) {
                return null
              }

              return (
                <th
                  key={celIdx}
                  {...restPropsOnTd}
                  {...{
                    style: {...stylesInThisColumn?.style, ...style},
                    className: cl(stylesInThisColumn?.className, className),
                  }}
                >
                  {isNumber ? (
                    <Counter>{cellValue}</Counter>
                  ) : isString ? (
                    <MarkDownDisplay>{cellValue}</MarkDownDisplay>
                  ) : (
                    cellValue
                  )}
                </th>
              )
            })}
          </tr>
        )
      })}
    </thead>
  )
}
