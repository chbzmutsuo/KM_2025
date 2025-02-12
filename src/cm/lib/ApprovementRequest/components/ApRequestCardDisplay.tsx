import React from 'react'

export default function ApRequestCardDisplay({header, rowArray}) {
  const effectiveCols = rowArray.filter(d => d)
  const unEffectiveCols = rowArray.filter(d => !d)

  return (
    <div>
      {effectiveCols.map((d, j) => {
        const label = header[j]
        return (
          <div key={j} className={`mb-2 leading-4`}>
            <small>{label}</small>
            <div>{d}</div>
          </div>
        )
      })}
      <small>未入力: {unEffectiveCols.map((_, i) => header[i]).join(`, `)}</small>
    </div>
  )
}
