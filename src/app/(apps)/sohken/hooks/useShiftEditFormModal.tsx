import MultipleUserSelector from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/MultipleUserSelector'
import SingleAddForm from '@app/(apps)/sohken/(parts)/genbaDay/DistributionListByModel/SingleAddForm'
import {DH} from '@class/DH'

import {PrismaModelNames} from '@cm/types/prisma-types'
import {Paper} from '@components/styles/common-components/paper'

import {useGlobalModalForm} from '@components/utils/modal/useGlobalModalForm'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {atomTypes} from '@hooks/useJotai'

export type shiftEditProps = {
  selectedData
  RelationalModel: PrismaModelNames
  GenbaDay
  baseModelName
} | null

export const useShiftEditFormModal = () => {
  return useGlobalModalForm<atomTypes[`shiftEditPropsGMF`]>(`shiftEditPropsGMF`, null, {
    mainJsx: props => {
      const {RelationalModel, GenbaDay, selectedData, baseModelName} = props.GMF_OPEN

      const useGlobalProps = useGlobal()
      const currentRelationalModelRecords = GenbaDay[DH.capitalizeFirstLetter(RelationalModel)]

      const handleClose = () => props.close()
      const commonProps = {
        GenbaDay,
        handleClose,
        useGlobalProps,
      }

      return (
        <div className={` fixed bottom-[400px] left-4  `}>
          <Paper className={`bg-white p-4`}>
            {baseModelName === `user` ? (
              <MultipleUserSelector
                {...{
                  ...commonProps,
                  currentRelationalModelRecords,
                }}
              />
            ) : (
              <SingleAddForm
                {...{
                  ...commonProps,
                  RelationalModel,
                  selectedData,
                }}
              />
            )}
          </Paper>
        </div>
      )
    },
  })
}
