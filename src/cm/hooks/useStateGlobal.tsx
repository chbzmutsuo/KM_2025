import {atom, useRecoilState} from 'recoil'

export default function useStateGlobal<T>(key: string, defaultValue: T) {
  const recoil = useRecoilState(atom<T>({key: key, default: defaultValue}))
  const [state, setState] = recoil
  const setDefaultState = () => {
    setState(defaultValue)
  }
  return [state, setState, setDefaultState] as const
}
