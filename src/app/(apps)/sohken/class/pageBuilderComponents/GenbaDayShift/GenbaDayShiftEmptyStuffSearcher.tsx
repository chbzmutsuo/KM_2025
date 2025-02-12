import {toUtc} from '@class/Days'

import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import usefetchUniversalAPI_SWR from '@hooks/usefetchUniversalAPI_SWR'

import {DetailPagePropType} from '@cm/types/types'

const GenbaDayShiftEmptyStuffSearcher = (props: DetailPagePropType) => {
  const {query, PC} = props.useGlobalProps

  if (!PC) return null

  return (
    <div>
      {PC && (
        <NewDateSwitcher {...{selectPeriod: true, additionalCols: [{id: `genbaId`, label: `現場`, forSelect: {}, form: {}}]}} />
      )}
    </div>
  )
}

export default GenbaDayShiftEmptyStuffSearcher

const useAbailableUsers = ({query}) => {
  const isReady = query?.from && query?.to
  const from = isReady ? toUtc(query.from).toISOString() : undefined
  const to = isReady ? toUtc(query.to).toISOString() : undefined

  const dateWhere = {
    gte: from,
    lte: to,
  }

  const {data: genbaDay} = usefetchUniversalAPI_SWR(`genbaDay`, `findMany`, {
    where: {
      date: dateWhere,
    },
    include: {
      GenbaDayShift: {},
    },
  })

  const {data: Users} = usefetchUniversalAPI_SWR(`user`, `findMany`, {
    where: {OR: [{app: `sohken`}, {apps: {has: `sohken`}}]},
  })

  const availableUsers = !isReady
    ? []
    : Users?.filter(user => {
        const hasShift = genbaDay?.some(day => day.GenbaDayShift.some(shift => shift.userId === user.id))
        return !hasShift
      }) ?? []

  return {
    availableUsers,
  }
}
