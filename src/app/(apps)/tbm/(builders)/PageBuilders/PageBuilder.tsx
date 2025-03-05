'use client'

import {tbmBase} from '@app/(apps)/tbm/(builders)/PageBuilders/tbmBase'
import {tbmOperationGroup} from '@app/(apps)/tbm/(builders)/PageBuilders/tbmOperationGroup/tbmOperationGroup'
import {useGlobalPropType} from '@hooks/globalHooks/useGlobal'
import {Fields} from '@class/Fields/Fields'
import GlobalIdSelector from '@components/GlobalIdSelector/GlobalIdSelector'

const Title = ({children}) => {
  return (
    <div className={`mb-[10px]`}>
      <strong>{children}</strong>
    </div>
  )
}

export class PageBuilder {
  static tbmBase = tbmBase
  static tbmOperationGroup = tbmOperationGroup

  static getGlobalIdSelector = (props: {useGlobalProps: useGlobalPropType}) => {
    const {useGlobalProps} = props

    const {admin, getTbmScopes} = useGlobalProps.accessScopes()
    const {userId, tbmBaseId} = getTbmScopes()

    const columns = new Fields([
      {id: 'g_tbmBaseId', label: '営', forSelect: {}},
      {id: 'g_userId', label: 'ド', forSelect: {}},
    ]).transposeColumns()

    if (admin) {
      return () => <GlobalIdSelector {...{useGlobalProps, columns}} />
    }
  }
}
