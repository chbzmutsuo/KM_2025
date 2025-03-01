import {rules, YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {MappeadApRequest} from '@class/ApRequestClass/ApRequestClass'
import {formatDate} from '@class/Days'
import {TimeClass} from '@class/TimeClass'
import {ApRequest, ApRequestTypeMaster} from '@prisma/client'
import {addMinutes} from 'date-fns'

export const filterAndMapApRequest = (props: {label; apRequest; yoshinariUser: YoshinariUserClass}) => {
  const {label, yoshinariUser, apRequest} = props

  const result = apRequest
    .filter((request: ApRequest & {ApRequestTypeMaster: ApRequestTypeMaster}) => {
      return request.ApRequestTypeMaster.name === label
    })
    .map(request => {
      const date = request.cf[`日付`].value
      const {rules} = YoshinariUserClass.getUserWorkRules({user: yoshinariUser.user, today: date})
      const {日付, 休暇区分, 開始時刻, 終了時刻} = request.cf ?? {}

      let name = undefined

      let from = new Date(formatDate(日付.value) + ' ' + 開始時刻?.value)
      let to = new Date(formatDate(日付.value) + ' ' + 終了時刻?.value)

      // ===================始業前、就業前はカット=============

      if ([`遅刻`, `早退`, `外出`].includes(label)) {
        name = 休暇区分?.value
        from = new Date(
          Math.max(
            new Date(formatDate(日付.value) + ' ' + rules.work.startTime).getTime(),
            new Date(formatDate(日付.value) + ' ' + 開始時刻?.value).getTime()
          )
        )
        to = new Date(
          Math.min(
            new Date(formatDate(日付.value) + ' ' + rules.work.endTime).getTime(),
            new Date(formatDate(日付.value) + ' ' + 終了時刻?.value).getTime()
          )
        )
      } else {
        name = label
      }

      if ([`時間外勤務`].includes(label)) {
        const minutesAfterWorkEnd = 30
        const workEndTime = new Date(formatDate(日付.value) + ' ' + rules.work.endTime)
        const workEndTimePlusMinutes = addMinutes(workEndTime, minutesAfterWorkEnd)

        const eveningWork = from >= workEndTime

        if (eveningWork) {
          from = new Date(Math.max(new Date(from).getTime(), workEndTimePlusMinutes.getTime()))
        }
        // if (formatDate(from) === '2025-02-06') {
        //   console.log({
        //     from: formatDate(from, 'YYYY/MM/DD(ddd) HH:mm'),
        //     to: formatDate(to, 'YYYY/MM/DD(ddd) HH:mm'),
        //     test: formatDate(日付.value) + ' ' + 開始時刻?.value,
        //   })
        // }
      }

      if (from > to) {
        to.setDate(to.getDate() + 1)
      }

      const mins = TimeClass.toMin(to.getTime() - from.getTime())
      request[`name`] = name
      request[`from`] = from
      request[`to`] = to
      request[`mins`] = mins
      request[`rules`] = rules
      // console.debug({
      //   mins,
      //   from: formatDate(from, 'YYYY/MM/DD HH:mm'),
      //   to: formatDate(to, 'YYYY/MM/DD HH:mm'),
      // })
      return request
    })
  return result as (MappeadApRequest & {
    name: string
    from: Date
    to: Date
    mins: number
    rules: rules
  })[]
}
