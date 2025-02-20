'use client'
import {C_Stack, R_Stack} from '@cm/components/styles/common-components/common-components'

import {EyeDropperIcon} from '@heroicons/react/20/solid'
import {ColoredText} from '@components/styles/common-components/colors'
export const DSBM_List = ({
  editable,
  RelationalModel,
  ArrayData,
  highlightedStyle,
  isSelectedType,
  ShiftEditFormModalGMF,
  globalFormStateCommonProps,
  GDS_DND,
  setGDS_DND,
}) => {
  const {picked} = GDS_DND ?? {}
  const {itemType, id} = picked ?? {}
  const selectedClass = `animate-pulse rounded bg-green-400 p-1 shadow`
  const LinkComponent = editable
    ? props => {
        return <ColoredText {...props}>{props.children}</ColoredText>
      }
    : ({children}) => <>{children}</>

  function pickUp(v) {
    setGDS_DND(prev => {
      const isSame = prev.picked?.id === v.id
      return isSame ? {} : {picked: {itemType: RelationalModel, id: v.id}}
    })
  }
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
                      ...(isSelectedType ? {...(GDS_DND.picked?.id === v.id && {background: `white`, ...highlightedStyle})} : {}),
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
                  className: ` truncate ${bgColor ? '' : 'onHover '}`,
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
