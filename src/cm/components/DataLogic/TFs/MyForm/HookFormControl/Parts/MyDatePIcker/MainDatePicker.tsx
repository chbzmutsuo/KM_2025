import React, {useState} from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja' // import the Japanese locale
import {Days, formatDate} from 'src/cm/class/Days'
import {anyObject} from '@cm/types/types'
import {cl} from 'src/cm/lib/methods/common'
import {Button} from '@components/styles/common-components/Button'
import {C_Stack} from '@components/styles/common-components/common-components'

registerLocale('ja', ja)

const MainDatePicker = React.forwardRef((props: anyObject, ref) => {
  const {ControlStyle, col, formProps, setIsOpen, field, useResetValue, selectedDate, setSelectedDate, handleDateChange} = props

  let varingProps: anyObject = {
    placeholderText: '日付を入力',
    showTimeSelect: false,
  }

  const {timeIntervals = 5} = col?.datePicker ?? {}

  const [isValid, setisValid] = useState(true)
  switch (col.type) {
    case 'month':
      {
        varingProps = {
          ...varingProps,
          placeholderText: '月を入力',
          showTimeSelect: false,
          showMonthYearPicker: true,
        }
      }
      break

    case 'year':
      {
        varingProps = {
          ...varingProps,
          placeholderText: '年を入力',
          showYearPicker: true,
        }
      }
      break
  }

  const timeFormat = Days.getTimeFormt(col.type).timeFormatForDateFns
  const displayProps = {
    showIcon: false,
    timeCaption: '時刻',
    locale: 'ja',
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(2200, 11, 31),
    formatDate: timeFormat,
    timeFormat: 'HH:mm',
    timeIntervals,
    showMonthDropdown: true,
    showYearDropdown: true,

    withPortal: true,
    fixedHeight: true,
  }

  const customStyleProps = {
    className: cl('custom-datepicker', formProps.className),
    dayClassName: (date: Date) => {
      let dateClass = ` w-[4px] `
      formatDate(date, 'ddd') === '土' && (dateClass += `  `)
      formatDate(date, 'ddd') === '日' && (dateClass += `  `)
      return dateClass
    },

    timeClassName: (time: Date) => {
      const timeClassName = `text-center  `
      const affix = time.getHours() > 12 ? 'text-success-main' : 'text-error-main'
      return timeClassName + affix
    },
  }

  const dateProps = {
    selected: Days.isDate(selectedDate) ? selectedDate : null,
    onChange: handleDateChange,
    onBlur: e => {
      setisValid(true)
    },
    onChangeRaw: e => {
      if (!e.target.value) {
        setisValid(true)
        return
      }

      const newValue = e.target.value ?? ''
      const eightDigit = newValue?.replace(/-|\s/, '')
      const toDate = Days.getDateFromEightDigitNumber(eightDigit)
      const isDate = Days.isDate(toDate) && String(eightDigit).length === 8
      if (isDate) {
        handleDateChange(toDate)
      }
      setisValid(isDate)
    },
  }

  return (
    <C_Stack className={` `}>
      <Button
        type="button"
        size="sm"
        color={`red`}
        onClick={() => {
          useResetValue({col, field})
          setIsOpen(false)
        }}
      >
        取り消し
      </Button>

      <DatePicker inline {...displayProps} {...varingProps} {...dateProps} {...customStyleProps} dropdownMode="select" />
      {isValid === false && (
        <div className={` t-alert  absolute left-1/2 top-12 w-full -translate-x-1/2 text-center`}>
          <p>YYYY-MM-DDまたは8桁の数字で入力</p>
          <ul>
            <li></li>
          </ul>
        </div>
      )}
    </C_Stack>
  )
})

export default MainDatePicker
