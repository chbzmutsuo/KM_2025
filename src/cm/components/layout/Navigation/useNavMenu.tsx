'use client'
import {atomTypes, useJotaiByKey} from '@hooks/useJotai'

const useNavMenu = () => {
  const [activeNavWrapper, setactiveNavWrapper] = useJotaiByKey<atomTypes[`activeNavWrapper`]>(`activeNavWrapper`, [])

  const handleOpenMenu = ({navWrapperIdx, hideOthers}) => {
    if (menuIsOpen(navWrapperIdx)) return

    if (hideOthers === true) {
      setactiveNavWrapper([navWrapperIdx])
    } else {
      setactiveNavWrapper(prev => [...prev, navWrapperIdx])
    }
  }

  const handleCloseMenu = (targetWrapperIdxs: number[]) => {
    return setactiveNavWrapper(prev => prev.filter(idx => !targetWrapperIdxs.includes(idx)))
  }

  const menuIsOpen = navWrapperIdx => activeNavWrapper.includes(navWrapperIdx)
  const toggleSingleMenu = navWrapperIdx => {
    const open = menuIsOpen(navWrapperIdx)

    if (open) {
      handleCloseMenu([navWrapperIdx])
    } else {
      handleOpenMenu({navWrapperIdx, hideOthers: false})
    }
  }

  return {
    toggleSingleMenu,
    handleOpenMenu,
    menuIsOpen,
    handleCloseMenu,
    activeNavWrapper,
    setactiveNavWrapper,
  }
}

export default useNavMenu
