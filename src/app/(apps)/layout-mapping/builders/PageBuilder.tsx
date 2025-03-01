'use client'

import {ColBuilder} from '@app/(apps)/layout-mapping/builders/ColBuilder'
import usePdfSplitter from '@app/(apps)/layout-mapping/builders/usePdfSplitter'

import {FileHandler} from '@class/FileHandler'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import Accordion from '@components/utils/Accordions/Accordion'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {Prisma} from '@prisma/client'

export class PageBuilder {
  static lmLocation = {
    form: (props: DetailPagePropType) => {
      const {toggleLoad} = props.useGlobalProps
      const {PDFSplitter, pdfPages, reset} = usePdfSplitter()

      const handleUploadPdfByPage = async () => {
        toggleLoad(async () => {
          const bulkUploadPdfRes = await Promise.all(
            pdfPages.map(async (page, idx) => {
              // const blob = await fetch(page).then(res => res.blob())

              const file = await FileHandler.sendFileToS3({
                file: page,
                formDataObj: {backetKey: 'layout-mapping-separated-pdfs'},
              })

              const args: Prisma.PdfCreateArgs = {
                data: {
                  url: file.result.url,
                  name: file.result.name ?? `PDF_${idx + 1}`,
                  lmLocationId: props.formData?.id,
                },
              }
              const res = await fetchUniversalAPI(`pdf`, `create`, args)

              return file
            })
          )
        })
        reset()
      }

      if (!props?.formData?.id) {
        return <MyForm {...{...props}} />
      }
      return (
        <R_Stack className={`max-w-xl items-stretch`}>
          <Accordion {...{label: `基本情報`, defaultOpen: true, closable: true}}>
            <C_Stack className={`gap-10`}>
              <MyForm {...{...props}} />
              <hr />
              <PDFSplitter />
              <Button {...{onClick: handleUploadPdfByPage}}>PDFアップロード</Button>
            </C_Stack>
          </Accordion>

          <Accordion {...{label: `図面`, defaultOpen: true, closable: true}}>
            <ChildCreator
              {...{
                additional: {orderBy: [{name: `asc`}]},
                ParentData: props.formData ?? {},
                models: {parent: props.dataModelName, children: `pdf`},
                columns: ColBuilder.pdf(props),
                useGlobalProps: props.useGlobalProps,
              }}
            />
          </Accordion>
        </R_Stack>
      )
    },
  }
}
