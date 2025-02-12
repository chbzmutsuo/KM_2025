'use client'
import React, {Fragment} from 'react'

import {ApRequestForm} from '@lib/ApprovementRequest/components/ApRequestForm'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import ApRequestHistory from '@lib/ApprovementRequest/components/ApRequestHistory'
import BasicModal from '@components/utils/modal/BasicModal'
import {Days, formatDate} from '@class/Days'
import {Yoshinari} from '@app/(apps)/yoshinari/class/Yoshinari'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {PlusIcon} from '@heroicons/react/20/solid'
import {Button} from '@components/styles/common-components/Button'
export default function ThidTd(props: {ApRequestTypeMaster; UserCl: YoshinariUserClass; date; isSuperUser}) {
  const {ApRequestTypeMaster, UserCl, date, isSuperUser} = props

  const myApRequest = UserCl.user.myApRequest

  const ApRequestTypeConfigs = Yoshinari.constants().getApRequestTypeConfigs()
  const ApRequestRecordObj = ApRequestTypeMaster.map(ApRequestType => {
    const name = ApRequestType.name
    const requestHistoryList = myApRequest.filter(d => {
      const dateCf = d.cf[`日付`]
      const dateValue = dateCf.value
      return d.ApRequestTypeMaster?.name === name && Days.isSameDate(dateValue, date)
    })

    const latestReuqest = [...requestHistoryList].sort((a: any, b: any) => b.createdAt - a.createdAt)[0]

    return {
      ApRequestType,
      requestHistoryList,
      latestReuqest,
    }
  })

  const applicationTotalCount = ApRequestRecordObj.reduce((acc, cur) => acc + cur.requestHistoryList.length, 0)

  return (
    <div>
      <C_Stack className={`items-start   gap-1`}>
        <BasicModal
          {...{
            alertOnClose: false,
            btnComponent: (
              <R_Stack className={`onHover t-link gap-0.5`}>
                <PlusIcon className={`icon-btn h-5 w-5 rounded-full`} />

                <div>{applicationTotalCount > 0 && <span>({applicationTotalCount})</span>}</div>
              </R_Stack>
            ),
          }}
        >
          <C_Stack className={`mt-4 w-full gap-4`}>
            <strong>{formatDate(date)}</strong>
            {ApRequestRecordObj.map((d, requestRecordIdx) => {
              const Type = d.ApRequestType
              return (
                <Fragment key={requestRecordIdx}>
                  <R_Stack className={`justify-between border-b pb-4`}>
                    <C_Stack>
                      <div>{Type?.name}</div>
                      <small>{Type?.description}</small>
                    </C_Stack>
                    <R_Stack className={`w-[200px]  justify-end`}>
                      <ApRequestHistory
                        {...{
                          approvementTypes: Yoshinari.constants().approvementTypes,
                          withModal: true,
                          ApRequestList: d.requestHistoryList,
                          ApRequestType: d.ApRequestType,
                          ApRequestTypeConfigs,
                          isSuperUser,
                        }}
                      />
                      <BasicModal {...{btnComponent: <Button className={`text-sm`}>起案</Button>}}>
                        <ApRequestForm
                          {...{
                            theApRequest: undefined,
                            defaultDate: date,
                            ApRequestList: d.requestHistoryList,
                            ApRequestType: d.ApRequestType,
                            ApRequestTypeConfigs,
                          }}
                        />
                      </BasicModal>
                    </R_Stack>
                  </R_Stack>
                </Fragment>
              )
            })}
          </C_Stack>
        </BasicModal>
      </C_Stack>
    </div>
  )
}
