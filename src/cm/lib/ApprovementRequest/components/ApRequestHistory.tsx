'use client'

import React, {Fragment} from 'react'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {Paper} from '@components/styles/common-components/paper'
import {C_Stack} from '@components/styles/common-components/common-components'
import {CreateApRequestArray} from '@lib/ApprovementRequest/components/CreateApRequestArray'
import useGlobal from '@hooks/globalHooks/useGlobal'
import BasicModal from '@components/utils/modal/BasicModal'
import {ApRequestConfig} from '@lib/ApprovementRequest/apRequest-types'
import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import useModal from '@components/utils/modal/useModal'
import ApprovementForm from '@lib/ApprovementRequest/components/ApprovementForm'

export default function ApRequestHistory(props: {
  defaultOpen?: boolean
  ApRequestList: MappeadApRequest[]
  maxReceiver?: number
  ApRequestType: any
  ApRequestTypeConfigs: ApRequestConfig
  withModal?: boolean
  isSuperUser: boolean
  approvementTypes
}) {
  const {
    Modal: ApprovementFormModal,
    open,
    handleOpen: handleApprovementFormModalOpen,
    handleClose: handleApprovementFormModalClose,
  } = useModal({})

  const {PC, session, accessScopes} = useGlobal()

  const {ApRequestList, ApRequestType, ApRequestTypeConfigs, withModal, isSuperUser = false, approvementTypes} = props

  const {header, body} = CreateApRequestArray({
    approvementTypes,
    ApRequestList,
    ApRequestType,
    ApRequestTypeConfigs,
    handleApprovementFormModalOpen,
    isSuperUser,
  })
  const Main = () => {
    return (
      <div>
        <ApprovementFormModal>
          <ApprovementForm
            {...{
              ApRequestType,
              ApRequestTypeConfigs,
              theApRequest: open.theApRequest,
              theApReceiver: open.theApReceiverr,
              handleApprovementFormModalOpen,
              handleApprovementFormModalClose,
            }}
          />
        </ApprovementFormModal>
        {PC ? (
          <TableWrapper className={`mx-auto w-[90vw] max-w-[1200px]`}>
            <TableBordered>
              <thead>
                <tr>
                  {header.map((th, i) => {
                    return <th key={i}>{th}</th>
                  })}
                </tr>
              </thead>
              <tbody className={`[&_td]:!px-2`}>
                {body.map((row, i) => {
                  const {apRequest, rowArray} = row
                  return (
                    <Fragment key={i}>
                      <tr className={`text-center`}>
                        {rowArray.map((d, j) => {
                          return (
                            <td key={j} className={`text-center`}>
                              {d}
                            </td>
                          )
                        })}
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </TableBordered>
          </TableWrapper>
        ) : (
          <C_Stack className={` mx-auto  items-center gap-4`}>
            {body.map((row, i) => {
              const {apRequest, rowArray} = row
              return (
                <Paper key={i} className={`mx-auto w-[500px] max-w-[85vw]`}>
                  <C_Stack className={`gap-4 `}>
                    {rowArray.map((d, j) => {
                      const label = header[j]
                      return (
                        <div key={j} className={`leading-1 mb-2 `}>
                          <div className={`text-sm font-bold text-gray-600`}>{label}</div>
                          <div>{d}</div>
                        </div>
                      )
                    })}
                  </C_Stack>
                </Paper>
              )
            })}
          </C_Stack>
        )}
      </div>
    )
  }
  if (withModal) {
    const active = ApRequestList.length
    const className = active ? `t-link ` : 'text-gray-300 opacity-55'
    return (
      <BasicModal
        {...{
          btnComponent: (
            <div className={`${className}w-fit `}>
              <span>{ApRequestType.name}</span>
              <span>({ApRequestList.length})</span>
            </div>
          ),
        }}
      >
        <Main />
      </BasicModal>
    )
  } else {
    return <Main />
  }
}
