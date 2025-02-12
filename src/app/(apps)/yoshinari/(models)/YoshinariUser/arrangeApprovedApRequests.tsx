import {Days} from '@class/Days'

export default function arrangeApprovedApRequests({ApprovedRequestListByGroup, CHIKOKU_SOUTAI_GAISHUTSU_FIELDS, date}) {
  const tikoku_soutai_gaishutsu_request = Object.fromEntries(
    CHIKOKU_SOUTAI_GAISHUTSU_FIELDS.map(field => {
      const requests = ApprovedRequestListByGroup[field.ApprovedRequestListKey].filter(request => {
        return Days.isSameDate(request.cf?.[`日付`].value, date)
      })
      const key = field.ApprovedRequestListKey
      return [key, requests]
    })
  )

  const ApprovedApRequests = {
    holidayRequest: ApprovedRequestListByGroup[`holidayRequest`].find(request => {
      return Days.isSameDate(request.cf?.[`日付`].value, date)
    }),
    overWorkRequestList: ApprovedRequestListByGroup[`overWorkRequestList`].filter(request => {
      return Days.isSameDate(request.cf?.[`日付`].value, date)
    }),
    privateCarUsageRequestList: ApprovedRequestListByGroup[`privateCarUsageRequestList`].filter(request => {
      return Days.isSameDate(request.cf?.[`日付`].value, date)
    }),
    tikokuRequestList: tikoku_soutai_gaishutsu_request[`tikokuRequestList`] ?? [],
    sotaiRequestList: tikoku_soutai_gaishutsu_request[`sotaiRequestList`] ?? [],
    gaishutsuRequestList: tikoku_soutai_gaishutsu_request[`gaishutsuRequestList`] ?? [],
  }

  const getTikokuSoutaiGaishutsu = ({tikoku_soutai_gaishutsu_request}) => {
    const fields = CHIKOKU_SOUTAI_GAISHUTSU_FIELDS.map(field => {
      const data = tikoku_soutai_gaishutsu_request?.[field.ApprovedRequestListKey]?.[0]

      if (data) {
        const {from, to, mins} = data ?? {}
        const result = {...field, from, to, mins}
        return result
      }
    }).filter(Boolean)

    const toObj = Object.fromEntries(
      fields.map(d => {
        const key = d?.name
        const value = d
        return [
          key,
          value ?? {
            from: undefined,
            to: undefined,
            mins: 0,
          },
        ]
      })
    )

    return toObj as {
      chikoku: {from: Date; to: Date; mins: number}
      soutai: {from: Date; to: Date; mins: number}
      gaishutsu: {from: Date; to: Date; mins: number}
    }
  }

  // ==================遅刻、早退、外出について==============
  const {chikoku, soutai, gaishutsu} = getTikokuSoutaiGaishutsu({tikoku_soutai_gaishutsu_request})
  return {
    ApprovedApRequests,
    tikoku_soutai_gaishutsu_request,
    chikoku,
    soutai,
    gaishutsu,
  }
}
