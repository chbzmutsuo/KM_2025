'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {TbmRouteGroupUpsertController} from '@app/(apps)/tbm/(builders)/PageBuilders/TbmRouteGroupUpsertController'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {Days, getMidnight, toUtc} from '@class/Days'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Prisma} from '@prisma/client'
import React, {useEffect} from 'react'

export default function RouteDisplay({tbmBase, whereQuery}) {
  const useGlobalProps = useGlobal()
  const {query} = useGlobalProps
  const {selectedBase, setselectedBase, selectedRouteGroup, setselectedRouteGroup} = useSelectedBase()
  useEffect(() => {
    setselectedBase(tbmBase)
  }, [tbmBase])

  const {firstDayOfMonth: yearMonth} = Days.getMonthDatum(query.from ? toUtc(query.from) : getMidnight())

  const include: Prisma.TbmRouteGroupInclude = {
    TbmBase: {},
    TbmDriveSchedule: {
      where: {
        finished: true,
        date: whereQuery,
      },
    },
    Mid_TbmRouteGroup_TbmCustomer: {
      include: {
        TbmCustomer: true,
      },
    },
    Mid_TbmRouteGroup_TbmProduct: {
      include: {
        TbmProduct: true,
      },
    },
    TbmMonthlyConfigForRouteGroup: {where: {yearMonth: {equals: yearMonth}}},
  }
  return (
    <R_Stack className={` items-start`}>
      <ChildCreator
        {...{
          ParentData: tbmBase,
          models: {parent: `tbmBase`, children: `tbmRouteGroup`},
          additional: {include: include, orderBy: [{code: `asc`}]},
          myForm: {create: TbmRouteGroupUpsertController},
          myTable: {style: {width: `90vw`, maxHeight: `80vh`}},
          columns: ColBuilder.tbmRouteGroup({
            useGlobalProps,
            ColBuilderExtraProps: {
              showMonthConfig: true,
              yearMonth,
            },
          }),

          useGlobalProps,
        }}
      />
    </R_Stack>
  )
}
