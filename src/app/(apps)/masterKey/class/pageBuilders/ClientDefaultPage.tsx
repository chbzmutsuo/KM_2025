'use client'

import {ColBuilder} from '@app/(apps)/masterKey/class/ColBuilder'
import useMasterkeyDisplayedContents from '@app/(apps)/masterKey/lib/useMasterkeyDisplayedContents'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import { R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
import GlobalAccordion from '@components/utils/Accordions/GlobalAccordion'

export const ClientDefaultPage = (props: DetailPagePropType) => {
  const {displayedContents, checkIsActive} = useMasterkeyDisplayedContents()
  const clientData = props.formData

  return (
    <R_Stack className={`mx-auto  items-stretch`}>
      <div className={`w-full`}></div>

      {checkIsActive(`masterKeyApplicant`) && (
        <Paper className={`w-full rounded-lg`}>
          <GlobalAccordion
            {...{
              id: `${clientData?.id}-applicant-accordion`,
              label: `応募者`,
              defaultOpen: true,
              closable: true,
            }}
          >
            <div className={` border-primary-main  overflow-auto rounded-lg border-4 border-double p-1 shadow`}>
              <R_Stack className={` mr-auto w-full justify-start`}>
                <ChildCreator
                  {...{
                    myTable: {style: {width: 1500, maxWidth: `100%`}},
                    ParentData: clientData ?? {},
                    models: {parent: `masterKeyClient`, children: `masterKeyApplicant`},
                    columns: ColBuilder.masterKeyApplicant(props),
                    useGlobalProps: props.useGlobalProps,
                  }}
                />
              </R_Stack>
            </div>
          </GlobalAccordion>
        </Paper>
      )}

      {checkIsActive(`masterKeyJob`) && (
        <Paper className={`w-full rounded-lg`}>
          <GlobalAccordion
            {...{
              id: `${clientData?.id}-job-accordion`,
              label: `求人`,
              defaultOpen: true,
              closable: true,
            }}
          >
            <div className={` border-primary-main  overflow-auto border-4 border-double p-1 shadow`}>
              <R_Stack className={` mr-auto w-full justify-start`}>
                <ChildCreator
                  {...{
                    myTable: {style: {width: 1500, maxWidth: `100%`}},
                    ParentData: clientData ?? {},
                    models: {parent: `masterKeyClient`, children: `masterKeyJob`},
                    columns: ColBuilder.masterKeyJob(props),
                    useGlobalProps: props?.useGlobalProps,
                  }}
                />
              </R_Stack>
            </div>
          </GlobalAccordion>
        </Paper>
      )}
    </R_Stack>
  )
}
