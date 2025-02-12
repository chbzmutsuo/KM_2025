'use client'
import {C_Stack, R_Stack} from '@cm/components/styles/common-components/common-components'

import {EyeDropperIcon, PlusIcon} from '@heroicons/react/20/solid'
import useGlobal from '@hooks/globalHooks/useGlobal'
import {Z_INDEX} from '@cm/lib/constants/constants'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

import {IconBtn} from '@components/styles/common-components/IconBtn'
import {ColoredText} from '@components/styles/common-components/colors'

import {PrismaModelNames} from '@cm/types/prisma-types'

import {useShiftEditFormModal} from '@app/(apps)/sohken/hooks/useShiftEditFormModal'

export const DistributionListByModel = ({
  editable,
  GDS_DND,
  setGDS_DND,
  GenbaDay,
  ArrayData,
  baseModelName,
  RelationalModel,
  iconBtn,
}) => {
  const ShiftEditFormModalGMF = useShiftEditFormModal()

  const useGlobalProps = useGlobal()
  const {router} = useGlobalProps

  const highlightedStyle = {zIndex: Z_INDEX.modal + 100}

  const isSelectedType = GDS_DND.picked?.itemType === RelationalModel
  const iconBtnStyle = {
    padding: 0,
    fontSize: 12,
    ...(isSelectedType ? highlightedStyle : undefined),
  }

  const {picked} = GDS_DND ?? {}
  const {itemType, id} = picked ?? {}
  const globalFormStateCommonProps = {baseModelName, selectedData: null, RelationalModel, GenbaDay}

  const selectedClass = `animate-pulse rounded bg-green-400 p-1 shadow`

  const Label = () => {
    return (
      <div>
        <IconBtn
          {...{
            className: `row-stack justify-between w-full !px-2 py-0.5`,
            style: iconBtnStyle,
            onClick: asignToGenbaDate,
            color: isSelectedType ? `green` : iconBtn.color,
          }}
        >
          <span>{iconBtn.text}</span>
          {editable && (
            <PlusIcon
              {...{
                className: `w-5 h-5 bg-white  text-sub-main shadow  rounded-full `,
                onClick: () => ShiftEditFormModalGMF.setGMF_OPEN(globalFormStateCommonProps),
              }}
            />
          )}
        </IconBtn>
      </div>
    )
  }

  const LinkComponent = editable
    ? props => {
        return <ColoredText {...props}>{props.children}</ColoredText>
      }
    : ({children}) => <>{children}</>

  const List = () => {
    return (
      <C_Stack className={` gap-0.5 leading-4`}>
        {ArrayData?.map((v, i) => {
          const bgColor = v.status === `完了` ? `#caffd1` : v.status === `未完了` ? `#ffc0c0` : undefined
          const selected = itemType === RelationalModel && id === v.id

          return (
            <div key={i} className={`${selected ? `${selectedClass}` : ''} mb-1 border-b`}>
              <R_Stack className={` flex-nowrap gap-1`}>
                {editable && (
                  <>
                    <EyeDropperIcon
                      style={{
                        ...(isSelectedType
                          ? {...(GDS_DND.picked?.id === v.id && {background: `white`, ...highlightedStyle})}
                          : {}),
                      }}
                      className={`onHover w-5 rounded-full `}
                      onClick={() => pickUp(v)}
                    />
                  </>
                )}
                <LinkComponent
                  {...{
                    onClick: () => ShiftEditFormModalGMF.setGMF_OPEN({...globalFormStateCommonProps, selectedData: v}),
                    bgColor,
                    className: ` truncate ${bgColor ? '' : 'onHover text-blue-500'}`,
                  }}
                >
                  {v.name}
                </LinkComponent>
              </R_Stack>
            </div>
          )
        })}
      </C_Stack>
    )
  }

  return (
    <C_Stack className={`w-[200px]  gap-0.5  overflow-auto   rounded border p-1 text-xs leading-5`}>
      <Label />

      <List />
    </C_Stack>
  )

  async function asignToGenbaDate() {
    if (GDS_DND.picked) {
      await fetchUniversalAPI(RelationalModel as PrismaModelNames, `update`, {
        where: {id: GDS_DND.picked.id},
        genbaDayId: GenbaDay.id,
      })

      router.refresh()

      setGDS_DND({})
    }
  }
  function pickUp(v) {
    setGDS_DND(prev => {
      const isSame = prev.picked?.id === v.id
      return isSame ? {} : {picked: {itemType: RelationalModel, id: v.id}}
    })
  }
}
