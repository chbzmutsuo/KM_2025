'use client'

import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import useSelectedBase from '@app/(apps)/tbm/(globalHooks)/useSelectedBase'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import {ClientPropsType2} from '@components/DataLogic/TFs/PropAdjustor/PropAdjustor'
import TableForm from '@components/DataLogic/TFs/PropAdjustor/TableForm'
import {TextBlue} from '@components/styles/common-components/Alert'
import {R_Stack} from '@components/styles/common-components/common-components'
import {Paper} from '@components/styles/common-components/paper'
import useGlobal from '@hooks/globalHooks/useGlobal'

const Title = ({children}) => {
  return (
    <div className={`mb-[10px]`}>
      <strong>{children}</strong>
    </div>
  )
}
export const tbmBase = {
  table: (props: DetailPagePropType) => {
    return (
      <Paper className={`p-4 `}>
        <Title>
          <TextBlue>営業所</TextBlue>
        </Title>
        <TableForm {...(props as ClientPropsType2)} />
      </Paper>
    )
  },
  right: () => {
    const useGlobalProps = useGlobal()
    const {selectedBase, setselectedBase, selectedRouteGroup, setselectedRouteGroup} = useSelectedBase()
    const gapWidth = `[30px]`

    if (selectedBase) {
      return (
        <>
          {selectedBase && (
            <section className={` ml-${gapWidth}`}>
              <R_Stack className={`gap-${gapWidth} items-start`}>
                {/* <ChevronDoubleRightIcon className={`mt-[100px] h-[30px]`} /> */}
                <Paper className={`p-4 `}>
                  <Title>
                    <TextBlue>{selectedBase.name}</TextBlue>のルート一覧
                  </Title>
                  <ChildCreator
                    {...{
                      ParentData: selectedBase,
                      models: {parent: `tbmBase`, children: `tbmRouteGroup`},
                      columns: ColBuilder.tbmRouteGroup({
                        useGlobalProps,
                        ColBuilderExtraProps: {
                          selectedBase,
                          setselectedBase,
                          selectedRouteGroup,
                          setselectedRouteGroup,
                        },
                      }),

                      useGlobalProps,
                    }}
                  />
                </Paper>
              </R_Stack>
            </section>
          )}

          {selectedRouteGroup && (
            <div className={` ml-${gapWidth}`}>
              <R_Stack className={`gap-${gapWidth} items-start`}>
                {/* <ChevronDoubleRightIcon className={`h-[30px]`} /> */}
                <Paper className={`p-4 `}>
                  <Title>
                    <TextBlue>{selectedRouteGroup.name}</TextBlue>
                    の内訳一覧
                  </Title>
                  <div>
                    {/* <ChildCreator
                      {...{
                        ParentData: selectedRouteGroup,
                        models: {
                          parent: `tbmRouteGroup`,
                          children: `tbmRoute`,
                        },
                        additional: {
                          include: {
                            TbmRouteGroup: {},
                            TbmBillingAddress: {},
                          } as Prisma.TbmRouteFindManyArgs[`include`] as any,
                        },
                        columns: ColBuilder.tbmRoute({
                          useGlobalProps,
                          ColBuilderExtraProps: {
                            selectedBase,
                            setselectedBase,
                            selectedRouteGroup,
                            setselectedRouteGroup,
                          },
                        }),
                        useGlobalProps,
                      }}
                    /> */}
                  </div>
                </Paper>
              </R_Stack>
            </div>
          )}
        </>
      )
    }
    return <></>
  },
}
