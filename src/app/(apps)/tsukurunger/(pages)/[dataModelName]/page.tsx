//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'

import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'

import {PageBuilder} from '@app/(apps)/tsukurunger/class/PageBuilder'
import {ColBuilder} from '@app/(apps)/tsukurunger/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/tsukurunger/class/QueryBuilder'
import {EasySearchBuilder} from '@app/(apps)/tsukurunger/class/EasySearchBuilder'
import {ViewParamBuilder} from '@app/(apps)/tsukurunger/class/ViewParamBuilder'
import {getScopes} from 'src/non-common/scope-lib/getScopes'

const getBuilders = () => ({ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder, EasySearchBuilder})
export default async function DataModelPage(props) {
  const query = await props.searchParams;
  const params = await props.params;
  const {session, scopes} = await initServerComopnent({query})
  const customParams = await parameters({params, query, session, scopes})
  const conf = await Conf({params, session, query, customParams, ...getBuilders()})

  return <PropAdjustor {...conf} />
}

const parameters = async (props: {params; query; session; scopes: ReturnType<typeof getScopes>}) => {
  const {params, query, session, scopes} = props
  const {admin} = scopes

  //---------------個別設定-------------
  const customParams = await setCustomParams({
    dataModelName: params.dataModelName,
    variants: [
      {
        modelNames: [`roleMaster`],
        setParams: async () => {
          return {
            PageBuilderExtraProps: {where: {apps: {has: `tsukurunger`}}},
            myTable: {delete: admin, create: admin, update: admin},
          }
        },
      },
      {
        modelNames: [`tsMachinery`, `tsRegularSubcontractor`, `tsSubcontractor`, `tsWorkContent`],
        setParams: async () => {
          return {
            myTable: {
              drag: {},
              pagination: {countPerPage: 50},
            },
          }
        },
      },
      {
        modelNames: [`tsMaterial`],
        setParams: async () => {
          return {
            myTable: {drag: {}, pagination: {countPerPage: 50}},
            additional: {
              orderBy: [
                //
                {unitPrice: 'desc'},
                {materialType: `asc`},
              ],
            },
          }
        },
      },

      {
        modelNames: [`user`],
        setParams: async () => {
          return {
            myTable: {drag: {}},
            additional: {
              where: {
                apps: {has: `tsukurunger`},
              },
              payload: {
                apps: [`tsukurunger`],
              },
            },
          }
        },
      },
      {
        modelNames: [`tsMainContractor`, `tsConstruction`],
        setParams: async () => {
          return {editType: {type: `pageOnSame`}, myTable: {drag: {}}}
        },
      },
    ],
  })
  return customParams
}
