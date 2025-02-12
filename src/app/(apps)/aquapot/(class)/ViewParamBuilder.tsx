'use client'

import {ViewParamBuilderProps} from '@components/DataLogic/TFs/PropAdjustor/usePropAdjustorProps'

export class ViewParamBuilder {
  static aqCustomer: ViewParamBuilderProps = props => {
    const {router} = props.ClientProps2.useGlobalProps
    return {
      myForm: {
        create: {
          finalizeUpdate: props => {
            if (confirm(`そのまま個別ページに移動しますか？`)) {
              router.push(`/aquapot/aqCustomer/${props.res.result.id}`)
            }

            return props.res
          },
        },
      },
    }
  }
}
