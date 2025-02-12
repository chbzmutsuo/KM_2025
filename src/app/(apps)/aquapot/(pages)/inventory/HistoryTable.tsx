'use client'

import {formatDate} from '@class/Days'

import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'

export const HistoryTable = ({history}) => {
  return (
    <div>
      {CsvTable({
        headerRecords: [
          {
            csvTableRow: [{cellValue: `日付`}, {cellValue: `商品名`}, {cellValue: `入荷先`}, {cellValue: `数量`}],
          },
        ],
        bodyRecords: history.map((item, idx) => {
          return {
            csvTableRow: [
              //
              {cellValue: formatDate(item[`date`])},
              {cellValue: item?.AqProduct?.name},
              {cellValue: item?.AqCustomer?.name},
              {cellValue: item?.quantity},
            ],
          }
        }),
      }).WithWrapper({size: `lg`})}
    </div>
  )
}
