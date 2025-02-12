import {DH} from 'src/cm/class/DH'
import {colType} from '@cm/types/types'
import {sqlResponse} from '@class/SqlBuilder/useRawSql'
import {fetchAlt} from '@lib/methods/api-fetcher'
import {apiPath} from '@lib/methods/common'

export const converDataForClient = (data, col) => {
  return DH.convertDataType(data, col.type, 'client')
}

export const isRelationalData = (col: colType) => {
  return col?.id?.includes('Id') && !Array.isArray(col?.forSelect?.optionsOrOptionFetcher)
}
export const judgeColType = (col: colType) => {
  if (isRelationalData(col)) {
    return 'selectId'
  } else {
    return col?.type ?? 'text'
  }
}

export const fetchRawSql = async ({sql}) => {
  const res: sqlResponse = await fetchAlt(`${apiPath}/prisma/raw`, {sql})
  return res
}
