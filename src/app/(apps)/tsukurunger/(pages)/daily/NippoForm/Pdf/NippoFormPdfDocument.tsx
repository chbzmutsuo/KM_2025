'use client'

import {Page, View, Document, Text} from '@react-pdf/renderer'
import {DH} from '@class/DH'

import React from 'react'

import {tail_color} from 'tailwind.config'
import {formatDate, toUtc} from '@class/Days'
import {selectOptions} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/NippoForm'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {Prisma} from '@prisma/client'
import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'
import {ColStack, RowStack, ReactPdfStyles, Table, Td, Tr, Section} from '@hooks/usePdfGenerator'

export default function NippoFormPdfDocument({
  Genba,
  TheNippoCL,
  TheNippo,
  query,
  columns,
  formData,
  swithchingColIds,
  activeCols,
}) {
  // =============過去の累計を出す=============
  const NippoOnDay = Genba?.TsNippo?.[0]
  let {data: PreviousNippo = []} = usefetchUniversalAPI_SWR(`tsNippo`, `findMany`, {
    where: {tsConstructionId: Genba.id, date: {lt: NippoOnDay?.date}},
    include: QueryBuilder.getInclude({}).tsNippo.include,
  } as Prisma.TsNippoFindManyArgs)

  PreviousNippo = PreviousNippo.filter(d => new TsNippo(d).filterActiveNippo())

  return (
    <Document style={ReactPdfStyles.document}>
      <Page style={ReactPdfStyles.page} size="A4" orientation="portrait">
        <View style={{width: 500, height: 700, margin: `auto`}}>
          <Section>
            <RowStack
              style={{
                fontWeight: `bold`,
                gap: 10,
                fontSize: 16,
                justifyContent: `center`,
              }}
            >
              <Text>{Genba?.TsMainContractor?.name}</Text>
              <Text>{Genba?.name}</Text>
              <Text>{formatDate(TheNippoCL?.Nippo?.date)}</Text>
            </RowStack>
            <ColStack>
              <View>
                <Text style={{color: tail_color.KM.main}}>基本事項登録</Text>
                <Table>
                  {columns
                    .flat()
                    .filter(col => {
                      const switchable = swithchingColIds.some(d => d.id.includes(col.id))
                      if (switchable && !activeCols[col.id]) return null
                      return true
                    })
                    .map((col, idx) => {
                      // const description = col?.form?.descriptionNoteAfter as any

                      const SecondTd = () => {
                        if (col.forSelect) {
                          const options: selectOptions[] = (col?.forSelect?.optionsOrOptionFetcher ?? []) as any[]
                          const values = formData[col.id]
                          const currentValueTotalPrice = values.reduce((acc, cur) => acc + (cur.price ?? 0), 0)
                          return (
                            <ColStack>
                              <RowStack style={{gap: 10}}>
                                <Text style={{color: `black`}}>
                                  {currentValueTotalPrice ? `計:${DH.toPrice(currentValueTotalPrice)}円` : '登録なし'}
                                </Text>
                              </RowStack>
                              <View style={{}}>
                                {new Array(values?.length)
                                  .fill(0)
                                  .filter((d, ArrayIndex) => {
                                    return !values[ArrayIndex]?.trashed
                                  })
                                  .map((_, ArrayIndex) => {
                                    const {value, count} = values[ArrayIndex] ?? {}
                                    const {unit, label} = options.find(d => d.id === value) ?? {}

                                    return (
                                      <RowStack style={{gap: 6}} key={ArrayIndex}>
                                        <Text>・</Text>
                                        <Text>{label}</Text>
                                        <Text>
                                          【{count}】{unit}
                                        </Text>
                                      </RowStack>
                                    )
                                  })}
                              </View>
                            </ColStack>
                          )
                        } else if (col.form?.defaultValue && col.form?.disabled) {
                          return <Text>{col.form.defaultValue}</Text>
                        } else {
                          return <Text>{query.from && formatDate(toUtc(query.from), 'YYYY/MM/DD (ddd)')}</Text>
                        }
                      }

                      return (
                        <Tr key={idx}>
                          <Td style={{width: 150}}>
                            <Text>{col.label}</Text>
                          </Td>
                          <Td style={{width: 350}}>
                            <SecondTd />
                          </Td>
                        </Tr>
                      )
                    })}
                </Table>
              </View>
            </ColStack>
          </Section>
          <Section>
            <ColStack>
              <Text style={{color: tail_color.KM.main}}>その他費用、備考</Text>
              {TheNippo.TsNippoRemarks.length === 0 && <Text>登録なし</Text>}
              <Table>
                {TheNippo.TsNippoRemarks.map((d, idx) => {
                  return (
                    <Tr>
                      <Td style={{width: `50%`}}>
                        <Text>{d.name}</Text>
                      </Td>
                      <Td style={{width: `50%`}}>
                        <Text>{DH.toPrice(d.price)}</Text>
                      </Td>
                    </Tr>
                  )
                })}
              </Table>
            </ColStack>
          </Section>
        </View>
      </Page>
    </Document>
  )
}
