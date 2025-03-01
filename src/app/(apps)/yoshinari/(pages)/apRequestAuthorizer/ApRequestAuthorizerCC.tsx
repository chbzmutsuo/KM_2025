'use client'
import React from 'react'
//classを切り替える

import ApRequestHistory from '@lib/ApprovementRequest/components/ApRequestHistory'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {apRequestStatusList} from '@class/ApRequestClass/ApRequestClass'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Button} from '@components/styles/common-components/Button'
import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'

export default function ApRequestAuthorizerCC({apRequest, ApRequestType, ApRequestTypeConfigs, isSuperUser}) {
  const {addQuery, query} = useGlobal()

  const {data: apRequestGroupByStatus} = usefetchUniversalAPI_SWR(`apRequest`, `groupBy`, {
    by: [`status`],
    _count: {status: true},
  } as Prisma.ApRequestGroupByArgs)

  return (
    <div className={` p-2`}>
      <C_Stack className={` items-center`}>
        <section>
          <R_Stack className={`gap-5`}>
            {apRequestStatusList.map((d, idx) => {
              const {label, color} = d
              const active = query[`status`] === label

              const count = apRequestGroupByStatus?.find(d => d.status === label)?._count?.status ?? 0

              return (
                <Button
                  key={idx}
                  {...{
                    className: `w-[110px] px-0.5 rounded
                    ${count ? '' : ''}`,
                    color: color as any,
                    active,
                    onClick: () => {
                      addQuery({status: label})
                    },
                  }}
                >
                  {label}({count})
                </Button>
              )
            })}
          </R_Stack>
        </section>
        <section>
          <C_Stack className={`items-start   gap-[100px]`}>
            {ApRequestType.map(ApRequestType => {
              const allRequestsOnThisType = apRequest.filter(request => request.approvalRequestTypeMasterId === ApRequestType.id)

              const label = `${ApRequestType.name} (${allRequestsOnThisType.length})`

              return (
                <div key={ApRequestType.id}>
                  <strong>{label}</strong>
                  <div className={`min-w-[300px] border-b`}>
                    {allRequestsOnThisType.length > 0 ? (
                      <ApRequestHistory
                        {...{
                          approvementTypes: Yoshinari.constants().approvementTypes,
                          withModal: false,
                          defaultOpen: true,
                          ApRequestList: allRequestsOnThisType,
                          ApRequestType,
                          ApRequestTypeConfigs,
                          isSuperUser,
                        }}
                      />
                    ) : (
                      <small>データがありません。</small>
                    )}
                  </div>
                </div>
              )
            })}
          </C_Stack>
        </section>
      </C_Stack>
    </div>
  )
}
