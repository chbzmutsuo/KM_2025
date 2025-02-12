//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'

import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {PageBuilder} from '@app/(apps)/yoshinari/class/PageBuilder'
import {ColBuilder} from '@app/(apps)/yoshinari/class/ColBuilder'
import {QueryBuilder} from '@app/(apps)/yoshinari/class/QueryBuilder'
import {EasySearchBuilder} from '@app/(apps)/yoshinari/class/EasySearchBuilder'
import {ViewParamBuilder} from '@app/(apps)/yoshinari/class/ViewParamBuilder'
import {userForSelect} from '@app/(apps)/yoshinari/constants/forSelectConfig'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {getUserYukyuAgg} from '@app/(apps)/yoshinari/(sql)/getUserYukyuAgg'
import {YoshinariUserClass} from '@app/(apps)/yoshinari/(models)/YoshinariUser/YoshinariUser'
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
  //---------------個別設定-------------
  const customParams = await setCustomParams({
    dataModelName: params.dataModelName,
    variants: [
      {
        modelNames: [`user`],
        setParams: async () => {
          const {yukyuGroupedBy} = await getUserYukyuAgg()

          const {YoshinariUsers} = await YoshinariUserClass.getUserAndYukyuHistory({userId: undefined})

          const userListWithYukyu = YoshinariUsers.map(user => {
            const userClass = new YoshinariUserClass(user)
            userClass.takeInYukyuAgg({yukyuGroupedBy})
            return userClass.yukyuAgg
          })
          return {
            additional: {
              where: userForSelect.where,
              payload: {apps: [`yoshinari`]},
            },
            myTable: {drag: true},
            editType: {type: `pageOnSame`},
            ColBuilderExtraProps: {userListWithYukyu},
          }
        },
      },

      {
        modelNames: [`ysApprovement`],
        setParams: async () => {
          return {
            myTable: {delete: false, create: false},
            additional: {where: {userId: session?.id}, orderBy: [{createdAt: `desc`}]},
          }
        },
      },
      {
        modelNames: [`workType`, `payedLeaveType`],
        setParams: async () => {
          return {
            myTable: {drag: {}},
            editType: {type: `pageOnSame`},
          }
        },
      },
    ],
  })
  return customParams
}
