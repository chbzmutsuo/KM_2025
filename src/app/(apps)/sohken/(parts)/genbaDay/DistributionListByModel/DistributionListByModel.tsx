'use client'
import {C_Stack} from '@cm/components/styles/common-components/common-components'

import {Z_INDEX} from '@cm/lib/constants/constants'

import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'
import {DSBM_Label} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/DSBM_Label'
import {DSBM_List} from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/DSBM_List'

export const DistributionListByModel = ({
  editable,
  GDS_DND,
  setGDS_DND,
  GenbaDay,
  ArrayData,
  baseModelName,
  RelationalModel,
  iconBtn,
}) => {
  const ShiftEditFormModalGMF = useShiftEditFormModal()
  const highlightedStyle = {zIndex: Z_INDEX.modal + 100}
  const isSelectedType = GDS_DND.picked?.itemType === RelationalModel
  const globalFormStateCommonProps = {baseModelName, selectedData: null, RelationalModel, GenbaDay}

  const common = {
    highlightedStyle,
    globalFormStateCommonProps,
    editable,
    RelationalModel,
    isSelectedType,
    ShiftEditFormModalGMF,
    ...{GDS_DND, setGDS_DND, GenbaDay},
  }

  return (
    <C_Stack className={`w-[200px]  gap-0.5  overflow-auto   rounded border p-1 text-[14px] leading-5`}>
      <DSBM_Label {...common} {...{iconBtn}} />
      <DSBM_List {...common} {...{ArrayData}} />
    </C_Stack>
  )
}
