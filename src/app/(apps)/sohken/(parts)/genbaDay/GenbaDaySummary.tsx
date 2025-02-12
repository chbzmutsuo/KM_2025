'use client'
import {C_Stack, Circle, R_Stack} from '@cm/components/styles/common-components/common-components'

import useGlobal from '@hooks/globalHooks/useGlobal'

import {DistributionListByModel} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/DistributionListByModel'
import {LabelValue} from '@components/styles/common-components/ParameterCard'

import {Days, formatDate} from '@class/Days'
import {T_LINK} from '@components/styles/common-components/links'

import {GenbaDayTaskMidTable} from '@prisma/client'
import {ColoredText} from '@components/styles/common-components/colors'

import {DH} from '@class/DH'

import {PlusCircleIcon} from '@heroicons/react/20/solid'
import {GenbaCl} from '@app/(apps)/sohken/class/GenbaCl'
import React from 'react'
import {jotai_GDS_DND, useJotai} from '@hooks/useJotai'
import {Button} from '@components/styles/common-components/Button'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {colorVariants} from '@components/styles/common-components/colorVariants'
import {GENBA_DAY_STATUS} from 'src/non-common/(chains)/getGenbaScheduleStatus/GENBA_DAY_STATUS'
import {useGenbaDayCardEditorModalGMF} from '@app/(apps)/sohken/hooks/useGenbaDayCardEditorModalGMF'
import {Wrapper} from '@components/styles/common-components/paper'

const GenbaDaySummary = (props: {editable; records?: any; GenbaDay; allShiftBetweenDays: any}) => {
  const {editable = true, records, GenbaDay, allShiftBetweenDays} = props

  const GenbaDayCardEditModal_HK = useGenbaDayCardEditorModalGMF()
  const {GenbaDayShift, GenbaDaySoukenCar, Genba, GenbaDayTaskMidTable, allAssignedNinkuTillThisDay, allRequiredNinku, active} =
    GenbaDay

  const {ninkuList} = GetNinkuList({GenbaDay, theDay: GenbaDay.date})

  const {toggleLoad, PC} = useGlobal()
  const [GDS_DND, setGDS_DND] = useJotai(jotai_GDS_DND)

  const commonProps = {GDS_DND, setGDS_DND, GenbaDay}
  const styling = {}
  const {floorThisPlay} = new GenbaCl(GenbaDay.Genba)

  const LinkComponent = editable ? T_LINK : ({children}) => <>{children}</>

  const theStatus = GENBA_DAY_STATUS.find(d => d.label === (GenbaDay.status || '未完了'))

  const ArrayData = GenbaDayShift?.map(v => {
    const {User, from, to, important} = v

    const shiftsOnOtherGembaOnSameDate = allShiftBetweenDays
      .filter(shift => {
        return (
          shift.userId === User.id &&
          Days.isSameDate(shift.GenbaDay.date, GenbaDay.date) &&
          shift.GenbaDay.genbaId !== GenbaDay.genbaId &&
          shift.from
        )
      })
      .sort((a, b) => {
        const aTime = new Date(formatDate(a.GenbaDay.date) + ' ' + a.from)
        const bTime = new Date(formatDate(b.GenbaDay.date) + ' ' + b.from)
        return aTime.getTime() - bTime.getTime()
      })

    const nextShift = shiftsOnOtherGembaOnSameDate.find(shift => {
      const date1 = new Date(formatDate(GenbaDay.date) + ' ' + from)
      const date2 = new Date(formatDate(shift.GenbaDay.date) + ' ' + shift.from)

      return from && shift.from && date1 <= date2
    })

    const currentShiftDisplay = (
      <R_Stack className={`gap-[1px]`}>
        <span className={`  font-extrabold`}>{User?.name}: </span>

        {from && (
          <>
            <span>{from}</span>
            <small>から</small>
          </>
        )}
        {to && (
          <>
            <span>{to}</span>
            <small>まで</small>
          </>
        )}
      </R_Stack>
    )

    const nextShiftIndex = nextShift ? records.findIndex(genbaday => genbaday.id === nextShift?.genbaDayId) : null

    const nextShiftDisplay = nextShift ? (
      <R_Stack className={`gap-[1px]`}>
        <span>➡︎</span>
        <Circle width={18}>{nextShiftIndex + 1}</Circle>
        {nextShift?.from && (
          <>
            <span>{nextShift?.from}</span>
            <small>から</small>
          </>
        )}

        {nextShift?.to && (
          <>
            <span>{nextShift?.to}</span>
            <small>まで</small>
          </>
        )}
      </R_Stack>
    ) : null

    return {
      ...v,
      name: (
        <div className={important ? 'texwh bg-yellow-500' : ''}>
          <div>{currentShiftDisplay}</div>
          <div>{nextShiftDisplay}</div>
        </div>
      ),
    }
  }).sort((a, b) => {
    return b.User.sortOrder - a.User.sortOrder
  })

  const stuffAllocated = GenbaDay.GenbaDayShift.length > 0

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
          <section>
            <Wrapper className={` !bg-transparent`}>
              <div className={` relative`}>
                <div>
                  <div>
                    <LabelValue {...{styling, label: `日付`}}>{formatDate(GenbaDay.date, `MM月DD日(ddd)`)}</LabelValue>
                  </div>
                  <div>
                    <R_Stack className={`gap-y-0.5`}>
                      <LabelValue {...{styling, label: `現場`}}>
                        <C_Stack className={`items-start gap-2 md:flex-row `}>
                          <span>{Genba.defaultStartTime}</span>
                          <LinkComponent {...{href: `/sohken/genba/${Genba.id}`}}>
                            {Genba.name}
                            {`(${floorThisPlay})`}
                          </LinkComponent>
                          <span>{Genba?.PrefCity?.city}</span>
                        </C_Stack>
                      </LabelValue>
                    </R_Stack>
                  </div>

                  <div>
                    <LabelValue {...{styling, label: `連絡`}}>{GenbaDay.remarks}</LabelValue>
                  </div>
                  <div>
                    <TaskWithNinku
                      {...{
                        GenbaDay,
                        editable,
                        setGenbaDayCardEditModal: GenbaDayCardEditModal_HK.setGMF_OPEN,
                        GenbaDayTaskMidTable,
                        ninkuList,
                      }}
                    />
                  </div>
                  <div>
                    <LabelValue {...{styling, label: `その他`}}>{GenbaDay.subTask}</LabelValue>
                  </div>
                </div>
                <div className={`  flex justify-end`}>
                  <Button
                    size="sm"
                    color={theStatus?.color as colorVariants}
                    onClick={async () => {
                      //完了フラグの切り替え
                      toggleLoad(
                        async () => {
                          await fetchUniversalAPI(`genbaDay`, `update`, {
                            where: {id: GenbaDay.id},
                            finished: !GenbaDay.finished,
                          })
                        },
                        {refresh: true, mutate: true}
                      )
                    }}
                  >
                    {theStatus?.label}
                  </Button>
                </div>
              </div>
            </Wrapper>
          </section>

          <section>
            <Wrapper className={` !bg-transparent`}>
              <div className={`items-stretch ${PC ? 'row-stack' : 'col-stack'} `}>
                <DistributionListByModel
                  {...{
                    editable,

                    ...commonProps,
                    baseModelName: `user`,
                    RelationalModel: `genbaDayShift`,
                    iconBtn: {text: `人員配置`, color: `yellow`},
                    ArrayData,
                  }}
                />
                <DistributionListByModel
                  {...{
                    editable,

                    ...commonProps,
                    baseModelName: `sohkenCar`,
                    RelationalModel: `genbaDaySoukenCar`,
                    iconBtn: {text: `車両`, color: `blue`},
                    ArrayData: GenbaDaySoukenCar.map(v => ({...v, name: v?.SohkenCar?.name})),
                  }}
                />
              </div>
            </Wrapper>
          </section>
        </C_Stack>
      </div>
    </div>
  )
}

