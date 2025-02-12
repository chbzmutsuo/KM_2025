//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'

import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {PageBuilder} from '@app/(apps)/layout-mapping/builders/PageBuilder'
import {ColBuilder} from '@app/(apps)/layout-mapping/builders/ColBuilder'
import {QueryBuilder} from '@app/(apps)/layout-mapping/builders/QueryBuilder'
import {EasySearchBuilder} from '@app/(apps)/layout-mapping/builders/EasySearchBuilder'
import {ViewParamBuilder} from '@app/(apps)/layout-mapping/builders/ViewParamBuilder'
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
        modelNames: [`lmLocation`],
        setParams: async () => {
          return {
            editType: {type: `pageOnSame`},
            myForm: {},
          }
        },
      },
      {
        modelNames: [`pdf`],
        setParams: async () => {
          return {
            myForm: {},
          }
        },
      },
      {
        modelNames: [`user`],
        setParams: async () => {
          return {}
        },
      },
    ],
  })
  return customParams
}
