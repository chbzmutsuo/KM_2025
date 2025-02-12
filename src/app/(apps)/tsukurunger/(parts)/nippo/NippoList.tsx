'use client'

import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'

import {formatDate} from '@class/Days'
import {DH} from '@class/DH'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'

import {ClipboardIcon} from '@heroicons/react/20/solid'

import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import Link from 'next/link'
import {useCopyNippoModal} from '@app/(apps)/tsukurunger/(parts)/useCopyNippoModal'

export const NippoList = ({tsConstructionId}) => {
  const {Modal, openCopyModal, setopenCopyModal} = useCopyNippoModal()

  const {data: NippoList = []} = usefetchUniversalAPI_SWR(`tsNippo`, `findMany`, {
    orderBy: [{date: `asc`}],
    where: {tsConstructionId: tsConstructionId},
    include: QueryBuilder.getInclude({}).tsNippo.include,
  })

  return (
    <C_Stack>
      <Modal />
      {NippoList?.filter(d => {
        return new TsNippo(d).filterActiveNippo()
      }).map(d => {
        const href = `/tsukurunger/daily/${tsConstructionId}/input?from=${formatDate(d.date)}`
        const TheNippoCL = new TsNippo(d)

        return (
          <div key={d.id}>
            <R_Stack className={`w-[300px] justify-between`}>
              <Link className={`t-link`} href={href}>
                {formatDate(d.date)}
              </Link>
              <div>{DH.toPrice(TheNippoCL.getTotalPrice().sum)}</div>

              <button
                onClick={() => {
                  setopenCopyModal({sourceNippo: d})
                }}
              >
                <ClipboardIcon className={`w-4 text-gray-500`} />
              </button>
            </R_Stack>
          </div>
        )
      })}
    </C_Stack>
  )
}
