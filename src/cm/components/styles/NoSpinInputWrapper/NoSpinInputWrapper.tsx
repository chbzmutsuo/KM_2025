import React from 'react'
import style from './NoSpinInputWrapper.module.css'
export default function NoSpinInputWrapper({children}) {
  return <div className={style[`noSpin`]}>{children}</div>
}
