'use client'

import {Circle, NodataPlaceHolder, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {T_LINK} from 'src/cm/components/styles/common-components/links'
import {NestHandler} from 'src/cm/class/NestHandler'

import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {formatDate} from 'src/cm/class/Days'

import {IconBtn, IconBtnForSelect} from 'src/cm/components/styles/common-components/IconBtn'
import {
  convertColIdToModelName,
  getNameFromSelectOption,
  mapAdjustOptionValue,
} from 'src/cm/components/DataLogic/TFs/MyForm/HookFormControl/Parts/MySelect/lib/MySelectMethods-server'
import {isRelationalData} from 'src/cm/class/Fields/lib/methods'
import {cl} from 'src/cm/lib/methods/common'
import ContentPlayer from 'src/cm/components/utils/ContentPlayer'
import {DH} from '@class/DH'
import {colType} from '@cm/types/types'

const getColor = (col, row, value) => {
  let optionObjArr: optionType[] = []
  if (Array.isArray(col?.forSelect?.optionsOrOptionFetcher)) {
    optionObjArr = mapAdjustOptionValue(col?.forSelect?.optionsOrOptionFetcher)
  }

  let capitalizedModelName = convertColIdToModelName({col})
  capitalizedModelName = capitalizedModelName?.charAt(0).toUpperCase() + capitalizedModelName?.slice(1)

  return row?.[capitalizedModelName]?.color ?? optionObjArr?.find(op => op?.id === value)?.color
}

export const defaultFormat = (value, row, col) => {
  try {
    const color = getColor(col, row, value)

    value = NestHandler.GetNestedValue(col.id, row)

    let displayValue = value

    const isEditable = col?.td?.editable

    //チェックボックスの場合
    if (col.type === `json`) {
      return String(JSON.stringify(value))
    }

    if (col.type === `boolean`) {
      return (
        <input
          type={`checkbox`}
          className={cl(` inline-block w-4 `, isEditable ? `` : ` pointer-events-none`)}
          checked={displayValue === true}
          onChange={e => undefined}
        />
      )
    }
    if (col.type === 'file') {
      return (
        <div className={`w-fit py-[2px]`}>
          <ContentPlayer
            styles={{
              main: {...col?.form?.style},
              thumbnail: {...col?.td?.style},
            }}
            src={row[col.id]}
          />
        </div>
      )
    }

    if (isRelationalData(col)) {
      let modelName = convertColIdToModelName({col})
      modelName = modelName?.charAt(0).toUpperCase() + modelName?.slice(1)

      const data = row[modelName]

      displayValue = getNameFromSelectOption({col, record: data}) ?? data?.['name']
    }

    col.type === 'datetime' ? (displayValue = formatDate(value, 'YYYY-MM-DD HH:mm:ss(ddd)')) : ''
    col.type === 'date' ? (displayValue = formatDate(value, '.YY-M-D(ddd)')) : ''

    /**リンクに変換 */

    let result = (
      <>
        <IconBtnForSelect color={color}>{displayValue ?? <NodataPlaceHolder />}</IconBtnForSelect>
        {/* <ColoredText bgColor={color ?? ''}>
          <div className={cl(textAlignMent)}>{displayValue ?? <NodataPlaceHolder />}</div>
        </ColoredText> */}
      </>
    )

    const linkHref = col?.td?.linkTo?.href?.(row)
    if (linkHref) {
      return (result = <T_LINK href={linkHref}>{result}</T_LINK>)
    }

    return result
  } catch (error) {
    return <small className={`text-error-main`}>{error.messages}</small>
  }
}

export const defaultMultipleSelectFormat = (value, row, col: colType) => {
  if (col?.multipleSelect) {
    const {mid = `aqCustomerDealerMidTable`, option = `aqDealerMaster`} = col.multipleSelect.models
    const midTable = row[DH.capitalizeFirstLetter(mid)]
    const rows = midTable.map(mid => {
      const optionName = mid?.[DH.capitalizeFirstLetter(option)]?.name

      return optionName
    })

    return (
      <R_Stack className={`gap-0.5`}>
        {rows.map((d, i) => (
          <IconBtn key={i} {...{className: `text-xs p-0.5`}}>
            {d}
          </IconBtn>
        ))}
      </R_Stack>
    )
  }
  return null
}

export const ChildrenCountFormat = (value, row, col) => {
  const count = NestHandler.GetNestedValue(col.id, row)
  const active = count > 0
  return (
    <div>
      <Circle
        size={20}
        //  active={active} color={active ? 'primary' : `gray`}
        className={`  mx-auto inline-block rounded-full px-2 text-sm`}
      >
        {count}
      </Circle>
    </div>
  )
}
