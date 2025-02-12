'use client'

import {Padding, R_Stack} from '@components/styles/common-components/common-components'
import {T_LINK} from '@components/styles/common-components/links'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import {CssString} from '@components/styles/cssString'

import {ChevronDoubleDownIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {cl} from '@lib/methods/common'
import {HREF} from '@lib/methods/urls'
import {Prisma} from '@prisma/client'

import React, {Fragment, useState} from 'react'
export type mainContructor = Prisma.TsMainContractorUncheckedCreateInput & {
  TsConstruction: Prisma.TsConstructionUncheckedCreateInput[]
}
export default function MainContractorList({MainContractors}) {
  const {query} = useGlobal()
  const [mainContractorsState, setmainContractorsState] = useState<mainContructor[]>(MainContractors)

  const [tsConstructionState, settsConstructionState] = useState<any>({})

  const Td = props => {
    return <td className={`first:min-w-[100px] [&:nth-child(2)]:min-w-[100px]`} {...props}></td>
  }

  return (
    <Padding>
      <TableWrapper className={` mx-auto w-[600px] max-w-[90vw] `}>
        <TableBordered className={cl(CssString.table.paddingTd)}>
          <thead>
            <tr>
              <th>元請け</th>
              <th>現場名</th>
              <th>日報入力</th>
              <th>原価表</th>
              <th>出来高内訳</th>
            </tr>
          </thead>
          <tbody>
            {mainContractorsState?.map((d, i) => {
              const key = String(d.id)
              const {TsConstruction} = d
              const open = tsConstructionState[key]
              return (
                <Fragment key={i}>
                  <tr className={cl(open ? 'bg-yellow-300' : '', `onHover`)}>
                    <Td colSpan={5}>
                      <R_Stack
                        className={`gap-0.5`}
                        onClick={async () => {
                          if (open) {
                            settsConstructionState({})
                          } else {
                            settsConstructionState({[key]: true})
                          }
                        }}
                      >
                        <ChevronDoubleDownIcon className={`w-5`} />
                        {d.name}
                      </R_Stack>
                    </Td>
                  </tr>
                  {open && (
                    <>
                      {TsConstruction.length === 0 ? (
                        <tr>
                          <Td></Td>
                          <Td>データがありません</Td>
                        </tr>
                      ) : (
                        TsConstruction.map((d, i) => {
                          return (
                            <tr key={i}>
                              <Td></Td>
                              <Td>
                                <strong>{d.name}</strong>
                              </Td>
                              <Td>
                                <T_LINK href={HREF(`/tsukurunger/daily/${d.id}/input`, {}, query)}>日報入力</T_LINK>
                              </Td>
                              <Td>
                                <T_LINK href={`/tsukurunger/daily/${d.id}/expense`}>原価表</T_LINK>
                              </Td>
                              <Td>
                                <T_LINK href={`/tsukurunger/daily/${d.id}/progress`}>出来高内訳</T_LINK>
                              </Td>
                            </tr>
                          )
                        })
                      )}
                    </>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </TableBordered>
      </TableWrapper>
    </Padding>
  )
}
