'use client'

import {formatDate} from '@class/Days'

import {HREF} from '@lib/methods/urls'
import {Button} from '@components/styles/common-components/Button'

import {useState} from 'react'

import BasicModal from '@components/utils/modal/BasicModal'
import useBasicFormProps from '@hooks/useBasicForm/useBasicFormProps'
import {Fields} from '@class/Fields/Fields'

import {copyNippo} from '@app/(apps)/tsukurunger/(parts)/nippo/copyNippo'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import useGlobal from '@hooks/globalHooks/useGlobal'

export const useCopyNippoModal = () => {
  const {pathname, addQuery, toggleLoad, router, query} = useGlobal()
  const [openCopyModal, setopenCopyModal] = useState<{sourceNippo: any} | null>(null)

  const {BasicForm, latestFormData} = useBasicFormProps({
    columns: new Fields([{id: `date`, label: `コピー先の日付`, type: `date`, form: {}}]).transposeColumns(),
  })
  const Modal = () => {
    return (
      <BasicModal {...{open: openCopyModal, handleClose: () => setopenCopyModal(null)}}>
        <BasicForm
          latestFormData={latestFormData}
          onSubmit={async data => {
            const tsConstructionId = openCopyModal?.sourceNippo?.tsConstructionId
            const date = data.date

            if (!date) return alert(`日付を入力してください`)
            const currentNippoOnSameDate = await (
              await fetchUniversalAPI(`tsNippo`, `findUnique`, {
                where: {
                  unique_date_tsConstructionId: {
                    date,
                    tsConstructionId,
                  },
                },
              })
            ).result

            // if (currentNippoOnSameDate) return alert(`すでに日報が登録されています`)

            if (confirm(`${formatDate(date, 'YYYY/MM/DD')}に、日報をコピーします。よろしいですか？`)) {
              toggleLoad(async () => {
                const newNippo = await copyNippo({date, sourceNippo: openCopyModal?.sourceNippo})
                router.push(HREF(`/tsukurunger/daily/3/input`, {from: formatDate(date)}, query))
              })
            }
          }}
        >
          <Button>コピー</Button>
        </BasicForm>
      </BasicModal>
    )
  }
  return {Modal, openCopyModal, setopenCopyModal}
}
