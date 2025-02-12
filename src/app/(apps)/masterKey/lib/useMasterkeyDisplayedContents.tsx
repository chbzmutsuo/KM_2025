import { atomTypes, useJotaiByKey} from '@hooks/useJotai'

export default function useMasterkeyDisplayedContents() {
  const displayedContentsMaster = [
    {id: `masterKeyApplicant`, label: `応募者`},
    {id: `masterKeyJob`, label: `求人`},
  ]
  const [displayedContents, setdisplayedContents] = useJotaiByKey<atomTypes[`displayedContents`]>(`displayedContents`, [])

  const toggle = (id: string) => {
    setdisplayedContents(prev => {
      const isActiveKey = prev.includes(id)
      const result = isActiveKey ? prev.filter(d => d !== id) : [...prev, id]

      return result

      // displayedContents.includes(id) ? displayedContents.filter(id => id !== id) : [...displayedContents, id]
    })
  }

  const checkIsActive = (id: string) => {
    return displayedContents.includes(id)
  }

  return {
    toggle,
    checkIsActive,
    displayedContentsMaster,
    displayedContents,
    setdisplayedContents,
  }
}
