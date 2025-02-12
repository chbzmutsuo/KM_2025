import {from_to_min} from '@app/(apps)/yoshinari/(models)/YoshinariUser/mapYsWorkRecordOrigin'

const arrangeFurikyu = ({holidayRequest, kyujitsuShukkin, work, Break}) => {
  const furikyuUsed = holidayRequest?.cf[`休暇区分`]?.value === `振替休日`

  let furikyu: from_to_min = {from: undefined, to: undefined, mins: 0}
  let furide: from_to_min = {from: undefined, to: undefined, mins: 0}

  if (furikyuUsed) {
    const {from, to, mins} = holidayRequest

    const furikaeMins = Number((to.getTime() - from.getTime()) / 1000 / 60)

    furikyu = {from, to, mins: furikaeMins - Break.mins}
  } else if (kyujitsuShukkin && work) {
    furide = work
  }

  return {
    furikyu,
    furide,
  }
}

export default arrangeFurikyu
