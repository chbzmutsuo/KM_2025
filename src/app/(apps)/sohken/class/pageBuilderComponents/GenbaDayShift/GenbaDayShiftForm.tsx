'use client'

import MyAccordion from '@components/utils/Accordions/MyAccordion'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'

import {DetailPagePropType} from '@cm/types/types'
import {R_Stack} from '@components/styles/common-components/common-components'

export const GenbaDayShiftForm = (props: DetailPagePropType) => {
  const genbaDay = props.formData ?? {}
  const {useGlobalProps} = props
  return (
    <R_Stack className={`items-start`}>
      <MyAccordion {...{label: `現場・日付`, defaultOpen: true, closable: false}}>
        <MyForm {...props} />
      </MyAccordion>
    </R_Stack>
  )
}
