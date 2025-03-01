'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {Days, getMidnight, toUtc} from '@class/Days'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import React, {useEffect} from 'react'

export default function RouteDisplay({tbmBase}) {
  const useGlobalProps = useGlobal()
  const {query} = useGlobalProps
  const {selectedBase, setselectedBase, selectedRouteGroup, setselectedRouteGroup} = useSelectedBase()
  useEffect(() => {
    setselectedBase(tbmBase)
  }, [tbmBase])

  const {firstDayOfMonth: yearMonth} = Days.getMonthDatum(query.from ? toUtc(query.from) : getMidnight())

  return (
    <R_Stack className={` items-start`}>
      <ChildCreator
        {...{
          ParentData: tbmBase,
          models: {parent: `tbmBase`, children: `tbmRouteGroup`},
          additional: {
            include: {
              TbmMonthlyConfigForRouteGroup: {where: {yearMonth: {equals: yearMonth}}},
            },
          },
          columns: ColBuilder.tbmRouteGroup({
            useGlobalProps,
            ColBuilderExtraProps: {
              selectedBase,
              setselectedBase,
              selectedRouteGroup,
              setselectedRouteGroup,
              yearMonth,
            },
          }),

          useGlobalProps,
        }}
      />
    </R_Stack>
  )
}
