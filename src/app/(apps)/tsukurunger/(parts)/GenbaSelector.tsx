'use client'
import {C_Stack} from '@components/styles/common-components/common-components'
import BasicModal from '@components/utils/modal/BasicModal'
import useGlobal from '@hooks/globalHooks/useGlobal'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {HREF} from '@lib/methods/urls'
import {Prisma} from '@prisma/client'
import Link from 'next/link'
import React, {Fragment} from 'react'

export default function GenbaSelector() {
  const {query, accessScopes} = useGlobal()
  const {admin} = accessScopes()
  const args: Prisma.TsConstructionFindFirstArgs = {
    orderBy: [{updatedAt: 'desc'}, {tsMainContractorId: 'asc'}],
  }

  const {data: genbaList = []} = usefetchUniversalAPI_SWR(`tsConstruction`, `findMany`, args)

  if (admin) {
    return (
      <div>
        <BasicModal {...{btnComponent: <>現場選択</>}}>
          <C_Stack className={`gap-2`}>
            {genbaList.map((d, i) => {
              return (
                <Fragment key={i}>
                  <Link className={`t-link`} href={HREF(`/tsukurunger/tsConstruction/${d.id}`, {}, query)}>
                    {d.name}
                  </Link>
                </Fragment>
              )
            })}
          </C_Stack>
        </BasicModal>
      </div>
    )
  }
  return null
}
