import {PrismaModelNames} from '@cm/types/prisma-types'
import {IconBtn} from '@components/styles/common-components/IconBtn'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {PlusIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'

export const DSBM_Label = ({
  editable,
  iconBtn,
  isSelectedType,
  ShiftEditFormModalGMF,
  globalFormStateCommonProps,
  GDS_DND,
  RelationalModel,
  GenbaDay,
  setGDS_DND,
  highlightedStyle,
}) => {
  const iconBtnStyle = {
    padding: 0,
    fontSize: 12,
    ...(isSelectedType ? highlightedStyle : undefined),
  }

  const router = useRouter()
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
  return (
    <div {...{onClick: () => ShiftEditFormModalGMF.setGMF_OPEN(globalFormStateCommonProps)}}>
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
            }}
          />
        )}
      </IconBtn>
    </div>
  )
}
