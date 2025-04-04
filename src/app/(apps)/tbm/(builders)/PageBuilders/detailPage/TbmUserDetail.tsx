'use client'

import {R_Stack} from '@components/styles/common-components/common-components'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {DetailPagePropType} from '@cm/types/types'

import CalendarSetter from '@app/(apps)/tbm/(pages)/DriveSchedule/CalendarSetter'
import {Days, toUtc} from '@class/Days'
import {TextBlue} from '@components/styles/common-components/Alert'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'
import {createUpdate, toastByResult} from '@lib/methods/api-fetcher'
import {doTransaction} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'

export default function TbmUserDetail(props: DetailPagePropType) {
  const {useGlobalProps} = props
  const {query} = useGlobalProps

  const userId = props.formData?.id
  const {data: calendar = []} = usefetchUniversalAPI_SWR(`userWorkStatus`, `findMany`, {where: {userId}, orderBy: {date: 'asc'}})

  const theMonth = toUtc(query.month ?? query.from)
  const theYear = theMonth.getFullYear()

  const {firstDateOfYear, lastDateOfYear, getSpecifiedMonthOnThisYear} = Days.getYearDatum(theYear)

  const days = Days.getDaysBetweenDates(firstDateOfYear, lastDateOfYear)

  const defaultSelectedDays = calendar.filter(c => c.holidayType === '稼働').map(c => c.date)

  return (
    <R_Stack className={` items-start gap-20 p-8`}>
      <div>
        <TextBlue className={` text-2xl font-bold `}>便基本設定</TextBlue>
        <MyForm {...props}></MyForm>
      </div>
      {!!props?.formData?.id && (
        <div>
          <TextBlue className={` text-2xl font-bold `}>稼働予定</TextBlue>
          <CalendarSetter
            {...{
              days: days,
              defaultSelectedDays: defaultSelectedDays,
              onConfirm: async ({selectedDays}) => {
                if (!confirm('変更を反映しますか？')) return

                // toggleLoad(async () => {
                const res = await doTransaction({
                  transactionQueryList: days.map(day => {
                    const isSelected = selectedDays.some(d => Days.isSameDate(d, day))

                    const unique_userId_date = {
                      userId,
                      date: day,
                    }

                    return {
                      model: 'userWorkStatus',
                      method: 'upsert',
                      queryObject: {
                        where: {unique_userId_date},
                        ...createUpdate({...unique_userId_date, workStatus: isSelected ? '稼働' : null}),
                      },
                    }
                  }),
                })
                toastByResult(res)
              },
            }}
          />
        </div>
      )}
    </R_Stack>
  )
}
