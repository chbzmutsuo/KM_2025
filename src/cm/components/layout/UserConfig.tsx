import {R_Stack} from '@components/styles/common-components/common-components'
import {T_LINK} from '@components/styles/common-components/links'
import {Paper} from '@components/styles/common-components/paper'
import {LabelValue} from '@components/styles/common-components/ParameterCard'
import MyPopover from '@components/utils/popover/MyPopover'
import {UserCircleIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {HREF} from '@lib/methods/urls'
import React from 'react'

export const UserConfig = () => {
  const {roles, accessScopes, session, rootPath, query, width} = useGlobal()

  const roleString = roles.map(d => d.name).join(`/`)

  const styling = {styles: {wrapper: {padding: 0, width: `100%`}}}
  const maxWidth = Math.min(width * 0.8, 400)
  const minWidth = Math.min(width * 0.8, 240)

  if (accessScopes().login) {
    return (
      <div>
        <MyPopover
          {...{
            mode: `click`,
            alertOnClose: false,
            button: (
              <button className={`row-stack gap-0`}>
                <UserCircleIcon className={` w-7 text-gray-700 `} />
              </button>
            ),
          }}
        >
          <Paper>
            <R_Stack style={{maxWidth, minWidth, margin: `auto`}}>
              <LabelValue {...{styling, label: `氏名`, value: session.name}} />
              <LabelValue {...{styling, label: `Email`, value: session?.email}} />

              <R_Stack className={`w-full justify-end`}>
                <T_LINK href={HREF(`/logout`, {rootPath}, query)}>ログアウト</T_LINK>
              </R_Stack>
            </R_Stack>
          </Paper>
        </MyPopover>
      </div>
    )
  } else {
    return (
      <T_LINK simple href={HREF(`/login`, {rootPath}, query)}>
        ログイン
      </T_LINK>
    )
  }
}
