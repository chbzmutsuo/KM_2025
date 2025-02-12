'use client'

import {tbmBase} from '@app/(apps)/tbm/(builders)/PageBuilders/tbmBase'
import {tbmOperationGroup} from '@app/(apps)/tbm/(builders)/PageBuilders/tbmOperationGroup/tbmOperationGroup'

const Title = ({children}) => {
  return (
    <div className={`mb-[10px]`}>
      <strong>{children}</strong>
    </div>
  )
}

export class PageBuilder {
  static tbmBase = tbmBase
  static tbmOperationGroup = tbmOperationGroup
  // static tbmRouteGroup = {
  //   form: (props: DetailPagePropType) => {
  //     return (
  //       <R_Stack className={` flex-nowrap items-stretch gap-4`}>
  //         <Accordion {...{label: `基本情報`, defaultOpen: true, closable: false}}>
  //           <MyForm {...{...props}} />
  //         </Accordion>

  //         <Accordion {...{label: `ルート`, defaultOpen: true, closable: false}}>
  //           <ChildCreator
  //             {...{
  //               ParentData: props.formData ?? {},
  //               models: {
  //                 parent: props.dataModelName,
  //                 children: `tbmRouteGroup`,
  //               },
  //               columns: ColBuilder.tbmRouteGroup(props),
  //               useGlobalProps: props.useGlobalProps,
  //             }}
  //           />
  //         </Accordion>
  //       </R_Stack>
  //     )
  //   },
  // }
}
