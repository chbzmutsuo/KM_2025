import axios from 'axios'

export const fetcher = (resource: {url: string; method?: string; body?: any; isOnline?: boolean}) => {
  const url = resource?.url ?? resource
  const method = resource?.method?.toLowerCase() ?? 'post'
  const body = resource?.body

  const {isOnline} = resource
  if (isOnline === false) {
    return {}
  }

  return axios[method](url, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      return res.data
    })
    .catch(error => {
      console.error(error.stack)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.info(error.response.data)
        console.info(error.response.status) // 例：400
        console.info(error.response.statusText) // Bad Request
        console.info(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.info(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.info('Error', error.message)
      }

      console.info(error)
      // toast.error('通信エラー')

      return {error}
    })
}
