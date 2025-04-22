import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {Fields} from '@class/Fields/Fields'
import React from 'react'
import {Approval, PurchaseRequest} from '@prisma/client'
import {CODE_MASTER} from '@app/(apps)/shinsei/(constants)/CODE_MASTER'
import {Button} from '@components/styles/common-components/Button'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import {TextRed} from '@components/styles/common-components/Alert'
import {C_Stack} from '@components/styles/common-components/common-components'
import {isDev} from '@lib/methods/common'
import {sendEmailWrapper} from 'src/non-common/(chains)/shinsei/sendEmailWrapper'
import useGlobal from '@hooks/globalHooks/useGlobal'

export default function PurchaseApproveModal(props: {
  Approval: Approval
  request: PurchaseRequest
  fetchRequests: () => void
  handleClose: () => void
}) {
  const {toggleLoad} = useGlobal()

  const {Approval, request, fetchRequests, handleClose} = props

  const kaitoZumi = Approval?.status !== '未回答'
  const {BasicForm, latestFormData} = useBasicFormProps({
    formData: Approval,
    columns: new Fields([
      //
      {
        id: `status`,
        label: `ステータス`,
        form: {},
        forSelect: {optionsOrOptionFetcher: CODE_MASTER.APPROVAL_STATUS_OPTIONS},
      },
      {
        id: `comment`,
        label: `コメント`,
        form: {style: {minWidth: 400, minHeight: 200}},
        type: 'textarea',
      },
    ]).transposeColumns(),
  })

  const doUpdateStatus = async data => {
    const res = await fetchUniversalAPI(`approval`, `update`, {
      where: {id: Approval.id},
      data: {status: data.status, comment: data.comment},
    })
    toastByResult(res)
    await fetchRequests()
    handleClose()

    return res
  }
  return (
    <div>
      <C_Stack>
        {kaitoZumi && <TextRed>すでに回答済みです。</TextRed>}
        <div className={isDev ? '' : kaitoZumi ? 'pointer-events-none opacity-80' : ''}>
          <BasicForm
            {...{
              latestFormData,
              onSubmit: async data => {
                const {status, comment} = data

                if (status === '未回答') {
                  return alert('「未回答」は入力できません。')
                }

                toggleLoad(async () => {
                  const {result: userRole} = await fetchUniversalAPI(`userRole`, `findMany`, {
                    where: {userId: Approval.userId},
                    include: {RoleMaster: {}},
                  })

                  let message = '一度変更したデータはもとに戻せません。よろしいですか？'

                  const isHacchusha = userRole.find(userRole => userRole.RoleMaster.name === '発注担当者')

                  if (status !== '承認') {
                    if (confirm(message)) {
                      await doUpdateStatus(data)
                    }
                  } else {
                    //発注者処理
                    if (isHacchusha) {
                      const {result: requestData} = await fetchUniversalAPI(`purchaseRequest`, `findUnique`, {
                        where: {id: request.id},
                        include: {Product: {include: {ShiireSaki: true}}},
                      })

                      const shiiresaki = requestData?.Product?.ShiireSaki
                      if (!shiiresaki) {
                        message = '仕入れ先のメールアドレスが見つからないため、処理を実行できません。'
                        return alert(message)
                      }

                      message = [
                        //
                        `発注を確定すると、仕入れ先に自動でメール通知が実施されます。`,
                        `仕入れ先: ${shiiresaki.name}`,
                      ].join(`\n`)

                      const subject = `発注のご連絡（石田精工株式会社_自動）`
                      const text = [
                        `【発注先の会社名】御中`,
                        ``,
                        `いつもお世話になっております。石田精工株式会社です。`,
                        ``,
                        `下記の通り注文致しますので、ご確認の程宜しくお願い申し上げます。`,
                        ``,
                        `・品番【${requestData.Product.code}】`,
                        `・品名【${requestData.Product.name}】`,
                        `・数量【${requestData.quantity}】`,
                        ``,
                        `※本メールは送信専用となります。 `,
                        `ご返信の際は下記記載のアドレス、または弊社担当までお願いいたします。`,
                        ``,
                        `****************************************`,
                        ``,
                        `石田精工株式会社`,
                        `TEL：072-962-9847`,
                        `MAIL：info@ishidaseiko.com`,
                        ``,
                        `****************************************`,
                      ].join(`\n`)

                      if (confirm(message)) {
                        await sendEmailWrapper({
                          to: [shiiresaki.email],

                          subject,
                          text,
                        })

                        await doUpdateStatus(data)
                      }
                    } else {
                      //承認者処理
                      if (confirm(message)) {
                        await doUpdateStatus(data)
                      }
                    }
                  }
                })
              },
            }}
          >
            <Button>確定</Button>
          </BasicForm>
        </div>
      </C_Stack>
    </div>
  )
}
