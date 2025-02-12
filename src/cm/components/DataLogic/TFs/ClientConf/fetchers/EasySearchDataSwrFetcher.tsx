'use server'
import {getEasySearchPrismaDataOnServer} from 'src/cm/class/builders/QueryBuilderVariables'
import {getEasySearchBtnCountData} from '@lib/server-actions/common-server-actions/serverEasySearch'
import {easySearchPrismaDataOnServer} from '@components/DataLogic/TFs/ClientConf/fetchers/ES_Atom_Fetcher'

export const EasySearchDataSwrFetcher = async ({dataModelName, additional, easySearchObject, query, searchQueryAnd}) => {
  const {queryArrays, availableEasySearchObj} = getEasySearchPrismaDataOnServer({
    query,
    dataModelName,
    easySearchObject,
    additionalWhere: additional?.where,
    searchQueryAnd,
  })

  const array = await getEasySearchBtnCountData({queryArrays})

  const result: easySearchPrismaDataOnServer = {
    dataCountObject: Object.fromEntries(array),
    availableEasySearchObj,
  }

  return result
}
