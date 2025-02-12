'use client'
import {DH} from '@class/DH'
import {Center, R_Stack} from '@components/styles/common-components/common-components'
import {TrashIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'
import React, {useState} from 'react'

export default function MnualUserInput({id, type, data, month, style = {}}) {
  const {toggleLoad} = useGlobal()
  const [value, setvalue] = useState(data[id] ?? '')

  const dataExist = !!data[`id`]

  const handleOnBlur = async e => {
    const input = DH.convertDataType(e.target.value, type)

    const args: Prisma.YsManualUserRowUpsertArgs = {
      where: {
        unique_month_code: {
          code: data.code ?? input,
          month,
        },
      },
      update: {[id]: input},
      create: {
        code: data.code ?? input,
        month,
        [id]: input,
      },
    }
    const isNew = !data.id
    if (isNew) {
      if (!input) return
      toggleLoad(async () => {
        await fetchUniversalAPI(`ysManualUserRow`, `upsert`, args)
      })
    } else {
      await fetchUniversalAPI(`ysManualUserRow`, `upsert`, args)
    }
  }

  const disabledWhenRowIsNull = !dataExist && id !== `code`
  return (
    <R_Stack className={`flex-nowrap gap-0`}>
      {id === `code` && (
        <Center>
          <TrashIcon
            {...{
              className: `onHover h-5 ${!dataExist ? 'disabled opacity-30' : ''}`,
              disabled: !dataExist,
              onClick: () => {
                if (!confirm(`削除しますか？`)) return
                toggleLoad(async () => {
                  await fetchUniversalAPI(`ysManualUserRow`, `delete`, {
                    where: {id: data.id},
                  })
                })
              },
            }}
          />
        </Center>
      )}
      <input
        {...{
          value: disabledWhenRowIsNull ? 'コードを入力してください' : value,
          style,
          className: `

          ${disabledWhenRowIsNull ? '!bg-gray-500' : ''}
          myFormControl !px-0 text-end   text-sm`,
          type,
          onChange: e => setvalue(e.target.value),
          onBlur: handleOnBlur,
          disabled: disabledWhenRowIsNull,
        }}
      />
    </R_Stack>
  )
}
