'use client'
import {Form} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/Form'

import {ColBuilder} from '@app/(apps)/tsukurunger/class/ColBuilder'

import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'

import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'

import {CssString} from '@components/styles/cssString'

import {Fragment} from 'react'

export const PdfTargetForm = ({
  TheNippo,
  columns,
  formData,
  swithchingColIds,
  activeCols,
  setformData,
  setactiveCols,
  maxWidth,
  nippoOptions,
  useGlobalProps,
}) => {
  return (
    <R_Stack className={`items-start`}>
      <C_Stack className={`mx-auto max-w-[98vw] gap-10  py-10`}>
        <div>
          <div>
            <div style={{maxWidth}} className={`  mx-auto   ${CssString.table.borderCerlls}`}>
              <C_Stack className={`gap-6`}>
                <div>
                  <C_Stack className={` items-center`}>
                    <div>
                      <div className={`text-center`}>
                        <h2 className={`text-primary-main`}>基本事項登録</h2>
                      </div>
                      <table>
                        <tbody>
                          {columns.flat().map((col, idx) => {
                            const description = col?.form?.descriptionNoteAfter as any
                            const switchable = swithchingColIds.some(d => d.id.includes(col.id))
                            if (switchable && !activeCols[col.id]) return null

                            return (
                              <Fragment key={idx}>
                                <tr className={col.id === `tsWorkContent` ? 'border-2 border-red-500 bg-yellow-200' : ''}>
                                  <td className={`w-1/4 max-w-[100px] text-sm`}>{col.label}</td>
                                  <td>
                                    <C_Stack className={`gap-0`}>
                                      <div className={`!py-1`}>
                                        <Form {...{col, formData, setformData, nippoOptions, useGlobalProps}} />
                                      </div>
                                      <div>
                                        <small className={`w-full text-right`}>{description}</small>
                                      </div>
                                    </C_Stack>
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <div className={`text-center`}>
                        <h2 className={`text-primary-main`}>材料登録</h2>
                        <small> *材料の利用を報告する場合は、下記からカテゴリを選択してください</small>
                      </div>
                      <R_Stack className={` items-center justify-center py-4  text-sm`}>
                        {swithchingColIds.map(col => {
                          const active = !!activeCols[col.id]

                          return (
                            <div
                              key={col.id}
                              {...{
                                className: `w-[200px]    ${active ? '' : 'opacity-30'}   bg-gray-400 text-center  rounded p-1`,
                                onClick: () => {
                                  setactiveCols(prev => ({...prev, [col.id]: !prev[col.id]}))
                                },
                              }}
                            >
                              {col.label}
                            </div>
                          )
                        })}
                      </R_Stack>
                    </div>
                  </C_Stack>
                </div>

                <div className={`break-before `}>
                  <R_Stack className={` mx-auto w-fit flex-wrap items-stretch justify-center gap-10`}>
                    <div>
                      <h2 className={`text-primary-main`}>作業内容（フリー入力）</h2>
                      <div className={`mx-auto w-fit`}>
                        <ChildCreator
                          {...{
                            myTable: {style: {width: 400, maxWidth}},
                            ParentData: TheNippo,
                            models: {parent: `tsNippo`, children: `tsNippMannualWorkContent`},
                            columns: ColBuilder.tsNippMannualWorkContent({useGlobalProps}),
                            useGlobalProps,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className={`text-primary-main`}>その他費用、備考</h2>
                      <div className={`mx-auto w-fit`}>
                        <ChildCreator
                          {...{
                            myTable: {style: {width: 400, maxWidth}},
                            ParentData: TheNippo,
                            models: {parent: `tsNippo`, children: `tsNippoRemarks`},
                            columns: ColBuilder.tsNippoRemarks({useGlobalProps}),
                            useGlobalProps,
                          }}
                        />
                      </div>
                    </div>
                  </R_Stack>
                </div>
              </C_Stack>
            </div>
          </div>
        </div>
      </C_Stack>
    </R_Stack>
  )
}
