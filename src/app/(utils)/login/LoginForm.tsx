'use client'
import React from 'react'
import {getSession, signIn} from 'next-auth/react'
import useGlobal from 'src/cm/hooks/globalHooks/useGlobal'
import {basePath} from 'src/cm/lib/methods/common'

import {toast} from 'react-toastify'
import useBasicFormProps from 'src/cm/hooks/useBasicForm/useBasicFormProps'
import {Fields} from 'src/cm/class/Fields/Fields'
import {fetchAlt} from '@lib/methods/api-fetcher'
import {Button} from '@components/styles/common-components/Button'

export default function LoginForm(props) {
  const {error} = props
  const {toggleLoad, router} = useGlobal()
  const columns =
    props.columns ??
    Fields.transposeColumns([
      {
        id: 'email',
        label: 'メールアドレス',
        form: {
          register: {
            required: '必須項目です',
          },
        },
      },
      {
        id: 'password',
        label: 'パスワード',
        form: {
          register: {required: '必須項目です'},
        },
      },
    ])
  const {BasicForm, latestFormData} = useBasicFormProps({columns, focusOnMount: false})

  return (
    <>
      <section>
        <div className={`t-paper mx-auto  p-4 `}>
          <BasicForm
            {...{
              latestFormData,
              wrapperClass: 'col-stack gap-4  text-xl items-center',
              ControlOptions: {
                ControlStyle: {width: 250},
              },
              onSubmit: async data => {
                toggleLoad(async () => {
                  const apiPath = `${basePath}/api/prisma/login`
                  const user = await fetchAlt(apiPath, {
                    email: data.email,
                    password: data.password,
                  })
                  if (!user) {
                    toast.error(`正しい認証情報を入力してください。`)
                    return
                  }

                  // const result = await toggleLoad(async () => {
                  const result = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                  })

                  if (result?.ok) {
                    const session = await getSession()
                    toast.success(`ログインしました。`)
                  } else if (result?.error) {
                    toast.error(`ログインに失敗しました。:${result.error}`)
                  }
                  // })
                })
              },
            }}
          >
            <Button color={`primary`}>ログイン</Button>
          </BasicForm>

          {error && <p className={`text-error-main my-4`}>ログイン情報が 正しくありません。</p>}
        </div>
      </section>
      <section>
        {process.env.NEXT_PUBLIC_NO_LOGIN !== 'false' && (
          <Button
            onClick={() => {
              const path = prompt('パスワードを入力してください。')
              if (!path) return
              router.push(`/${path}`)
            }}
          >
            ログインせずに利用
          </Button>
        )}
      </section>
    </>
  )
}
