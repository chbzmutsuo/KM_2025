'use client'
import {Fields} from '@cm/class/Fields/Fields'

import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from '@heroicons/react/20/solid'

import React from 'react'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Days, formatDate, toUtc} from '@class/Days'
import {addMonths, addDays} from 'date-fns'

export default function useDateSwitcherFunc(props) {
  const {query, addQuery, toggleLoad, width} = useGlobal()

  const additionalDefaultValue = Object.fromEntries(props?.additionalCols?.map(col => [col.id, query[col.id]]) ?? [])

  const addMinusMonth = async (plus = 1) => {
    const currentMonth = new Date(latestFormData[`from`])
    const month = addMonths(currentMonth, plus)
    if (Days.isDate(month)) {
      await switchMonth({month, ...additionalDefaultValue})
    }
  }
  const addMinusDate = async (plus = 1) => {
    const currentDate = new Date(latestFormData[`from`])
    const date = addDays(currentDate, plus)
    if (Days.isDate(date)) {
      await switchDate({date, ...additionalDefaultValue})
    }
  }

  const columnsBase = getColumnBase({addMinusMonth, addMinusDate, ...props})
  const {noValue, from, to, defaultValue} = getQueryInfo({query})

  const columns = Fields.transposeColumns([...columnsBase, ...(props.additionalCols ?? [])])

  const FormHook = useBasicFormProps({
    columns,
    formData: {...defaultValue, ...additionalDefaultValue},
    onFormItemBlur: async ({value, name, id, e, newlatestFormData: data, ReactHookForm}) => {
      const isEqual = Object.keys(data).every(key => {
        const value1 = formatDate(data[key])
        const value2 = query[key]
        return value1 === value2
      })

      if (isEqual === false) {
        toggleLoad(() => {
          name === 'month' ? switchMonth(data) : switchFromTo(data)
        })
      }
    },
  })

  const {latestFormData, ReactHookForm} = FormHook

  const getAdditionalPayload = data => Object.fromEntries(props.additionalCols?.map(col => [col.id, data[col.id]]) ?? [])

  const switchMonth = data => {
    const month = data.month
    if (!month) {
      addQuery({month: undefined, ...getAdditionalPayload(data)})
      return
    }

    const {firstDayOfMonth, lastDayOfMonth} = Days.getMonthDatum(toUtc(month))
    ReactHookForm.setValue('from', firstDayOfMonth)
    ReactHookForm.setValue('to', lastDayOfMonth)
    ReactHookForm.setValue('month', null)
    const newQuery = {}
    newQuery['from'] = formatDate(firstDayOfMonth)
    newQuery['to'] = formatDate(lastDayOfMonth)
    newQuery['month'] = formatDate(month)
    addQuery({...newQuery, ...getAdditionalPayload(data)})
  }
  const switchDate = data => {
    const date = data.date
    if (!date) {
      addQuery({date: undefined, ...getAdditionalPayload(data)})
      return
    }

    ReactHookForm.setValue('from', date)
    ReactHookForm.setValue('to', date)
    const newQuery = {}
    newQuery['from'] = formatDate(date)
    newQuery['to'] = formatDate(date)

    addQuery({...newQuery, ...getAdditionalPayload(data)})
  }

  const switchFromTo = data => {
    const newQuery = {}
    Object.keys(data).forEach(key => {
      const value = data[key]
      if (value && Days.isDate(value)) {
        newQuery[key] = formatDate(value)
      } else {
        newQuery[key] = undefined
      }
    })

    addQuery({...newQuery, ...getAdditionalPayload(data)})
  }
  return {
    noValue,
    FormHook,
    from,
    to,
    switchMonth,
    addMinusMonth,
    switchFromTo,
  }
}

