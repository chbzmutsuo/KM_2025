'use client'
import {formatDate} from '@class/Days'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'

import Accordion from '@components/utils/Accordions/Accordion'
import useGlobal from '@hooks/globalHooks/useGlobal'

import React, {Fragment} from 'react'
import {P_GenbaDaySoukenCar, P_SohkenCar} from 'scripts/generatedTypes'

export default function MyPageCC({genbaDay}) {
  const {session, query, PC} = useGlobal()
  const accordionProps = {defaultOpen: true, closable: false}
  const Stack = ({children}) => {
    if (PC) {
      return <R_Stack className={`items-stretch`}>{children}</R_Stack>
    } else {
      return <C_Stack className={`mx-auto w-fit`}>{children}</C_Stack>
    }
  }
  return (
    <div>
      <h1>マイスケジュール</h1>
      <section>
        <Stack>
          {genbaDay.map(gDay => {
            const {Genba, GenbaDayShift, GenbaDaySoukenCar} = gDay

            return (
              <Fragment key={gDay.id}>
                <Paper className={`w-xs min-h-[280px] rounded-lg`}>
                  <R_Stack className={` justify-between`}>
                    <h1>{Genba.name}</h1>
                    <div>{formatDate(gDay.date)}</div>
                  </R_Stack>
                  <div className={`pl-2 text-sm`}>
                    <C_Stack className={`gap-6`}>
                      <section>
                        <Accordion {...{label: `人員`, ...accordionProps}}>
                          {GenbaDayShift.length === 0 && <small> データがありません</small>}
                          {GenbaDayShift?.map((shift, sIdx) => {
                            return (
                              <R_Stack key={sIdx} className={`justify-between gap-1`}>
                                <div>{shift?.User?.name}</div>
                                <R_Stack>
                                  {shift.from && <small>{shift.from}から</small>}
                                  {shift.to && <small>{shift.to}まで</small>}
                                </R_Stack>
                              </R_Stack>
                            )
                          })}
                        </Accordion>
                      </section>
                      <section>
                        <Accordion {...{label: `車両`, ...accordionProps}}>
                          {GenbaDaySoukenCar.length === 0 && <small> データがありません</small>}
                          {GenbaDaySoukenCar?.map((car: P_GenbaDaySoukenCar, sIdx) => {
                            const SohkenCar: P_SohkenCar = car[`SohkenCar`]
                            return (
                              <R_Stack key={sIdx} className={`justify-between gap-1`}>
                                <div>{SohkenCar?.name}</div>
                                {SohkenCar.plate && <small>{SohkenCar.plate}</small>}
                              </R_Stack>
                            )
                          })}
                        </Accordion>
                      </section>
                    </C_Stack>
                  </div>
                </Paper>
              </Fragment>
            )
          })}
        </Stack>
      </section>
      {/* <TableWrapper>
        <TableBordered>
          <tbody>
            {genbaDay.map((gDay: P_GenbaDay) => {
              const {Genba, GenbaDayShift, GenbaDaySoukenCar} = gDay
              return (
                <tr key={gDay.id}>
                  <td>{Genba.name}</td>
                </tr>
              )
            })}
          </tbody>
        </TableBordered>
      </TableWrapper> */}
    </div>
  )
}
