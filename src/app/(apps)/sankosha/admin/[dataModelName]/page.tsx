//classを切り替える

import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'

import {PageBuilder} from '@app/(apps)/sankosha/class/PageBuilder'
import {ColBuilder} from '@app/(apps)/sankosha/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/sankosha/class/QueryBuilder'
import {EasySearchBuilder} from '@app/(apps)/sankosha/class/EasySearchBuilder'
import {ViewParamBuilder} from '@app/(apps)/sankosha/class/ViewParamBuilder'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
const getBuilders = () => ({ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder, EasySearchBuilder})
export default async function DynamicMasterPage(props) {
  const query = await props.searchParams;
  const params = await props.params;
  const {session, scopes} = await initServerComopnent({query})
  const customParams = await parameters({params, query, session, scopes})
  const conf = await Conf({params, session, query, customParams, ...getBuilders()})

  return (
    <EasySearchAtomProvider {...conf}>
      <PropAdjustor {...conf} />
    </EasySearchAtomProvider>
  )
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
            additional: {where: {app: `sankosha`}, payload: {app: `sankosha`}},
          }
        },
      },
      {
        modelNames: [`sankoshaProcess`],
        setParams: async () => {
          return {
            myTable: {
              style: {
                maxHeight: `80vh`,
              },
            },
            additional: {
              orderBy: [{createdAt: `desc`}],
            },
          }
        },
      },
    ],
  })
  return customParams
}
