'use client'
import React from 'react'

import {myFormDefault, myModalDefault, myTableDefault} from 'src/cm/constants/defaults'

import {ClientPropsType2} from 'src/cm/components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import BasicModal from '@components/utils/modal/BasicModal'
import MyTable from '@components/DataLogic/TFs/MyTable/MyTable'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'

const TableForm = (props: ClientPropsType2) => {
  const ClientProps2 = convertProps(props)
  const {EditForm, myForm, myModal, setformData} = props

  return (
    <div>
      <MyTable {...{ClientProps2}} />
      <BasicModal
        {...{
          alertOnClose: true,
          style: {padding: `10px 10px`, background: `#fff`, ...myModal?.style},
          open: props.formData,
          handleClose: () => setformData?.(null),
        }}
      >
        <div id={`editFormOnMyDataViwer`}>
          {myForm?.caption}
          {EditForm ? <EditForm {...ClientProps2} /> : <MyForm {...ClientProps2} />}
        </div>
      </BasicModal>
    </div>
  )
}
export default TableForm

const convertProps = props => {
  props = {
    ...props,
    myForm: {...myFormDefault, ...props.myForm, style: {...myFormDefault?.style, ...props.myForm?.style}},
    myTable: {...myTableDefault, ...props.myTable, style: {...myTableDefault?.style, ...props.myTable?.style}},
    myModal: {...myModalDefault, ...props.myModal},
  }
  return props
}
