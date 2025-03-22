'use client'

import React from 'react'

export const MetaData = React.memo((props: {pathItemObject; AppName}) => {
  const {pathItemObject, AppName} = props
  const {matchedPathItem} = pathItemObject
  if (!matchedPathItem) return <></>

  const {label, icon} = matchedPathItem
  const left = typeof AppName === `string` ? AppName : ''
  const right = label ?? ''
  const title = left ? `${left} ${right}` : right

  return (
    <>
      <title>{title.replace('[object Object]', ``)}</title>
      {icon && <link rel="icon" href={`/${icon}`} />}
    </>
  )
})
