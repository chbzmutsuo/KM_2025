import {DH} from '@class/DH'

import {PrismaModelNames} from '@cm/types/prisma-types'

import useGlobal from '@hooks/globalHooks/useGlobal'
import {atomKey} from '@hooks/useJotai'

import {C_Stack} from '@components/styles/common-components/common-components'
import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import {Genba} from '@prisma/client'
import {ColBuilder} from '@app/(apps)/sohken/class/ColBuilder'

export type shiftEditProps = {
  selectedData
  RelationalModel: PrismaModelNames
  GenbaDay
  baseModelName
} | null

export const useGenbaDetailModal = () => {
  const useGlobalProps = useGlobal()
  return useGlobalModalForm<{Genba: Genba}>('useGenbaDetailModalGMF' as atomKey, null, {
    mainJsx: ({GMF_OPEN, setGMF_OPEN, close}) => {
      const {Genba} = GMF_OPEN

      const columns = ColBuilder.genba({useGlobalProps}).flat()

      return (
        <div>
          <h1>現場詳細</h1>
          <div className={`grid gap-8  md:grid-cols-2`}>
            {columns
              .filter(c => c.label !== `非表示`)
              .map(col => {
                const {id, label, form, forSelect, search, type} = col
                let value = Genba[id]

                if (col.id.includes('Id')) {
                  const modelName = DH.capitalizeFirstLetter(id)?.replace('Id', '')

                  const {pref, city} = Genba['PrefCity'] ?? {}
                  console.log(pref) //////logs
                  value = (pref || city) && `${pref} ${city}`
                } else {
                  value = DH.convertDataType(value, type)
                }

                return (
                  <C_Stack key={id} className={`gap-1`}>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </C_Stack>
                )
              })}
          </div>
        </div>
      )
    },
  })
}
