import {DisplayedState} from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/TableCell/childrens/DisplayedState'
import ColOption from 'src/cm/components/DataLogic/TFs/MyTable/Thead/ColOption/ColOption'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {CssString} from 'src/cm/components/styles/cssString'
import {cl} from 'src/cm/lib/methods/common'
import React from 'react'
import EditableForm from 'src/cm/components/DataLogic/TFs/MyTable/TableHandler/Tbody/TableCell/childrens/RawForm'
import {DH} from 'src/cm/class/DH'
import {Fields} from '@class/Fields/Fields'

const TdContent = ({dataModelName, col, record, value, mutateRecords}) => {
  const isEditableCell = col?.td?.editable && ![`file`].includes(DH.switchColType({type: col.type}))

  const showLabel = col?.isMain === undefined && Fields.doShowLabel(col)

  const Label = () => {
    return (
      <span className={`leading-[8px]`} style={{...col?.td?.style}}>
        <ColOption {...{col, dataModelName}}>{col.label}</ColOption>
      </span>
    )
  }

  const Main = (
    <div>
      {isEditableCell ? (
        EditableForm({...{col, record, dataModelName, mutateRecords}})
      ) : (
        <DisplayedState {...{col, record, value}} />
      )}
    </div>
  )
  const editableCellClass = isEditableCell ? ` w-fit !cursor-pointer rounded-sm  bg-gray-50 ring-gray-400` : ''
  const cStackClass = cl(` gap-y-0  bg-transparent  `, editableCellClass)

  return (
    <C_Stack className={cStackClass}>
      {showLabel && <Label />}
      <R_Stack id="tdContentRStack" className={CssString.fontSize.cell}>
        {Main}
      </R_Stack>
    </C_Stack>
  )
}

export default TdContent
