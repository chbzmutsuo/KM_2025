'use client'

import {toUtc} from '@class/Days'

import {Button} from '@components/styles/common-components/Button'
import {Absolute, Center, C_Stack} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import useGlobal from '@hooks/globalHooks/useGlobal'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export const Starter = ({Genba, query}) => {
  const {router} = useGlobal()
  return (
    <Absolute>
      <Center>
        <C_Stack className={`items-center gap-8`}>
          <NewDateSwitcher />
          <Button
            onClick={async () => {
              await fetchUniversalAPI(`tsNippo`, `create`, {
                tsConstructionId: Genba.id,
                date: toUtc(query.from),
              })
              router.refresh()
            }}
          >
            日報を入力する
          </Button>
        </C_Stack>
      </Center>
    </Absolute>
  )
}
