'use client'
import InvoicePdfDocument from '@app/(apps)/aquapot/(pages)/myPage/[id]/pdf/[month]/InvoicePdfDocument'
import {FitMargin} from '@cm/components/styles/common-components/common-components'
import usePdfGenerator from '@cm/hooks/usePdfGenerator'
import React from 'react'

export default function PdfRenderer({saleRecordOnThisMonth}) {
  const {PdfDisplay, DownLoadLink} = usePdfGenerator({
    Document: <InvoicePdfDocument {...{saleRecordOnThisMonth}} />,
    fileName: `test.pdf`,
  })

  return (
    <FitMargin>
      <PdfDisplay />
      <DownLoadLink />
    </FitMargin>
  )
}
