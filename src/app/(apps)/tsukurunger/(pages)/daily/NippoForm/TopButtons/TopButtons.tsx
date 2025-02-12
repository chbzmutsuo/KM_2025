'use client'

import {handleOnNippoSubmit} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/handleOnSubmit'

import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'

import {DH} from '@class/DH'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import BasicModal from '@components/utils/modal/BasicModal'
import useModal from '@components/utils/modal/useModal'

import React, {useState} from 'react'

import usePdfGenerator from '@hooks/usePdfGenerator'
import NippoFormPdfDocumentVer2 from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Pdf/NippoFormPdfDocumentVer2'
import {formatDate} from '@class/Days'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {useCopyNippoModal} from '@app/(apps)/tsukurunger/(parts)/useCopyNippoModal'

export default function TopButtons({
  subConRole,
  formData,
  totalCost,
  TheNippo,
  materialGroups,
  nippoOptions,
  Genba,
  router,
  asPath,
  toggleLoad,
}) {
  const PdfModal = () => {
    // const {accessScopes} = useGlobal()
    // const {subConRole} = accessScopes().getTsukurungerScopes()
    const fileName = [Genba.name, formatDate(TheNippo.date)].join(`_`)
    const {PdfDisplay, DownLoadLink} = usePdfGenerator({
      fileName: fileName + '.pdf',
      Document: <NippoFormPdfDocumentVer2 {...{Genba}} />,
    })

    return (
      <div>
        <div>
          <DownLoadLink />
        </div>
        <PdfDisplay />
      </div>
    )
  }
  // return <PdfModal />
  return (
    <C_Stack className={`items-center`}>
      <NewDateSwitcher />
      <R_Stack className={`mx-auto w-fit `}>
        <DeleteBtn {...{toggleLoad, TheNippo}} />
        <ConfirrmButton
          {...{
            subConRole,
            formData,
            totalCost,
            TheNippo,
            materialGroups,
            nippoOptions,
            Genba,
            router,
            asPath,
            toggleLoad,
          }}
        />
        <CopyModalButton {...{TheNippo}} />
        {subConRole ? (
          <></>
        ) : (
          <BasicModal {...{btnComponent: <Button color={`blue`}>PDF</Button>}}>
            <PdfModal />
          </BasicModal>
        )}
      </R_Stack>
    </C_Stack>
  )
}

const DeleteBtn = ({toggleLoad, TheNippo}) => {
  return (
    <Button
      color={`red`}
      onClick={() => {
        if (confirm(`削除された日報は復元できません。よろしいですか？`)) {
          toggleLoad(
            async () => {
              await fetchUniversalAPI(`tsNippo`, `delete`, {
                where: {id: TheNippo.id},
              })
            },
            {refresh: true}
          )
        }
      }}
    >
      削除
    </Button>
  )
}

const CopyModalButton = ({TheNippo}) => {
  const {Modal, setopenCopyModal} = useCopyNippoModal()
  return (
    <div>
      <Button onClick={() => setopenCopyModal({sourceNippo: TheNippo})} color={`yellow`}>
        コピー
      </Button>
      <Modal />
    </div>
  )
}

const ConfirrmButton = ({
  subConRole,
  formData,
  totalCost,
  TheNippo,
  materialGroups,
  nippoOptions,
  Genba,
  router,
  asPath,
  toggleLoad,
}) => {
  const [totalCostState, settotalCostState] = useState(totalCost)

  const TheNippoCL = new TsNippo(Genba.TsNippo[0])
  const {open, handleClose, handleOpen} = useModal()

  return (
    <section>
      <Button
        onClick={() => {
          handleOpen(true)
          console.log('1', TheNippoCL.getTotalPrice().sum) //////logs
          TheNippoCL.importToTsNippo({formData, nippoOptions})
          console.log('2', TheNippoCL.getTotalPrice().sum) //////logs
          settotalCostState(TheNippoCL.getTotalPrice().sum)
        }}
      >
        確定
      </Button>
      <BasicModal {...{open, handleClose}}>
        <C_Stack>
          {!subConRole && (
            <div className={`text-error-main text-xl`}>
              <span>合計:</span> <span>{open && DH.toPrice(totalCostState)}円</span>
            </div>
          )}
          <div>登録してもよろしいですか？</div>
          <Button
            onClick={async () => {
              if (!confirm(`登録しますか？`)) return
              toggleLoad(
                async () => {
                  const res = await handleOnNippoSubmit({
                    totalCostState,
                    TheNippo,
                    materialGroups,
                    formData,
                  })
                  router.push(asPath)
                  return res
                },
                {refresh: true, mutate: true}
              )
            }}
            color={`red`}
          >
            確定
          </Button>
        </C_Stack>
      </BasicModal>
    </section>
  )
}
