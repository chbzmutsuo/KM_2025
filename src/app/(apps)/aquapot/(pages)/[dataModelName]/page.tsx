//classを切り替える

import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {setCustomParams} from '@cm/components/DataLogic/TFs/Server/SetCustomParams'
import {getScopes} from 'src/non-common/scope-lib/getScopes'
import {Conf} from '@components/DataLogic/TFs/Server/Conf'
import PropAdjustor from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import EasySearchAtomProvider from '@components/DataLogic/TFs/ClientConf/Providers/EasySearchAtomProvider'
import {PageBuilder} from '@app/(apps)/aquapot/(class)/Pagebuilder/PageBuilder'
import {ColBuilder} from '@app/(apps)/aquapot/(class)/colBuilder/ColBuilder'
import {QueryBuilder} from '@app/(apps)/aquapot/(class)/QueryBuilder'
import {EasySearchBuilder} from '@app/(apps)/aquapot/(class)/EasySearchBuilder'
import {ViewParamBuilder} from '@app/(apps)/aquapot/(class)/ViewParamBuilder'
import {AqCustomerCl} from '@app/(apps)/aquapot/(models)/AqCustomerCl'

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
        modelNames: [`user`],
        setParams: async () => {
          return {
            // myTable: {header: {}},
            additional: {
              where: {apps: {has: `aquapot`}},
              payload: {apps: [`aquapot`]},
            },
          }
        },
      },
      {
        modelNames: [`aqProduct`],
        setParams: async () => ({
          additional: {orderBy: [{productCode: 'asc'}]},
          myTable: {},
        }),
      },

      {
        modelNames: [`aqCustomer`],
        setParams: async () => {
          const customerFilterWhere = AqCustomerCl.Filter.aqCustomer.getPrismaWhereByQuery({query})

          return {
            editType: {type: `pageOnSame`},

            additional: {
              orderBy: [{customerNumber: 'desc'}],
              where: {...customerFilterWhere},
            },
          }
        },
      },
      {
        modelNames: [`aqCustomerRecord`],
        setParams: async () => {
          const customerRecordFilterWhere = AqCustomerCl.Filter.aqCustomerRecord.getPrismaWhereByQuery({query})
          return {
            editType: {type: `pageOnSame`},
            additional: {
              where: {...customerRecordFilterWhere},
            },
          }
        },
      },
      // {
      //   modelNames: [`aqSaleRecord`],
      //   setParams: async () => {
      //     const {firstDayOfMonth, lastDayOfMonth} = Days.getMonthDatum(new Date())
      //     const {redirectPath, whereQuery} = await getWhereQuery({
      //       query,
      //       defaultQuery: {
      //         from: firstDayOfMonth,
      //         to: lastDayOfMonth,
      //       },
      //     })

      //     return {
      //       useSql: {
      //         getPrismaRowsBySqlArgs: {
      //           parentModel: `AqSaleRecord`,
      //           models: [`AqCustomer`, `AqSaleCart`, `AqProduct`, `AqPriceOption`],
      //           where: '',
      //           query,
      //         },
      //       },
      //       myTable: {
      //         pagination: {countPerPage: 10},
      //         create: false,
      //         update: false,
      //         delete: false,
      //         header: true,
      //       },
      //       editType: {type: `pageOnSame`},
      //       redirectPath,
      //       easySearchExtraProps: {whereQuery},
      //     }
      //   },
      // },
    ],
  })
  return customParams
}
