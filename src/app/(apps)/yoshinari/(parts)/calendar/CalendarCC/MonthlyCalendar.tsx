import {monthDatumOptions} from '@app/(apps)/yoshinari/(constants)/getMonthDatumOptions'
import {calendarDataOnMonth} from '@app/(apps)/yoshinari/(pages)/workTypeCalendar/[workTypeId]/page'
import {DateEditor} from '@app/(apps)/yoshinari/(parts)/calendar/CalendarCC/DateEditor'
import {CalendarHolidayClass} from '@app/(apps)/yoshinari/class/CalendarHolidayClass'
import {Days, formatDate} from '@class/Days'
import {ColoredText} from '@components/styles/common-components/colors'
import {R_Stack} from '@components/styles/common-components/common-components'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import useModal from '@components/utils/modal/useModal'
import {getColorStyles} from '@lib/methods/common'

import React, {Fragment} from 'react'

export const MonthlyCalendar = (props: {dayInMonth; workType; calendarDataOnMonth: calendarDataOnMonth}) => {
  const {dayInMonth, workType, calendarDataOnMonth} = props
  const monthStr = formatDate(dayInMonth, 'YYYY年M月')
  const MONTH = Days.getMonthDatum(dayInMonth, monthDatumOptions)
  const weeks = MONTH.getWeeks(`日`, {showPrevAndNextMonth: true})

  const {Modal: DateEditModal, open: dateEditModalOpen, handleOpen, handleClose} = useModal({})

  return (
    <>
      <DateEditModal {...{open: dateEditModalOpen}}>
        <DateEditor {...{dateEditModalOpen, handleClose, workType}} />
      </DateEditModal>

      <div className={`mx-auto w-fit `}>
        <R_Stack className={` justify-between`}>
          <strong>{monthStr}</strong>
          <section>
            <R_Stack className={`w-fit gap-1 text-xs `}>
              {CalendarHolidayClass.holidayTypes.map((type, idx) => {
                const {id, color, label} = type
                return (
                  <Fragment key={idx}>
                    <R_Stack className={` gpa-0.5`}>
                      <ColoredText className={`w-fit`} bgColor={color}>
                        <span>{label}</span>
                        <span>{calendarDataOnMonth[id]?.length}日</span>
                      </ColoredText>
                    </R_Stack>
                  </Fragment>
                )
              })}
            </R_Stack>
          </section>
        </R_Stack>
        <hr />
        <TableWrapper>
          <TableBordered>
            <thead>
              <tr>
                {weeks[0].map((day, idx) => {
                  const dayStr = formatDate(day, 'ddd')

                  return (
                    <th key={idx} className={`text-center`}>
                      {dayStr}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIdx) => {
                return (
                  <tr key={weekIdx}>
                    {week.map((date, dayIdx) => {
                      const dayStr = formatDate(date, 'D(ddd)')

                      //先月26日以降かつ、今月25日まで
                      const onThisMonth = MONTH.firstDayOfMonth <= date && date <= MONTH.lastDayOfMonth

                      // const onThisMonth = true
                      const calendarRecord = calendarDataOnMonth.allHolidayList.find(d => Days.isSameDate(d.date, date))
                      if (onThisMonth) {
                        const isToday = Days.isSameDate(date, new Date())
                        const color = CalendarHolidayClass.holidayTypes.find(d => d.label === calendarRecord?.type)?.color

                        const tdStyle = {
                          ...getColorStyles(color ?? ''),
                          color: color ? `white` : '',
                          border: isToday ? `2px solid yellow` : '',
                        }

                        return (
                          <td key={dayIdx} className={` onHover`} onClick={() => handleOpen({date, calendarRecord})}>
                            <div style={tdStyle} className={`h-[60px] w-[60px] text-xs `}>
                              <div className={`text-center`}>{dayStr}</div>

                              <div className={`!text-center !text-[9px] !font-thin  leading-3`}>{calendarRecord?.remarks}</div>
                            </div>
                          </td>
                        )
                      } else {
                        return (
                          <td key={dayIdx} className={`text-gray-300`}>
                            <div className={`h-[60px] w-[60px] text-sm `}></div>
                          </td>
                        )
                      }
                    })}
                  </tr>
                )
              })}
            </tbody>
          </TableBordered>
        </TableWrapper>
      </div>
    </>
  )
}
