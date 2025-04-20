'use client'

import {ColBuilder} from '@app/(apps)/tbm/(builders)/ColBuilders/ColBuilder'
import {TbmRouteGroupUpsertController} from '@app/(apps)/tbm/(builders)/PageBuilders/TbmRouteGroupUpsertController'
import {DetailPagePropType} from '@cm/types/types'
import ChildCreator from '@components/DataLogic/RTs/ChildCreator/ChildCreator'
import MyForm from '@components/DataLogic/TFs/MyForm/MyForm'
import {R_Stack} from '@components/styles/common-components/common-components'
import BasicTabs from '@components/utils/tabs/BasicTabs'
import useGlobal from '@hooks/globalHooks/useGlobal'

const Title = ({children}) => {
  return (
    <div className={`mb-[10px]`}>
      <strong>{children}</strong>
    </div>
  )
}
export const tbmBase = {
  form: (props: DetailPagePropType) => {
    const useGlobalProps = useGlobal()
    const {toastIfFailed} = useGlobalProps
    const wrapperClass = `t-paper p-4`

    const ColBuiderProps = {
      useGlobalProps,
      ColBuilderExtraProps: {tbmBaseId: props.formData?.id},
    }
    const childCreatorProps = {
      ParentData: props.formData ?? {},
      useGlobalProps,
      additional: {
        include: {TbmBase: {}},
        orderBy: [{code: 'asc'}],
      },
    }
    return (
      <R_Stack className={` items-start gap-6`}>
        <section {...{className: wrapperClass}}>
          <MyForm {...props} />
        </section>
        <section {...{className: wrapperClass}}>
          <BasicTabs
            {...{
              id: 'tbmBaseDetail',
              showAll: false,
              style: {minWidth: 700},
              TabComponentArray: [
                //
                {
                  label: '便マスタ',
                  component: (
                    <ChildCreator
                      {...{
                        models: {parent: `tbmBase`, children: 'tbmRouteGroup'},
                        columns: ColBuilder.tbmRouteGroup(ColBuiderProps),
                        myForm: {create: TbmRouteGroupUpsertController},
                        ...childCreatorProps,
                        additional: {
                          ...childCreatorProps.additional,
                          include: {
                            TbmBase: {},
                            Mid_TbmRouteGroup_TbmCustomer: {
                              include: {TbmCustomer: {}},
                            },
                            Mid_TbmRouteGroup_TbmProduct: {
                              include: {TbmProduct: {}},
                            },
                          },
                        },
                      }}
                    />
                  ),
                },

                {
                  label: '月間設定',
                  component: (
                    <ChildCreator
                      {...{
                        ...childCreatorProps,
                        models: {parent: `tbmBase`, children: `tbmBase_MonthConfig`},
                        columns: ColBuilder.tbmBase_MonthConfig(ColBuiderProps),
                        additional: {
                          include: {TbmBase: {}},
                        },
                      }}
                    />
                  ),
                },
                {
                  label: 'ドライバー',
                  component: (
                    <ChildCreator
                      {...{
                        ...childCreatorProps,
                        models: {parent: `tbmBase`, children: `user`},
                        columns: ColBuilder.user(ColBuiderProps),
                        additional: {
                          include: {
                            TbmBase: {},
                            TbmVehicle: {},
                          },
                        },
                      }}
                    />
                  ),
                },
                {
                  label: '車両',
                  component: (
                    <ChildCreator
                      {...{
                        ...childCreatorProps,
                        models: {parent: `tbmBase`, children: `tbmVehicle`},
                        columns: ColBuilder.tbmVehicle(ColBuiderProps),
                      }}
                    />
                  ),
                },
                {
                  label: '取引先',
                  component: (
                    <ChildCreator
                      {...{
                        ...childCreatorProps,
                        models: {parent: `tbmBase`, children: `tbmCustomer`},
                        columns: ColBuilder.tbmCustomer(ColBuiderProps),
                      }}
                    />
                  ),
                },
                {
                  label: '商品',
                  component: (
                    <ChildCreator
                      {...{
                        ...childCreatorProps,
                        models: {parent: `tbmBase`, children: `tbmProduct`},
                        columns: ColBuilder.tbmProduct(ColBuiderProps),
                      }}
                    />
                  ),
                },
              ],
            }}
          />
        </section>

        {/* <C_Stack className={`  gap-10`}>
          <R_Stack className={` items-start`}>
            <div className={` w-fit`}>
              <MyForm {...props} />
            </div>
            <div className={` w-fit`}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},
                  models: {parent: `tbmBase`, children: `user`},
                  columns: ColBuilder.user(ColBuiderProps),
                  useGlobalProps,
                }}
              />
            </div>
            <div className={` w-fit`}>
              <ChildCreator
                {...{
                  ParentData: props.formData ?? {},
                  models: {parent: `tbmBase`, children: `tbmVehicle`},
                  columns: ColBuilder.tbmVehicle(ColBuiderProps),
                  useGlobalProps,
                }}
              />
            </div>
          </R_Stack>
          {!!props.formData && (
            <>
              <div className={` w-fit`}>
                <ChildCreator
                  {...{
                    ParentData: props.formData ?? {},
                    models: {parent: `tbmBase`, children: 'tbmRouteGroup'},
                    columns: ColBuilder.tbmRouteGroup(ColBuiderProps),
                    myForm: {
                      create: {
                        executeUpdate: async item => {
                          const {id = 0, tbmCustomerId, tbmProductId, name, tbmBaseId} = item.latestFormData
                          const {Mid_TbmRouteGroup_TbmCustomer, Mid_TbmRouteGroup_TbmProduct} = item.latestFormData

                          const res = await fetchUniversalAPI(`tbmRouteGroup`, `upsert`, {
                            where: {id: id},
                            create: {
                              name,
                              tbmBaseId,
                              Mid_TbmRouteGroup_TbmCustomer: tbmCustomerId ? {create: {tbmCustomerId}} : undefined,
                              Mid_TbmRouteGroup_TbmProduct: tbmProductId ? {create: {tbmProductId}} : undefined,
                            },
                            update: {
                              name,
                              tbmBaseId,

                              Mid_TbmRouteGroup_TbmCustomer: tbmCustomerId
                                ? {
                                    upsert: {
                                      where: {id: Mid_TbmRouteGroup_TbmCustomer?.id ?? 0},
                                      create: {tbmCustomerId},
                                      update: {tbmCustomerId},
                                    },
                                  }
                                : undefined,

                              Mid_TbmRouteGroup_TbmProduct: tbmProductId
                                ? {
                                    upsert: {
                                      where: {id: Mid_TbmRouteGroup_TbmProduct?.id ?? 0},
                                      create: {tbmProductId},
                                      update: {tbmProductId},
                                    },
                                  }
                                : undefined,
                            },
                          })

                          // if (tbmCustomerId) {
                          //   const unique_tbmRouteGroupId_tbmCustomerId = {
                          //     tbmRouteGroupId: id,
                          //     tbmCustomerId,
                          //   }
                          //   const resTbmCustomer = await fetchUniversalAPI(`mid_TbmRouteGroup_TbmCustomer`, `upsert`, {
                          //     where: {unique_tbmRouteGroupId_tbmCustomerId},
                          //     ...createUpdate({...unique_tbmRouteGroupId_tbmCustomerId}),
                          //   })
                          //   toastIfFailed(resTbmCustomer)
                          // }

                          // if (tbmProductId) {
                          //   const unique_tbmRouteGroupId_tbmProductId = {
                          //     tbmRouteGroupId: id,
                          //     tbmProductId,
                          //   }
                          //   const resTbmProduct = await fetchUniversalAPI(`mid_TbmRouteGroup_TbmProduct`, `upsert`, {
                          //     where: {unique_tbmRouteGroupId_tbmProductId},
                          //     ...createUpdate({...unique_tbmRouteGroupId_tbmProductId}),
                          //   })
                          //   toastIfFailed(resTbmProduct)
                          // }

                          return res
                        },
                      },
                    },
                    additional: {
                      include: {
                        TbmBase: {},
                        Mid_TbmRouteGroup_TbmCustomer: {
                          include: {TbmCustomer: {}},
                        },
                        Mid_TbmRouteGroup_TbmProduct: {
                          include: {TbmProduct: {}},
                        },
                      },
                    },
                    useGlobalProps,
                  }}
                />
              </div>
            </>
          )}
        </C_Stack> */}
      </R_Stack>
    )
  },
}
