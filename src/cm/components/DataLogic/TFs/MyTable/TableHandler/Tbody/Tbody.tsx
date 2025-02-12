import React, {useCallback} from 'react'
import {Fragment} from 'react'

import dynamic from 'next/dynamic'
import {ClientPropsType2} from 'src/cm/components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import {OB} from 'src/cm/class/OB'
import {DnDTableRowPropsType} from 'src/cm/components/DataLogic/TFs/MyTable/DndTableRow'

const DnDTableRow = dynamic(() => import('src/cm/components/DataLogic/TFs/MyTable/DndTableRow'), {})

export type tbodyParamsType = {
  getPaginationProps: any
  RowActionButtonComponent: any
}

const Tbody = React.memo((props: {rows: any[][]; ClientProps2: ClientPropsType2; tbodyRowParams: tbodyParamsType}) => {
  const {ClientProps2, tbodyRowParams, rows} = props

  const DnDTableRowCallbackProps = {
    ...(OB.filter(ClientProps2, [`myTable`, `useGlobalProps`, `formData`, `dataModelName`, `mutateRecords`]) as any),
    SP: ClientProps2.useGlobalProps.device.SP,
    tbodyRowParams,
  }
  const DnDTableRowCb = useCallback(
    ({DnDTableRowProps}) => {
      return <DnDTableRow {...{...DnDTableRowCallbackProps, rows, DnDTableRowProps}} />
    },
    [ClientProps2.records]
  )

  return (
    <tbody>
      {ClientProps2.records?.map((record, recIdx: number) => {
        return (
          <Fragment key={recIdx}>
            {rows?.map((ColumnsOnTheRow, rowIdx) => {
              const DnDTableRowProps: DnDTableRowPropsType = {
                record,
                ColumnsOnTheRow,
                rowIdx,
                recIdx,
                showHeader: ClientProps2.myTable?.showHeader,
              }

              return <DnDTableRowCb key={rowIdx} {...{DnDTableRowProps}} />
            })}
          </Fragment>
        )
      })}
    </tbody>
  )
})

export default Tbody
