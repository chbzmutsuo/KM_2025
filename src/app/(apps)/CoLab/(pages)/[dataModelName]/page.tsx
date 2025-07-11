//classを切り替える

import {setCustomParams} from '@components/DataLogic/helpers/SetCustomParams'

import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {PageBuilder} from '@app/(apps)/CoLab/(builders)/PageBuilder'
import {ColBuilder} from '@app/(apps)/CoLab/(builders)/ColBuilder'
import {QueryBuilder} from '@app/(apps)/CoLab/(builders)/QueryBuilder'

import {ViewParamBuilder} from '@app/(apps)/CoLab/(builders)/ViewParamBuilder'
import {getMasterPageCommonConfig} from '@components/DataLogic/helpers/getMasterPageCommonConfig'
const getBuilders = () => ({ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder})
export default async function DynamicMasterPage(props) {
  return getMasterPageCommonConfig({
    nextPageProps: props,
    parameters,
    ColBuilder,
    ViewParamBuilder,
    PageBuilder,
    QueryBuilder,
  })
}

const parameters = async (props: {params; query; session; scopes: ReturnType<typeof getScopes>}) => {
  const {params, query, session, scopes} = props

  //---------------個別設定-------------
  const customParams = await setCustomParams({
    dataModelName: params.dataModelName,
    variants: [
      {
        modelNames: [`user`],
        setParams: async () => {
          return {
            additional: {
              payload: [],
              where: {apps: {has: ``}},
            },
          }
        },
      },
    ],
  })
  return customParams
}
