import {formatDate, getMidnight, toUtc} from '@class/Days'
import {HREF} from '@lib/methods/urls'

export const monthDatumOptions = {
  getFrom: monthDt => {
    const dt = new Date(formatDate(monthDt).split(`-`))
    dt.setMonth(dt.getMonth() - 1)
    dt.setDate(26)

    return dt
  },
  getTo: monthDt => {
    const dt = new Date(formatDate(monthDt).split(`-`))
    dt.setDate(25)
    return dt
  },
}

export const get_gte_lt_from_month = (month: Date) => {
  const gte = toUtc(month.getFullYear(), month.getMonth(), 26)
  const lte = toUtc(month.getFullYear(), month.getMonth() + 1, 25)
  const whereQuery = {gte, lte}

  return whereQuery
}

export const getYoshinariRedirectPath = ({query}) => {
  const month = toUtc(query.month)

  let redirectPath
  if (!query.month) {
    // const monthDt = new Date()
    let monthDt = new Date(Math.max(getMidnight().getTime(), getMidnight(new Date()).getTime()))

    if (monthDt.getDate() < 26) {
      redirectPath = HREF(``, {month: monthDt.toISOString().slice(0, 7)}, query)
    } else if (monthDt.getDate() >= 26) {
      monthDt = toUtc(monthDt.getFullYear(), monthDt.getMonth() + 1, monthDt.getDate())

      redirectPath = HREF(``, {month: monthDt.toISOString().slice(0, 7)}, query)
    }
  }

  const whereQuery = get_gte_lt_from_month(month)
  return {redirectPath, whereQuery}
}
