'use client'

import {GenbaDayShiftForm} from '@app/(apps)/sohken/class/pageBuilderComponents/GenbaDayShift/GenbaDayShiftForm'
import GenbaDayShiftEmptyStuffSearcher from '@app/(apps)/sohken/class/pageBuilderComponents/GenbaDayShift/GenbaDayShiftEmptyStuffSearcher'
import {GenbaForm} from '@app/(apps)/sohken/class/pageBuilderComponents/GenbaDayShift/Genba/GenbaForm'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Fields} from '@class/Fields/Fields'
import GlobalIdSelector from '@components/GlobalIdSelector/GlobalIdSelector'
import {DataModelBuilder, roleMaster} from '@class/builders/PageBuilderVariables'

export class PageBuilder {
  static roleMaster: DataModelBuilder = roleMaster
  static genba = {form: GenbaForm}
  static genbaDay = {
    top: GenbaDayShiftEmptyStuffSearcher,
    // left: () => {
    //   const ShiftEditFormModal_HK = useShiftEditFormModal()
    //   const {RelationalModel, GenbaDay, selectedData, baseModelName} = ShiftEditFormModal_HK.GMF_OPEN ?? {}
    //   const useGlobalProps = useGlobal()
    //   const currentRelationalModelRecords = GenbaDay?.[DH.capitalizeFirstLetter(RelationalModel)]

    //   const handleClose = () => ShiftEditFormModal_HK.setGMF_OPEN(null)
    //   const commonProps = {
    //     GenbaDay,
    //     handleClose,
    //     useGlobalProps,
    //   }

    //   return (
    //     <div>
    //       {ShiftEditFormModal_HK.GMF_OPEN && (
    //         <div>
    //           <div className={` fixed inset-0 bg-black/50`} style={{zIndex: Z_INDEX.overlay}}></div>
    //           <Paper className={`fixed left-4 top-[200px] bg-white p-4`} style={{zIndex: Z_INDEX.overlay}}>
    //             {baseModelName === `user` ? (
    //               <MultipleUserSelector {...{...commonProps, currentRelationalModelRecords}} />
    //             ) : (
    //               <SingleAddForm {...{...commonProps, RelationalModel, selectedData}} />
    //             )}
    //             <Button
    //               onClick={() => {
    //                 ShiftEditFormModal_HK.setGMF_OPEN(null)
    //               }}
    //             >
    //               閉じる
    //             </Button>
    //           </Paper>
    //         </div>
    //       )}
    //     </div>
    //   )
    // },
    form: GenbaDayShiftForm,
  }
  static getGlobalIdSelector = ({useGlobalProps}) => {
    return () => {
      const {accessScopes} = useGlobal()
      const scopes = accessScopes()
      const {admin} = scopes

      if (!admin) {
        return <></>
      }

      const columns = Fields.transposeColumns([
        {
          label: '',
          id: 'g_userId',
          forSelect: {
            config: {
              where: {apps: {has: `sohken`}},
            },
          },
          form: {},
        },
      ])

      return <GlobalIdSelector {...{useGlobalProps, columns}} />
    }
  }
}
