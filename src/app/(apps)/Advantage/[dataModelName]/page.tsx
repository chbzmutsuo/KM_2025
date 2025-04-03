//classを切り替える
import {PageBuilder} from '@app/(apps)/Advantage/(utils)/class/PageBuilder'
import {ColBuilder} from '@app/(apps)/Advantage/(utils)/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/Advantage/(utils)/class/QueryBuilder'
import {ViewParamBuilder} from '@app/(apps)/Advantage/(utils)/class/ViewParamBuilder'
import {EasySearchBuilder} from '@app/(apps)/Advantage/(utils)/class/EasySearchBuilder'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
// import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'
// import { getScopes } from 'src/non-common/scope-lib/getScopes'

import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
// import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'

const getBuilders = () => ({ColBuilder, ViewParamBuilder, PageBuilder, QueryBuilder, EasySearchBuilder})
export default async function DynamicMasterPage(props) {
  const query = await props.searchParams
  const params = await props.params
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
  const {admin} = scopes

  //---------------個別設定-------------
  const customParams = await setCustomParams({
    dataModelName: params.dataModelName,

    variants: [
      {
        modelNames: ['student-lesson'],
        setParams: async () => ({
          dataModelName: 'lesson',
        }),
      },
      {
        modelNames: ['coach'],
        setParams: async () => ({
          dataModelName: 'user',
          additional: {
            where: {
              OR: [{membershipName: 'コーチ'}],
            },
          },
          ColBuilderExtraProps: {membershipName: 'コーチ'},
        }),
      },
      {
        modelNames: ['student'],
        setParams: async () => ({
          dataModelName: 'user',
          additional: {where: {OR: [{membershipName: '生徒'}]}},
          ColBuilderExtraProps: {membershipName: '生徒'},
        }),
      },

      {
        modelNames: ['systemChatRoom'],
        setParams: async () => ({
          myTable: {create: true, update: true, delete: admin ? true : false},
        }),
      },
      {
        modelNames: [`bigCategory`],
        setParams: async () => {
          return {myTable: {drag: {}}}
        },
      },
    ],
  })
  return customParams
}
