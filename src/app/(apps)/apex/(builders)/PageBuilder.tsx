'use client'

import {DetailPagePropType} from '@cm/types/types'

import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {R_Stack} from '@components/styles/common-components/common-components'
import Accordion from '@components/utils/Accordions/Accordion'

export class PageBuilder {
  static foo = {
    form: (props: DetailPagePropType) => {
      return (
        <R_Stack className={`max-w-xl items-stretch`}>
          <div className={`w-full`}>
            <Accordion {...{label: `基本情報`, defaultOpen: true, closable: true}}>
              <MyForm {...{...props}} />
            </Accordion>
          </div>
        </R_Stack>
      )
    },
  }
}
