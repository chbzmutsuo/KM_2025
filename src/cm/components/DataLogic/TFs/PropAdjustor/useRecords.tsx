import {useEffect, useState} from 'react'
export type tableRecord = {
  id: number
  [key: string]: any
}

const useRecords = ({recordSource}) => {
  const [records, setrecords] = useState<tableRecord[]>(recordSource)

  const mutateRecords = ({record}) => {
    setrecords(prev => {
      const index = prev.findIndex(r => r.id === record?.id)
      if (index !== -1) {
        prev[index] = {...prev[index], ...record}
        return [...prev]
      } else {
        return [...prev, record]
      }
    })
  }

  const deleteRecord = ({record}) => {
    setrecords(prev => {
      const index = prev.findIndex(r => r.id === record?.id)
      if (index !== -1) {
        prev.splice(index, 1)
        return [...prev]
      } else {
        return [...prev]
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setrecords(recordSource)
    }, 50)
  }, [recordSource])

  return {records, setrecords, mutateRecords, deleteRecord}
}

export default useRecords
