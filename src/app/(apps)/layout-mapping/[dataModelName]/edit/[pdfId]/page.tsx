import PdfViwer from '@app/(apps)/layout-mapping/[dataModelName]/edit/[pdfId]/PdfViewer/PdfViwer'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import React from 'react'

export default async function Page(props) {
  const params = await props.params;
  const id = params.pdfId ? Number(params.pdfId) : undefined

  const {result: pdf} = await fetchUniversalAPI(`pdf`, `findUnique`, {
    where: {id},
    include: {
      PdfLayer: {},
    },
  })

  return (
    <PdfViwer
      {...{
        // pdfUrl: '/test.pdf',
        pdf: pdf,
        pdfUrl: pdf?.url,
        layers: pdf.PdfLayer,
      }}
    />
  )
  return <></>
}
1
