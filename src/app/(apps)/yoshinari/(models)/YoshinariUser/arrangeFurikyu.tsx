import {from_to_min} from '@app/(apps)/yoshinari/(models)/YoshinariUser/mapYsWorkRecordOrigin'

const arrangeFurikyu = ({date, holidayRequest, kyujitsuShukkin, work, Break}) => {
  const furikyuUsed = holidayRequest?.cf[`休暇区分`]?.value === `振替休日`

  let furikyu: from_to_min = {from: undefined, to: undefined, mins: 0}
  let furide: from_to_min = {from: undefined, to: undefined, mins: 0}

  if (furikyuUsed) {
    const {from, to, mins} = holidayRequest

    const furikaeMins = Number((to.getTime() - from.getTime()) / 1000 / 60)

    furikyu = {
      from,
      to,
      mins: furikaeMins ?? 0,
      // mins: (furikaeMins ?? 0) - (Break.mins ?? 0), 3月3日(月) 削除：振替休日から休憩は引かない
    }
  } else if (kyujitsuShukkin && work) {
    furide = work
  }

  return {
    furikyu,
    furide,
  }
}

export default arrangeFurikyu
