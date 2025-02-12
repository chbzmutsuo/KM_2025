import {basePath} from 'src/cm/lib/methods/common'
import {fetchAlt, toastByResult} from '@lib/methods/api-fetcher'

export async function assignYukyuBatch() {
  const res = await fetchAlt(`${basePath}/yoshinari/api/yukyu/grantPayedLeave`, {})

  if (res.success === false) {
    return toastByResult(res)
  }

  return res
}
