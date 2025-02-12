'use client'

import {cl} from 'src/cm/lib/methods/common'

import {useEffect, useState} from 'react'
import MyForm from 'src/cm/components/DataLogic/TFs/MyForm/MyForm'

import {Alert} from 'src/cm/components/styles/common-components/Alert'

import {ClientPropsType2} from 'src/cm/components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import {prismaDataType} from '@cm/types/types'

const DetailedPageCC = (props: {ClientProps2: ClientPropsType2; prismaData: prismaDataType}) => {
  const ClientProps2 = props.ClientProps2
  const {myForm, EditForm, dataModelName} = ClientProps2
  const {prismaData} = props

  const modelData = prismaData?.records[0]
  if (!modelData) return <div>このページは存在しません</div>

  const [formData, setformData] = useState(modelData)

  useEffect(() => {
    if (modelData) {
      setformData(modelData)
    }
  }, [modelData])

  ClientProps2.formData = modelData
  ClientProps2.setformData = setformData

  const hasMultipleItemError = prismaData?.records?.length > 1

  return (
    <div className={cl(`mx-auto w-fit p-1.5`)}>
      {hasMultipleItemError && <Alert>データが2件以上あります</Alert>}
      {/* //paperはつけない */}
      <>
        <div className={`p-0.5`} id={`${dataModelName}-formMemo-${EditForm ? 'Custom' : 'Normal'}`}>
          {myForm?.caption}
          {EditForm ? <EditForm {...{...ClientProps2, prismaData}} /> : <MyForm {...{...ClientProps2, prismaData}} />}
        </div>
      </>
    </div>
  )
}

export default DetailedPageCC
