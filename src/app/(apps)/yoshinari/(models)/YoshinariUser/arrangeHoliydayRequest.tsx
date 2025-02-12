import {from_to_min} from '@app/(apps)/yoshinari/(models)/YoshinariUser/mapYsWorkRecordOrigin'
import {workingType} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
import {Days} from '@class/Days'
import {TimeClass} from '@class/TimeClass'

export default function arrangeHoliydayRequest({
  date,
  Break,
  workStatus,
  isHoliday,
  HolidayCl,
  rules,
  holidayRequest,
  isLegalHoliday,
}) {
  let yukyu: from_to_min = {
    from: undefined,
    to: undefined,
    mins: 0,
  }

  let workingType = getWorkTypeStr({workStatus, isHoliday, isLegalHoliday})

  //休暇リクエスト

  if (holidayRequest) {
    const {休暇区分} = holidayRequest?.cf
    const {from, to, name} = holidayRequest ?? {}
    if (休暇区分.value) {
      workingType = 休暇区分.value
    }

    //============有給関連の計算============
    if (休暇区分.value === `有給（時間給）` || 休暇区分.value === `有給休暇（1日休）`) {
      if (休暇区分.value === `有給（時間給）`) {
        // 有給がある日は、所定時間 - 有給時間とし、分単位で計算

        const mins = TimeClass.toMin(to.getTime() - from.getTime())
        const overlap: from_to_min = Days.calculateOverlappingTimeRange({
          range1: {
            start: Break.from,
            end: Break.to,
          },
          range2: {
            start: from,
            end: to,
          },
        }) ?? {from: undefined, to: undefined, mins: 0}

        yukyu = {from, to, mins: mins - overlap.mins}
      } else if (休暇区分.value === `有給休暇（1日休）`) {
        const mins = rules.workMins
        yukyu = {from, to, mins}
      }
    }
  }

  return {
    workingType,
    holidayRequest,
    yukyu,
  }
}

const getWorkTypeStr = ({workStatus, isHoliday, isLegalHoliday}) => {
  let workingType: workingType = ''

  if (workStatus) {
    workingType = workStatus
  } else if (isHoliday) {
    if (isLegalHoliday) {
      workingType = '休日(法定)'
    } else {
      workingType = '休日(法定外)'
    }
  }

  return workingType
}
