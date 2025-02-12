import {roopMakeRelationalInclude} from '@class/builders/QueryBuilderVariables'
import {DH} from '@class/DH'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {Prisma, User} from '@prisma/client'
import {P_ApCustomFieldValue, P_ApReceiver, P_ApRequest} from 'scripts/generatedTypes'

export class ApRequestClass {
  ApRequest: MappeadApRequest

  constructor(ApRequest) {
    if (!ApRequest.ApCustomFieldValue) {
      throw new Error(`ApRequest.ApCustomFieldValue is not defined`)
    }
    if (!ApRequest.ApReceiver) {
      throw new Error(`ApRequest.ApReceiver is not defined`)
    }

    this.ApRequest = this.mapApApWithCfValue(ApRequest)
  }

  isApproved = () => this.ApRequest.forceApproved === true && this.ApRequest.status === '確定'

  //CfValueをマッピングする
  mapApApWithCfValue = ApRequest => {
    const createCfvalueKey = CustomFieldType => {
      let valueKey = 'string'
      if ([`date`, `datetime`].includes(CustomFieldType)) {
        valueKey = 'date'
      }
      if ([`number`].includes(CustomFieldType)) {
        valueKey = 'number'
      }

      return valueKey
    }

    const {ApCustomFieldValue} = ApRequest

    const toCfObject = Object.fromEntries(
      ApCustomFieldValue.map(field => {
        const {name, type} = field.ApCustomField

        const valueKey = createCfvalueKey(type)

        const value = field[valueKey]

        const displayValue = DH.convertDataType(value, type, `client`)

        const sortOrder = field.ApCustomField.sortOrder

        const key = name
        const data = {
          sortOrder,
          name,
          type,
          valueKey,
          value,
          displayValue,
        }
        return [key, data]
      }).sort((a, b) => a[1].sortOrder - b[1].sortOrder)
    )

    return {
      ...ApRequest,
      cf: {...toCfObject},
    } as MappeadApRequest
  }

  //最終承認状況を取得
  getApprovementStatus = () => {
    const allPassed = this.ApRequest.ApReceiver.every(d => d.status === '承認')
    const someRejected = this.ApRequest.ApReceiver.some(d => d.status === '却下')
    const summary = someRejected ? '棄却' : allPassed ? '全承認' : '保留'

    return {
      allPassed,
      someRejected,
      summary,
    }
  }

  //強制承認
  forceAuthorize = async () => {
    await fetchUniversalAPI(`apRequest`, `update`, {
      where: {id: this.ApRequest.id},
      forceApproved: this.ApRequest.forceApproved === true ? false : true,
    })
  }

  static filterOnlyApproved = (apRequests: MappeadApRequest[]) => {
    return apRequests.filter(d => new ApRequestClass(d).isApproved())
  }

  static colorsByStatus = {
    全承認: `green`,
    保留: `gray`,
    棄却: `red`,
  }

  //includeを取得
  static ApRequestGetInclude = () => {
    const apRequest: Prisma.ApRequestFindManyArgs = {
      include: {
        ApSender: {include: {User: {}}},
        ApReceiver: {include: {User: {}}},
        ApRequestTypeMaster: {},

        ApCustomFieldValue: {
          include: {
            ApCustomField: {},
          },
        },
      },
    }

    const apRequestTypeMaster: Prisma.ApRequestTypeMasterFindManyArgs = {
      include: {ApCustomField: {}},
    }

    const include = {
      apRequest,
      apRequestTypeMaster,
    }

    Object.keys(include).forEach(key => {
      roopMakeRelationalInclude({
        parentName: key,
        parentObj: include[key],
      })
    })
    return include
  }
}
export type ApRequestCfAtom = {
  name: string
  type: string
  valueKey: string
  value: any
  displayValue: any
  sortOrder: number
}
export type ApRequestCf = {[key: string]: ApRequestCfAtom} & {date?: Date}
export type MappeadApRequest = P_ApRequest & {
  ApReceiver: P_ApReceiver[]
  ApCustomFieldValue: P_ApCustomFieldValue[]
  cf: ApRequestCf
}

export type apRequestStatusListType = {
  message: string
  label: '確定' | '確定待ち' | '保留' | '棄却' | '取り下げ' | undefined
  color: string
  withdrawable: boolean
  getEmailProps?: (props: {Sender: User; AllReceiver: User[]; unAuthorizedMembers: User[]; soumuMembers: User[]}) => {
    subject: any
    to?: any[]
  }
}

export const apRequestStatusList: apRequestStatusListType[] = [
  {
    message: '確定しますか？',
    label: '確定待ち',
    color: 'orange',
    withdrawable: true,
    getEmailProps: props => {
      return {
        subject: `【勤怠システム通知】総務確定待ちの申請があります。`,
        to: [
          //総務のみ
          ...props.soumuMembers.map(d => d.email),
        ],
      }
    },
  },
  {
    message: '全員の承認が完了していません。強制確定しますか？',
    label: '保留',
    color: 'gray',
    withdrawable: true,
    getEmailProps: props => {
      return {
        subject: '【勤怠システム通知】承認者にあなたが含まれた申請が進行中です。',
        to: [
          //まだ承認をしていないメンバーに送信
          ...props.unAuthorizedMembers.map(d => d.email),
        ],
      }
    },
  },
  {
    message: '最終承認を取り消しますか？',
    label: '確定',
    color: 'green',
    withdrawable: false,
    getEmailProps: props => {
      return {
        subject: `【勤怠システム通知】稟議が総務によって「確定」されました。`,
        to: [
          //発議者にのみ送信
          props.Sender.email,
        ],
      }
    },
  },

  {
    message: '「棄却」で返されている稟議です。強制確定しますか？',
    label: '棄却',
    color: 'red',
    withdrawable: false,
    getEmailProps: props => {
      return {
        subject: `【勤怠システム通知】稟議が却下されました。`,
        to: [
          //総務も含めて関連のもの全員に送信
          props.Sender.email,
        ],
      }
    },
  },
  {
    message: '一度取り下げられた稟議は、変更できません。',
    label: '取り下げ',
    color: 'black',
    withdrawable: false,
    getEmailProps: props => {
      return {
        subject: `【勤怠システム通知】取り下げられた稟議があります。`,
        to: [
          //総務も含めて関連のもの全員に送信
          props.Sender.email,
          ...props.AllReceiver.map(d => d.email),
          ...props.soumuMembers.map(d => d.email),
        ],
      }
    },
  },
]
