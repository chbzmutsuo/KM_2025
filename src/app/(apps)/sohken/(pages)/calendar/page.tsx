import {chechIsHoliday} from '@app/(apps)/sohken/api/cron/refreshGoogleCalendar/chechIsHoliday'
import {getHolidayCalendar} from '@app/(apps)/sohken/api/cron/refreshGoogleCalendar/getHolidayCalendar'
import {Days, formatDate, getMidnight, toUtc} from '@class/Days'
import {Center, C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import {CsvTable} from '@components/styles/common-components/CsvTable/CsvTable'
import {T_LINK} from '@components/styles/common-components/links'
import {Paper} from '@components/styles/common-components/paper'
import {TableBordered, TableWrapper} from '@components/styles/common-components/Table'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import MyPopover from '@components/utils/popover/MyPopover'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {HREF} from '@lib/methods/urls'
import {addDays} from 'date-fns'
import React from 'react'

export default async function CalendarPage(props) {
  const query = await props.searchParams
  const tomorrow = addDays(getMidnight(), 1)
  const {whereQuery, redirectPath} = await dateSwitcherTemplate({
    defaultWhere: {from: tomorrow},
    query,
  })

  if (redirectPath) {
    return <Redirector {...{redirectPath}} />
  }

  const from = toUtc(query.from)
  const to = addDays(from, 14)

  const {days} = Days.getIntervalDatum(from, to)

  const {holidays} = await getHolidayCalendar({whereQuery: {gte: from, lte: to}})

  const prev_next_Query = {
    from: addDays(from, -15),
    to: addDays(from, 15),
  }

  console.time(`calendar`)
  const {result: allGenbaTasks} = await fetchUniversalAPI(`genbaTask`, `findMany`, {
    include: {Genba: {include: {PrefCity: true}}},
    where: {from: {gte: from, lte: to}},
  })

  const {result: dayRemarks} = await fetchUniversalAPI(`dayRemarks`, `findMany`, {
    where: {date: {gte: from, lte: to}},
  })

  const {result: userList} = await fetchUniversalAPI(`user`, `findMany`, {
    where: {
      OR: [{app: `sohken`}, {apps: {has: `sohken`}}],
      UserRole: {none: {RoleMaster: {name: `監督者`}}},
    },
  })
  const userCount = userList.length
  console.timeEnd(`calendar`)

  return (
    <Center>
      <Paper className={`mx-auto w-fit p-2`}>
        <C_Stack className={` items-center gap-4`}>
          <section>
            <R_Stack className={` mx-auto w-fit items-center`}>
              基準日: <NewDateSwitcher {...{}} />
            </R_Stack>
          </section>

          <section className={`text-sm`}>
            <C_Stack>
              <div>
                <small>必要人工</small>
                <p>各日付を「初日」とするタスクの必要人工を合計した数です。</p>
              </div>
              <div>
                <small>余力</small>
                <p>アプリ登録ユーザー数から、必要人工を引いた数です。</p>
              </div>
            </C_Stack>
          </section>

          <section>
            <Table {...{holidays, days, dayRemarks, allGenbaTasks, userCount, query}} />
          </section>
          <section>
            <R_Stack className={`w-[200px] justify-between`}>
              <T_LINK href={HREF(`/sohken/calendar`, {from: prev_next_Query.from}, query)}>前へ</T_LINK>
              <T_LINK href={HREF(`/sohken/calendar`, {from: prev_next_Query.to}, query)}>次へ</T_LINK>
            </R_Stack>
          </section>
        </C_Stack>
      </Paper>
    </Center>
  )
}

const Table = ({holidays, days, dayRemarks, allGenbaTasks, userCount, query}) => {
  return (
    <TableWrapper>
      <TableBordered>
        {CsvTable({
          headerRecords: [
            {
              csvTableRow: [
                //
                {cellValue: `日付`},
                {cellValue: `祝日`},
                {cellValue: `人工`},
                {cellValue: `余力`},
                {cellValue: `＃`},
              ],
            },
          ],
          bodyRecords: days
            .filter(d => {
              return chechIsHoliday({holidays, date: d}) === false
            })
            .map((d, dayIdx) => {
              const isHoliday = holidays.find(h => {
                return Days.isSameDate(h.date, d)
              })

              const ninkuCount = dayRemarks.find(dayRemark => Days.isSameDate(dayRemark.date, d))?.ninkuCount

              const GenbaTaskStartingToday = allGenbaTasks.filter(task => Days.isSameDate(task.from, d))
              const requiredNinkuSum = GenbaTaskStartingToday.reduce((acc, task) => {
                return acc + task.requiredNinku
              }, 0)

              const genbaNameList = GenbaTaskStartingToday.map(t => t.Genba.name).join(`, `)

              const href = HREF(`/sohken/genbaDay`, {from: formatDate(d)}, query)

              return {
                csvTableRow: [
                  //
                  {
                    cellValue: (
                      <T_LINK href={href} className={`t-link`}>
                        {formatDate(d, 'YYYY-MM-DD(ddd)')}
                      </T_LINK>
                    ),
                  },

                  {
                    cellValue: isHoliday?.summary,
                  },
                  {
                    cellValue: (
                      <MyPopover
                        {...{
                          mode: `click`,
                          button: requiredNinkuSum,
                        }}
                      >
                        <Paper>{genbaNameList}</Paper>
                      </MyPopover>
                    ),
                  },

                  {cellValue: userCount - requiredNinkuSum},
                  {
                    cellValue:
                      ninkuCount === undefined ? '' : ninkuCount === 0 ? '0' : ninkuCount >= 0 ? ninkuCount : `▲${ninkuCount}`,
                    style: {width: 100, textAlign: 'right'},
                  },
                ],
              }
            }),
        }).ALL()}
      </TableBordered>
    </TableWrapper>
  )
}