export default GenbaDaySummary

export type genbaScheduleStatusString = '完了' | '不要' | '済' | '未完了'

const GetNinkuList = ({GenbaDay, theDay}: {GenbaDay; theDay: string}) => {
  const PreviousShiftByDateObj = {}
  const allShiftForGenba = GenbaDay.Genba.GenbaDayShift

  allShiftForGenba.forEach(shift => {
    const date = shift.GenbaDay.date
    const isBefore = new Date(date).getTime() <= new Date(theDay).getTime()

    const taskMidTableOnGenba: GenbaDayTaskMidTable[] = shift.GenbaDay.GenbaDayTaskMidTable

    const isSameTaskAssigned = taskMidTableOnGenba.some(mid => {
      return GenbaDay.GenbaDayTaskMidTable.some(mid2 => {
        return mid.genbaTaskId === mid2.genbaTaskId
      })
    })

    if (isBefore && isSameTaskAssigned) {
      const dateKey = formatDate(date)
      DH.makeObjectOriginIfUndefined(PreviousShiftByDateObj, dateKey, [])
      PreviousShiftByDateObj[dateKey].push(shift)
    }

    // }
  })

  const ninkuList = Object.keys(PreviousShiftByDateObj).map(dateKey => {
    const shifts = PreviousShiftByDateObj[dateKey]
    return {_count: {id: shifts.length}}
  })
  return {ninkuList}
}

const TaskWithNinku = ({GenbaDay, editable, setGenbaDayCardEditModal, GenbaDayTaskMidTable, ninkuList}) => {
  const handleOnClick = ({taskMidTable = undefined}) =>
    setGenbaDayCardEditModal({
      taskMidTable,
      genbaId: GenbaDay.Genba.id,
      genbaDayId: GenbaDay.id,
    })

  return (
    <div>
      <LabelValue
        {...{
          styling: {styles: {wrapper: {fontSize: 14, width: `100%`}}},
          label: `タスク`,
        }}
      >
        <R_Stack className={`flex-nowrap  gap-1`}>
          {editable && (
            <button onClick={() => handleOnClick({})} className={`t-link`}>
              <PlusCircleIcon className={`w-6`} />
            </button>
          )}

          <C_Stack className={`w-full  `}>
            {GenbaDayTaskMidTable.map((d, i) => {
              const {name, from, to, requiredNinku, color} = d.GenbaTask

              return (
                <R_Stack
                  className={`gap-0.5`}
                  key={i}
                  {...{
                    onClick: () => handleOnClick({taskMidTable: d}),
                  }}
                >
                  <ColoredText {...{bgColor: color, className: ` text-sm px-1`}}>{name}</ColoredText>
                  <R_Stack className={`gap-0.5`}>
                    <span>人工:</span>
                    <strong>{requiredNinku}</strong>
                    <span>{ninkuList.map(d => `- ${d._count.id}`)}</span>
                  </R_Stack>
                </R_Stack>
              )
            })}
          </C_Stack>
        </R_Stack>
      </LabelValue>
    </div>
  )
}
