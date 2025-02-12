import {CHIKOKU_SOUTAI_GAISHUTSU_FIELDS} from '@app/(apps)/yoshinari/constants/chikoku-soutai-gaishutsu'
import {Days, formatDate} from '@class/Days'
import {R_Stack} from '@components/styles/common-components/common-components'

export const getComponents = ({YoshinariUserClass: YoshinariUserClass, date}) => {
  const smallTextClass = `text-xs  leading-3 text-gray-600 `
  if (!date) {
    throw new Error(`date is not defined`)
  }

  const workRecordOnDate = YoshinariUserClass.workRecordsByDate.find(d => {
    const match = Days.isSameDate(d.date, date)
    return match
  })

  const {overWorkRequestList = [], holidayRequest, privateCarUsageRequestList} = workRecordOnDate?.ApprovedApRequests ?? {}

  const privateCar = () => {
    if (privateCarUsageRequestList.length > 0) {
      return (
        <div className={`${smallTextClass}`}>
          {privateCarUsageRequestList.length > 0 && (
            <R_Stack className={` ${smallTextClass}  items-start justify-start gap-0.5 no-underline`}>
              <span>私有車:</span>
              <div>{privateCarUsageRequestList.map((d, idx) => d.cf[`走行距離(km)`].value)}km</div>
            </R_Stack>
          )}
        </div>
      )
    }

    return null
  }
  const overwork = () => {
    if (overWorkRequestList.length > 0) {
      return (
        <div className={`${smallTextClass}`}>
          {overWorkRequestList.length > 0 && (
            <R_Stack className={` ${smallTextClass}  items-start justify-start gap-0.5 no-underline`}>
              <span>時間外:</span>
              <div>
                {overWorkRequestList
                  .map((d, idx) => {
                    return `${formatDate(d?.from, 'H:mm')}~${formatDate(d?.to, 'H:mm')}`
                  })
                  .join(`, `)}
              </div>
            </R_Stack>
          )}
        </div>
      )
    }

    return null
  }

  const holiday = () => {
    if (holidayRequest) {
      const type = holidayRequest.cf.休暇区分.value
      const FROM_TO = type.includes(`1日`) ? null : (
        <>
          <span>{formatDate(holidayRequest.from, 'H:mm')}</span>
          <span>~</span>
          <span>{formatDate(holidayRequest.to, 'HH:mm')}</span>
        </>
      )
      return (
        <R_Stack className={`${smallTextClass}  gap-0.5`}>
          <span>{type}</span>
          {FROM_TO}
        </R_Stack>
      )
    }
    return null
  }

  const CHIKOKU_SOUTAI_GAISHUTSU = Object.fromEntries(
    CHIKOKU_SOUTAI_GAISHUTSU_FIELDS.map(d => {
      const componentName = d.name

      const request = workRecordOnDate?.ApprovedApRequests[d.ApprovedRequestListKey]?.[0]

      return [
        componentName,
        () => {
          if (request) {
            return (
              <div className={`${smallTextClass}`}>
                <R_Stack className={`${smallTextClass}  gap-0.5`}>
                  <span>{d.label}:</span>
                  <span>{formatDate(request.from, 'H:mm')}</span>
                  <span>~</span>
                  <span>{formatDate(request.to, 'HH:mm')}</span>
                </R_Stack>
              </div>
            )
          } else {
            return <></>
          }
        },
      ]
    })
  )

  return {
    overwork,
    holiday,
    ...CHIKOKU_SOUTAI_GAISHUTSU,
    privateCar,
  } as {
    overwork: () => JSX.Element
    holiday: () => JSX.Element
    chikoku: () => JSX.Element
    soutai: () => JSX.Element
    gaishutsu: () => JSX.Element
    privateCar: () => JSX.Element
  }
}
