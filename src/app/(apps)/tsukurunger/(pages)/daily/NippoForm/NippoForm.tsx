'use client'
import {getNippoFormcols} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/getNippoFormcols'

import {nippoOptions} from '@app/(apps)/tsukurunger/(pages)/daily/[tsConstructionId]/input/page'
import {TsNippo} from '@app/(apps)/tsukurunger/(models)/Nippo'

import {DH} from '@class/DH'
import useGlobal from '@hooks/globalHooks/useGlobal'
import React, {useState} from 'react'
import {P_TsConstruction} from 'scripts/generatedTypes'
import {PdfTargetForm} from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/PdfTargetForm'
import TopButtons from '@app/(apps)/tsukurunger/(pages)/daily/NippoForm/TopButtons/TopButtons'

type formValue = {value: string; count: number; price: number; trashed?: boolean}
export type formDataType = {[key: string]: formValue[]}

export default function NippoForm(props: {Genba: P_TsConstruction; nippoOptions: nippoOptions; materialGroups: any}) {
  const useGlobalProps = useGlobal()
  const {query, router, session, asPath, appbarHeight, toggleLoad, accessScopes} = useGlobalProps
  const {subConRole} = accessScopes().getTsukurungerScopes()
  const {Genba, nippoOptions, materialGroups} = props

  const TheNippoCL = new TsNippo(Genba.TsNippo[0])
  const TheNippo = TheNippoCL.Nippo

  const defaultValue = getDefaultValues({Nippo: TheNippo})
  const columns = getNippoFormcols({Genba, nippoOptions})
  const swithchingColIds = columns.flat().filter(d => d.td?.hidden)
  const totalCost = TheNippoCL.getTotalPrice().sum

  const defaultActiveCols = Object.fromEntries(
    swithchingColIds.map(d => {
      const hasValues = defaultValue[d.id].length > 0
      return [d.id, hasValues]
    })
  )
  const [activeCols, setactiveCols] = useState(defaultActiveCols)
  const [formData, setformData] = useState<formDataType>(defaultValue)
  const maxWidth = `85vw`

  return (
    <div className={`mx-auto max-w-[1000px]`}>
      <div style={{top: appbarHeight, position: `sticky`}} className={`bg-white  py-4`}>
        <TopButtons
          {...{
            subConRole,
            formData,
            totalCost,
            TheNippo,
            materialGroups,
            nippoOptions,
            Genba,
            router,
            asPath,
            toggleLoad,
          }}
        />
      </div>

      <PdfTargetForm
        {...{
          TheNippo,
          columns,
          formData,
          swithchingColIds,
          activeCols,
          setformData,
          setactiveCols,
          maxWidth,
          nippoOptions,
          useGlobalProps,
        }}
      />
    </div>
  )
}

export type selectOptions = {value: string; label: string} & any

const getDefaultValues = props => {
  const Nippo = props.Nippo
  const currentInputValues = Object.fromEntries(
    TsNippo.optionKeys.map(d => {
      const key = d.id
      const [model, group] = key.split(`_`)

      if (model === `tsMaterial`) {
        const currentValueList = Nippo[`MidTsNippoTsMaterial`]
          .filter(d => {
            const materialTypesInGroup = group?.split(`&`)

            return materialTypesInGroup?.includes(d?.TsMaterial?.materialType)
          })
          .map(d => {
            const theMaterial = d.TsMaterial
            return {
              value: theMaterial.id,
              count: d.count,
              price: d.price,
            }
          })

        return [key, currentValueList]
      } else {
        const modelName = DH.capitalizeFirstLetter(model)
        const RelationalModelName = `MidTsNippo${modelName}`

        const currentValueList =
          Nippo?.[RelationalModelName]?.map(d => {
            return {
              id: d.id,
              value: d?.[modelName]?.id,
              count: d.count,
              price: d.price,
            }
          }) ?? []

        return [key, currentValueList]
      }
    })
  )

  return currentInputValues
}
