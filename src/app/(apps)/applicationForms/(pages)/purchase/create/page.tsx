'use client'


import {Fields} from '@class/Fields/Fields'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {C_Stack, FitMargin} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {PURCHASE_TYPE_OPTIONS} from '@app/(apps)/applicationForms/(constants)/options'
import {ControlContextType} from '@cm/types/form-control-type'
import {ColBuilder} from '@app/(apps)/applicationForms/(builders)/ColBuilder'
import {Button} from '@components/styles/common-components/Button'
import {defaultRegister} from '@class/builders/ColBuilderVariables'
import {fetchUniversalAPI, toastByResult} from '@lib/methods/api-fetcher'

export default function PurchaseRequestPage() {
  const useGlobalProps = useGlobal()
  const {session, toggleLoad} = useGlobalProps
  const userId = session.id

  const {BasicForm, latestFormData} = useBasicFormProps({
    columns: new Fields([
      //
      {id: `userId`, label: `申請者`, forSelect: {}, form: {defaultValue: userId, disabled: userId}},
      {id: `purchaseType`, label: `購入区分`, forSelect: {optionsOrOptionFetcher: PURCHASE_TYPE_OPTIONS}},
      {
        id: `productId`,
        label: `商品`,
        forSelect: {
          allowCreateOptions: {
            creator: () => {
              return {
                getCreatFormProps: (props: ControlContextType & {searchFormData}) => {
                  return {columns: ColBuilder.product({useGlobalProps}), formData: {}}
                },
              }
            },
          },
          config: {},
        },
      },
      {id: `quantity`, label: `数量`, type: `float`},
      {id: `reason`, label: `理由`, type: `textarea`},
    ])
      .customAttributes(({col}) => {
        return {
          ...col,
          form: {
            ...defaultRegister,
            ...col.form,
            style: {width: 400},
          },
        }
      })
      .transposeColumns(),
  })
  return (
    <FitMargin>
      <BasicForm
        {...{
          latestFormData,
          onSubmit: async data => {
            toggleLoad(async item => {
              const {purchaseType, productId, quantity, reason} = data
              const approverRoleList = [`新規`, `折損`].some(item => item === purchaseType) ? [`工場長`] : [`営業担当者`]

              const {result: approveUser} = await fetchUniversalAPI(`user`, `findFirst`, {
                where: {
                  UserRole: {some: {RoleMaster: {name: {in: approverRoleList}}}},
                },
              })

              const res = await fetchUniversalAPI(`purchaseRequest`, `create`, {
                data: {
                  purchaseType,
                  quantity,
                  reason,
                  User: {connect: {id: userId}},
                  Product: {connect: {id: productId}},
                  Approval: {
                    create: {
                      User: {connect: {id: approveUser.id}},
                      status: `未回答`,
                    },
                  },
                },
              })

              toastByResult(res)
            })
          },
        }}
      >
        <C_Stack className={`items-center gap-2`}>
          <div>
            <small>担当者にメールが送信されます。</small>
          </div>
          <div>
            <Button>発注する</Button>
          </div>
        </C_Stack>
      </BasicForm>
    </FitMargin>
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">発注フォーム</h1>
      {/* <Form {...form}>
        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit(onSubmit)
          }}
          className="space-y-6"
        >
          <div>
            <FormItem>
              <FormLabel>購入区分</FormLabel>
              <FormControl>
                <Select
                  onChange={e => form.setValue('purchaseType', e.target.value as '新規' | '折損' | 'リピート')}
                  defaultValue={form.getValues('purchaseType')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="購入区分を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="新規">新規</SelectItem>
                    <SelectItem value="折損">折損</SelectItem>
                    <SelectItem value="リピート">リピート</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>商品</FormLabel>
              <FormControl>
                <Input {...form.register('product')} placeholder="商品を選択または入力" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>数量</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...form.register('quantity', {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>理由</FormLabel>
              <FormControl>
                <Textarea {...form.register('reason')} placeholder="申請理由を入力してください" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <Button type="submit">送信</Button>
        </form>
      </Form> */}
    </div>
  )
}
