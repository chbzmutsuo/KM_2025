import {HistoryTable} from '@app/(apps)/aquapot/(pages)/inventory/HistoryTable'
import {InventoryRegisterCC} from '@app/(apps)/aquapot/(pages)/inventory/inventoryRegisterCC'
import {C_Stack, R_Stack} from '@components/styles/common-components/common-components'
import NewDateSwitcher from '@components/utils/dates/DateSwitcher/NewDateSwitcher'
import Redirector from '@components/utils/Redirector'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {dateSwitcherTemplate} from '@lib/methods/redirect-method'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

export default async function Page(props) {
  const query = await props.searchParams
  const params = await props.params
  const {session, scopes} = await initServerComopnent({query})

  const {whereQuery, redirectPath} = await dateSwitcherTemplate({query})
  if (redirectPath) return <Redirector {...{redirectPath}} />
  const {result: history} = await fetchUniversalAPI(`aqInventoryRegister`, `findMany`, {
    where: {date: whereQuery},
    include: {
      AqProduct: true,
      AqCustomer: true,
    },
    take: 30,
    orderBy: {createdAt: `desc`},
  })
  return (
    <C_Stack className={`p-4`}>
      <R_Stack className={` items-start justify-around`}>
        <C_Stack>
          <R_Stack>
            <strong>入荷登録</strong>
          </R_Stack>
          <InventoryRegisterCC {...{history}} />
        </C_Stack>
        <C_Stack>
          <R_Stack>
            <strong>入荷履歴</strong>
            <NewDateSwitcher {...{selectPeriod: true}} />
          </R_Stack>
          <HistoryTable {...{history}} />
        </C_Stack>
      </R_Stack>
    </C_Stack>
  )
}
