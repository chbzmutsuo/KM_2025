import {rules} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {CssString} from '@components/styles/cssString'

export const WorkRules = (props: {rules: rules}) => {
  const {rules} = props
  return (
    <TableWrapper
      className={`w- mx-auto max-h-[70vh] border-none border-opacity-0 text-center  shadow-sm [&_td]:!min-w-[70px] ${CssString.table.paddingTd}`}
    >
      <TableBordered>
        {CsvTable({
          headerRecords: [
            {
              csvTableRow: [
                //
                `就業開始`,
                `休憩時間`,
                `就業終了`,
                `固定残業`,
                `所定労働時間`,
              ].map(d => ({cellValue: d})),
            },
          ],
          bodyRecords: [
            {
              csvTableRow: [
                //
                rules.work.startTime,
                rules.breakMin,
                rules.work.endTime,
                rules.fixedOvertime,
                rules.workHours,
              ].map(d => ({
                cellValue: d,
              })),
            },
          ],
          stylesInColumns: {},
        }).ALL()}
      </TableBordered>
    </TableWrapper>
  )
}
