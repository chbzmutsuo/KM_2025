import Base from '@app/(apps)/tbm/(pages)/tbmOperationGroupCreate copy/FormList/Base'
import {InputType} from '@app/(apps)/tbm/(pages)/tbmOperationGroupCreate copy/Updator'
import GoBack from '@app/(apps)/tbm/(pages)/tbmOperationGroupCreate copy/FormList/GoBack'
import {TbmOperation, TbmOperationGroup} from '@prisma/client'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'
import Fuel from '@app/(apps)/tbm/(pages)/tbmOperationGroupCreate copy/FormList/Fuel'

export type UserInputType = {
  base: null | TbmOperationGroup
  go: null | TbmOperation
  back: null | TbmOperation
  refuel: null
  complete: boolean
}

export type FormProps = {
  userInput: UserInputType
  type: InputType
  labelAffix: string
}

export type FormType = {
  key: InputType
  label: string
  main?: (props: {userInput: UserInputType}) => React.ReactNode
  color: string
  onClick?: any
  disabled?: boolean
}
// 入力画面の種類を定義

export const getFormList = (userInput: UserInputType) => {
  const formListn: FormType[] = [
    {
      key: 'base',
      color: `blue`,
      label: `営業所・車両選択`,
      main: ({userInput}) => <Base {...{userInput, type: 'base', labelAffix: ''}}></Base>,
    },
    {
      key: 'go',
      color: `green`,
      label: '「行き」編集',
      main: ({userInput}) => <GoBack {...{userInput, type: 'go', labelAffix: '行き'}}></GoBack>,
      disabled: !userInput.base?.id,
    },
    {
      key: 'back',
      color: `green`,
      label: '「帰り」編集',
      main: ({userInput}) => <GoBack {...{userInput, type: 'back', labelAffix: '帰り'}}></GoBack>,
      disabled: !userInput.base?.id,
    },
    {
      key: 'refuel',
      color: `orange`,
      label: '「給油」入力',
      disabled: !userInput.base?.id,
      main: () => <Fuel {...{userInput, type: `refuel`, labelAffix: '給油'}}></Fuel>,
    },
    {
      key: 'complete',
      color: `sub`,
      label: '完了入力',
      disabled: !userInput.base?.id,
      onClick: async toggleLoad => {
        if (confirm(`運行を完了しますか？`)) {
          toggleLoad(async () => {
            const res = await fetchUniversalAPI(`tbmOperationGroup`, `update`, {
              where: {id: userInput.base?.id},
              confirmed: true,
            })
            toastByResult(res)
          })
        }
      },
    },
  ]

  return formListn
}
