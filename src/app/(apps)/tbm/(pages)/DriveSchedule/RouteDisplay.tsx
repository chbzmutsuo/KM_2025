'use client'
import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {PageBuilder} from '@app/(apps)/tbm/(builders)/PageBuilders/PageBuilder'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {R_Stack} from '@components/styles/common-components/common-components'
import useGlobal from '@hooks/globalHooks/useGlobal'
import React, {useEffect} from 'react'

export default function RouteDisplay({tbmBase}) {
  const {selectedBase, setselectedBase, selectedRouteGroup, setselectedRouteGroup} = useSelectedBase()
  const useGlobalProps = useGlobal()
  useEffect(() => {
    setselectedBase(tbmBase)
  }, [tbmBase])

  return PageBuilder.tbmBase.right()
  return (
    <R_Stack className={` items-start`}>
      <ChildCreator
        {...{
          ParentData: tbmBase,
          models: {parent: `tbmBase`, children: `tbmRouteGroup`},
          columns: ColBuilder.tbmRouteGroup({
            useGlobalProps,
            ColBuilderExtraProps: {
              selectedBase,
              setselectedBase,
              selectedRouteGroup,
              setselectedRouteGroup,
            },
          }),

          useGlobalProps,
        }}
      />
    </R_Stack>
  )
}
