'use client'
import React from 'react'
import DynamicLoader from 'src/cm/components/utils/loader/Loader'

export default function Loading({children}) {
  return (
    <div>
      <DynamicLoader />
      {children}
    </div>
  )
}
