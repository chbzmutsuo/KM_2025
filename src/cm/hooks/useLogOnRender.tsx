import {useEffect} from 'react'

export default function useLogOnRender(key?: any) {
  useEffect(() => {
    console.info(`===Log:${key}===`)
  }, [])
}
