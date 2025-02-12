import Payment from '@app/(apps)/Advantage/(utils)/components/lesson/LessonMainDisplay/PaymentStatus/Payment'
import SimpleTable from '@cm/components/utils/SimpleTable'
import {Center, C_Stack} from '@components/styles/common-components/common-components'
import {cl} from '@cm/lib/methods/common'
export const PaymentStatus = ({LessonLog, useGlobalProps, settickets, isPaid, isPassed}) => {
  return (
    <C_Stack className={`gap-10`}>
      <SimpleTable
        {...{
          style: {width: 'fit-content'},
          headerArr: ['支払い状況', 'ステータス'],
          bodyArr: [
            [
              <Center className={cl(`text-white`, isPaid ? 'bg-success-main' : 'bg-error-main')}>{isPaid ? '済' : '未'}</Center>,
              <Center className={cl(`text-white`, isPassed ? 'bg-success-main' : 'bg-sub-main')}>
                {isPassed ? '合格' : '進行中'}
              </Center>,
            ],
          ],
        }}
      />
      <Payment {...{LessonLog, useGlobalProps, settickets}} />
    </C_Stack>
  )
}
