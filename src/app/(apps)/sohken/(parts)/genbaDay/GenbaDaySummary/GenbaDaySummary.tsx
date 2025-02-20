'use client'
import {C_Stack} from '@cm/components/styles/common-components/common-components'

import useGlobal from '@hooks/globalHooks/useGlobal'


import React from 'react'
import {jotai_GDS_DND, useJotai} from '@hooks/useJotai'
import {GENBA_DAY_STATUS} from 'src/non-common/(chains)/getGenbaScheduleStatus/GENBA_DAY_STATUS'
import {Wrapper} from '@components/styles/common-components/paper'
import Basics from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/Main'
import Sub from '@app/(apps)/sohken/(parts)/genbaDay/GenbaDaySummary/Sub'

const GenbaDaySummary = (props: {editable; records?: any; GenbaDay; allShiftBetweenDays: any}) => {
  const {editable = true, records, GenbaDay} = props

  const {Genba, GenbaDayTaskMidTable, active} = GenbaDay

  const {toggleLoad, PC, pathname} = useGlobal()
  const [GDS_DND, setGDS_DND] = useJotai(jotai_GDS_DND)

  const commonProps = {GDS_DND, setGDS_DND, GenbaDay}

  const theStatus = GENBA_DAY_STATUS.find(d => d.label === (GenbaDay.status || '未完了'))

  // const stuffAllocated = GenbaDay.GenbaDayShift.length > 0

  return (
    <div style={{width: 420}} className={`relative w-full`}>
      {/* {!active && (
        <Alert
          color={`red`}
          className={cl(
            stuffAllocated ? '!text-red-600' : '!text-orange-400',
            ` absolute right-2 top-2 w-fit  rotate-12 text-lg font-bold`
          )}
        >
          {stuffAllocated ? '要確認(人員配置済)' : '要確認'}
        </Alert>
      )} */}

      <div className={`${active ? '' : 'opacity-30'}`}>
        <C_Stack className={`gap-0.5`}>
          <Wrapper className={` !bg-transparent`}>
            <Basics
              {...{
                pathname,
                Genba,
                GenbaDayTaskMidTable,
                GenbaDay,
                editable,
                theStatus,
                toggleLoad,
              }}
            />
          </Wrapper>

          <Wrapper className={` !bg-transparent`}>
            <Sub {...{records, GenbaDay, editable, commonProps, PC}} />
          </Wrapper>
        </C_Stack>
      </div>
    </div>
  )
}

export default GenbaDaySummary

export type genbaScheduleStatusString = '完了' | '不要' | '済' | '未完了'
