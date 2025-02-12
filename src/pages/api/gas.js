
import { fetchAlt } from '@lib/methods/api-fetcher'

export default async function GasApiHandler(req, res) {
  const { body } = req ?? {}

  let data = await fetchAlt(body.gas_api_key, {
    ...body,
  }).then(res => res.data)

  return res.json(data)
}
