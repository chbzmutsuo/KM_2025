import {ApReceiverStatusInfo} from '@lib/ApprovementRequest/components/ApReceiverStatusInfo'
import {ApRequestClass, apRequestStatusList} from '@class/ApRequestClass/ApRequestClass'
import {formatDate} from '@class/Days'

import {ColoredText} from '@components/styles/common-components/colors'
import BasicModal from '@components/utils/modal/BasicModal'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {ApRequestForm} from '@lib/ApprovementRequest/components/ApRequestForm'

import {TrashIcon} from '@heroicons/react/20/solid'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export function CreateApRequestArray({
  approvementTypes,
  ApRequestList,
  ApRequestType,
  ApRequestTypeConfigs,
  handleApprovementFormModalOpen,
  isSuperUser,
}) {
  const {session, toggleLoad} = useGlobal()
  const firstApRequest = ApRequestList?.[0]

  const cfValueList: any = Object.values(firstApRequest?.cf ?? {}).sort((a: any, b: any) => a.sortOrder - b.sortOrder)

  const header = ['申請日時', '申請者', '結果', `承認履歴`, `稟議種類`, ...cfValueList.map(d => d.name), `詳細`, `取り下げ`]

  const body = ApRequestList.map(apRequest => {
    const {cf, ApSender, ApReceiver, status, forceApproved, ApRequestTypeMaster} = apRequest

    const allPassed = ApReceiver.every(d => d.status === '承認')
    const someRejected = ApReceiver.some(d => d.status === '却下')
    const summary = someRejected ? '棄却' : allPassed ? '確定待ち' : '保留'

    const cfValueList: any[] = Object.values(apRequest?.cf ?? {}).sort((a: any, b: any) => a.sortOrder - b.sortOrder)

    return {
      apRequest,
      rowArray: [
        formatDate(apRequest.createdAt, `YYYY-MM-DD HH:mm`),
        ApSender.User.name,
        <SummaryTd {...{apRequest, forceApproved, isSuperUser, toggleLoad, summary}} />,
        <ApReceiverStatusInfo
          {...{
            approvementTypes,
            ApRequest: apRequest,
            handleApprovementFormModalOpen,
            session,
          }}
        />,
        ApRequestTypeMaster.name,
        ...cfValueList.map(d => d.displayValue),
        <BasicModal {...{btnComponent: <div className={`t-link`}>詳細</div>}}>
          <ApRequestForm {...{ApRequestList: history, ApRequestType, ApRequestTypeConfigs, theApRequest: apRequest}} />
        </BasicModal>,
        <TrashIcon
          {...{
            className: `h-6`,
            onClick: async () => {
              const theStatus = apRequestStatusList.find(d => d.label === apRequest.status)

              if (theStatus && theStatus.withdrawable == false) {
                const message = `「確定」または「棄却」の稟議は取り下げできません。`
                alert(message)
                return
                // return alert()
              }

              if (confirm(`一度取り下げると、元に戻せません。よろしいですか？`)) {
                toggleLoad(async () => {
                  await fetchUniversalAPI(`apRequest`, `update`, {
                    where: {id: apRequest.id},
                    data: {withdrawn: true},
                  })
                })
              }

              // glksaj
            },
          }}
        />,
      ],
    }
  })

  return {
    header,
    body,
  }
}

const SummaryTd = ({apRequest, forceApproved, isSuperUser, toggleLoad, summary}) => {
  const theStatus = apRequestStatusList.find(d => d.label === (apRequest.status ?? '保留'))

  const Label = () => {
    return (
      <ColoredText className={`mx-auto !w-[80px]`} bgColor={theStatus?.color}>
        {theStatus?.label}
      </ColoredText>
    )
  }

  if (isSuperUser) {
    const onClick = async () => {
      if (confirm(theStatus?.message)) {
        toggleLoad(async () => {
          await new ApRequestClass(apRequest).forceAuthorize()
        })
      }
    }
    return (
      <div onClick={onClick} className={`onHover`}>
        <Label />
      </div>
    )
  } else {
    return <Label />
  }
}
