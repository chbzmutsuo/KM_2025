'use client'
import {T_LINK} from '@components/styles/common-components/links'
import {HREF} from '@lib/methods/urls'
import {Absolute, Center, C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import useMyNavigation from 'src/cm/hooks/globalHooks/useMyNavigation'

const UnAuthorizedPage = () => {
  const {query, router} = useMyNavigation()
  const {rootPath} = query

  return (
    <Absolute className={`w-full p-4 text-xl`}>
      <Center>
        <C_Stack className={`gap-20`}>
          <C_Stack className={`gap-4 text-center text-gray-600 `}>
            <p>このページは利用できません</p>
            <small>
              アカウントに権限がないか、
              <br />
              端末サイズが不適合である可能性があります
            </small>
          </C_Stack>
          <R_Stack className={` justify-center gap-8`}>
            <div
              className={`t-link `}
              onClick={e => {
                router.push(`/${rootPath}`)
              }}
            >
              戻る
            </div>
            <T_LINK href={HREF(`/login?rootPath=${rootPath}`, {}, query)} simple>
              ログイン
            </T_LINK>
          </R_Stack>
        </C_Stack>
      </Center>
    </Absolute>
  )
}

export default UnAuthorizedPage