const getColumnBase = ({
  addMinusMonth,
  addMinusDate,
  selectPeriod = false,
  selectMonth = false,
  monthOnly = false,
  yearOnly = false,
}) => {
  let columnsBase: any = {
    from: {
      id: 'from',
      label: 'から',
      type: 'date',

      form: {
        register: {
          required: '日付を指定してください',
        },
        reverseLabelTitle: true,
      },
    },
    to: {
      id: 'to',
      label: 'まで',
      type: 'date',
      form: {
        reverseLabelTitle: true,
        register: {
          validate: (value, formValue) => {
            return value && formValue?.from && new Date(value) <= new Date(formValue?.from)
              ? '終了日は開始日より後の日付を指定してください'
              : undefined
          },
        },
      },
    },
    month: {
      //   id: 'month',
      //   label: (
      //     <R_Stack className={`gap-0`}>
      //       <ChevronDoubleLeftIcon className={`onHover text-primary-main w-7`} onClick={() => addMinusMonth(-1)} />
      //       月指定
      //       <ChevronDoubleRightIcon className={`onHover text-primary-main w-7`} onClick={() => addMinusMonth(1)} />
      //     </R_Stack>
      //   ),
      //   type: 'month',
      //   form: {
      //     style: {width: 100},
      //     reverseLabelTitle: true,
      //   },
    },
  }

  if (!selectPeriod) {
    delete columnsBase.to
    columnsBase.from.label = '基準日'
    columnsBase.from.surroundings = {
      form: {
        left: <ChevronDoubleLeftIcon className={`text-primary-main w-7`} onClick={() => addMinusDate(-1)} />,
        right: <ChevronDoubleRightIcon className={`text-primary-main w-7`} onClick={() => addMinusDate(1)} />,
      },
    }
  }
  if (!selectMonth) {
    delete columnsBase.month
  }

  if (monthOnly) {
    columnsBase.from.label = ''
    columnsBase.from.surroundings = {
      form: {
        left: <ChevronDoubleLeftIcon className={`text-primary-main w-7`} onClick={() => addMinusMonth(-1)} />,
        right: <ChevronDoubleRightIcon className={`text-primary-main w-7`} onClick={() => addMinusMonth(1)} />,
      },
    }

    columnsBase.from.type = 'month'
    columnsBase.from.form.showResetBtn = false
    columnsBase.from.form.style = {width: 140}
  }

  if (yearOnly) {
    columnsBase.from.label = ''
    // columnsBase.from.surroundings = {
    //   form: {
    //     left: <ChevronDoubleLeftIcon className={`text-primary-main w-7`} onClick={() => addMinusMonth(-1)} />,
    //     right: <ChevronDoubleRightIcon className={`text-primary-main w-7`} onClick={() => addMinusMonth(1)} />,
    //   },
    // }

    columnsBase.from.type = 'year'
    columnsBase.from.form.showResetBtn = false
    columnsBase.from.form.style = {width: 140}
  }

  if (selectMonth) {
    columnsBase.month.id = 'month'
    columnsBase.month.label = '月指定'
    columnsBase.month.surroundings = {
      form: {
        left: <ChevronDoubleLeftIcon className={` text-primary-main w-7 cursor-pointer`} onClick={() => addMinusMonth(-1)} />,
        right: <ChevronDoubleRightIcon className={` text-primary-main w-7 cursor-pointer`} onClick={() => addMinusMonth(1)} />,
      },
    }

    columnsBase.month.type = 'month'
    columnsBase.month.form = {}
    columnsBase.month.form.showResetBtn = false
    // columnsBase.month.form.style = {width: 140}
  }
  columnsBase = Object.values(columnsBase)

  return columnsBase
}

const getQueryInfo = ({query}) => {
  const noValue = !query.from && !query.to
  let from: any = null
  let to: any = null
  if (query.from) {
    from = new Date(query.from)
  } else if (query.month && noValue) {
    from = Days.getMonthDatum(new Date(query.month)).firstDayOfMonth
  }

  if (query.to) {
    to = new Date(query.to)
  } else if (query.month && noValue) {
    to = Days.getMonthDatum(new Date(query.month)).lastDayOfMonth
  }

  const defaultValue = {from, to}

  return {
    noValue,
    from,
    to,
    defaultValue,
  }
}
