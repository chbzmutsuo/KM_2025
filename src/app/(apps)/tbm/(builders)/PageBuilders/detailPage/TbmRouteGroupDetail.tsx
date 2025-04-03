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

export default function TbmRouteGroupDetail(props: DetailPagePropType) {
  const {useGlobalProps} = props
  const {query} = useGlobalProps

  const {data: calendar = []} = usefetchUniversalAPI_SWR(`tbmRouteGroupCalendar`, `findMany`, {
    where: {tbmRouteGroupId: props.formData?.id},
    orderBy: {date: 'asc'},
  })

  const theMonth = toUtc(query.month ?? query.from)
  const theYear = theMonth.getFullYear()

  const {firstDateOfYear, lastDateOfYear, getSpecifiedMonthOnThisYear} = Days.getYearDatum(theYear)

  const days = Days.getDaysBetweenDates(firstDateOfYear, lastDateOfYear)

  const defaultSelectedDays = calendar.filter(c => c.holidayType === '稼働').map(c => c.date)

  const tbmRouteGroupId = props.formData?.id

  return (
    <R_Stack className={` items-start gap-20 p-8`}>
      <div>
        <TextBlue className={` text-2xl font-bold `}>便基本設定</TextBlue>
        <MyForm {...props}></MyForm>
      </div>
      {!!props?.formData?.id && (
        <div>
          <TextBlue className={` text-2xl font-bold `}>配車予定</TextBlue>
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

                    const unique_tbmRouteGroupId_date = {
                      tbmRouteGroupId,
                      date: day,
                    }

                    return {
                      model: 'tbmRouteGroupCalendar',
                      method: 'upsert',
                      queryObject: {
                        where: {unique_tbmRouteGroupId_date},
                        ...createUpdate({...unique_tbmRouteGroupId_date, holidayType: isSelected ? '稼働' : ''}),
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
