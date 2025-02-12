import {ApRequestCfAtom, ApRequestClass, apRequestStatusList, MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'

import {formatDate, toJst} from '@class/Days'
import {Prisma} from '@prisma/client'
import prisma from '@lib/prisma'
import {knockEmailApi} from '@lib/methods/mails'
import {basePath} from '@lib/methods/common'
import {addQuerySentence} from '@lib/methods/urls'

export const NotifyAfterApRequestStatusUpdate = async ({requestId}) => {
  let ApRequest = await prisma.apRequest.findUnique({
    where: {id: requestId},
    include: {
      ...ApRequestClass.ApRequestGetInclude().apRequest.include,
      ApReceiver: {include: {User: {}}},
      ApSender: {
        include: {
          User: {
            include: {
              UserRole: {include: {RoleMaster: true}},
            },
          },
        },
      },
    },
  } as Prisma.ApRequestFindFirstArgs)

  ApRequest = new ApRequestClass(ApRequest).mapApApWithCfValue(ApRequest) as MappeadApRequest

  const {forceApproved} = ApRequest
  const {ApReceiver, ApSender, withdrawn} = ApRequest

  const isSuperUser = ApSender.User.UserRole.some(d => d.RoleMaster.name === `総務管理者`)
  const isApprover = ApSender.User.UserRole.some(d => d.RoleMaster.name === `一般承認者`)

  const allPassed = ApReceiver.every(d => d.status === '承認')
  const someRejected = ApReceiver.some(d => d.status === '却下')

  const Sender = ApSender.User
  const AllReceiver = ApReceiver.map(d => d.User)
  const unAuthorizedMembers = ApReceiver.filter(d => d.status === null).map(d => d.User)
  const soumuMembers = await prisma.user.findMany({
    where: {UserRole: {some: {RoleMaster: {name: `総務管理者`}}}},
  } as Prisma.UserFindManyArgs)

  let status: (typeof apRequestStatusList)[number]['label'] = undefined

  if (withdrawn) {
    status = `取り下げ`
  } else if (forceApproved) {
    status = `確定`
  } else {
    status = someRejected ? '棄却' : allPassed ? '確定待ち' : '保留'
  }

  const result = await prisma.apRequest.update({
    where: {id: ApRequest.id},
    data: {
      forceApproved,
      status: status,
    },
  })

  // メール送信
  const getEmailProps = apRequestStatusList.find(d => d.label === status)?.getEmailProps
  if (getEmailProps) {
    const {to, subject} = getEmailProps?.({Sender, AllReceiver, unAuthorizedMembers, soumuMembers}) ?? {}

    const cfKeyValList = Object.keys(ApRequest?.cf ?? {})
      .map(key => {
        const {displayValue, sortOrder} = ApRequest?.cf[key] as ApRequestCfAtom

        return {
          key,
          displayValue,
          sortOrder,
        }
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)

    const textArr = [
      `申請者：${Sender.name}`,
      `申請日時：${formatDate(toJst(ApRequest.createdAt), `YYYY-MM-DD HH:mm`)}`,
      `稟議種類：${ApRequest.ApRequestTypeMaster.name}`,
      ...AllReceiver.map((user, i) => {
        const theReceiveData = ApReceiver.find(receive => {
          return receive?.userId === user?.id
        })
        return `承認者${i + 1}：${user.name}閲覧状況:【 ${theReceiveData?.status ?? '未閲覧'} 】`
      }),
      `ステータス状況:${status}`,
    ]

    if (isSuperUser || isApprover) {
      const authUrl =
        `${basePath}/yoshinari/apRequestAuthorizer` +
        addQuerySentence(isSuperUser ? {status: `確定待ち`} : isApprover ? {status: `保留`} : {})
      textArr.push(`承認者は、こちらから承認できます。`)
      textArr.push(authUrl)
    }
    const text = textArr.join(`\n`)
    await knockEmailApi({to, subject, text})
  }
}
