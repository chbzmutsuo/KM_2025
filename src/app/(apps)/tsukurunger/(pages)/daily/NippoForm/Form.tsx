'use client'

import {selectOptions} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/NippoForm'

import TsSelect from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/TsSelect/TsSelect'

import {formatDate, toUtc} from '@class/Days'

import {colType} from '@cm/types/types'

export const Form = (props: {col: colType; nippoOptions; formData; setformData; useGlobalProps}) => {
  const {col, nippoOptions, formData, setformData, useGlobalProps} = props
  const {query, accessScopes} = useGlobalProps
  const {subConRole} = accessScopes().getTsukurungerScopes()
  const controlClass = ` bg-gray-300 min-h-[24px]     rounded-sm `
  const options: selectOptions[] = (col?.forSelect?.optionsOrOptionFetcher ?? []) as any[]
  const values = formData[col.id]

  if (col.forSelect) {
    return <TsSelect {...{subConRole, useGlobalProps, nippoOptions, controlClass, values, options, col, formData, setformData}} />
  } else if (col.form?.defaultValue && col.form?.disabled) {
    return col.form.defaultValue
  } else {
    return <>{query.from && formatDate(toUtc(query.from), 'YYYY/MM/DD (ddd)')}</>
  }
}
