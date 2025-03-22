import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

export const TbmRouteGroupUpsertController = {
  executeUpdate: async item => {
    const {id = 0, tbmCustomerId, tbmProductId, name, tbmBaseId, code} = item.latestFormData

    const {Mid_TbmRouteGroup_TbmCustomer, Mid_TbmRouteGroup_TbmProduct} = item.latestFormData

    if (tbmCustomerId === null) {
      const currentMid = item.latestFormData.Mid_TbmRouteGroup_TbmCustomer?.id

      if (currentMid) {
        const deleteRes = await fetchUniversalAPI(`mid_TbmRouteGroup_TbmCustomer`, `delete`, {where: {id: currentMid}})
        console.log(`mid_TbmRouteGroup_TbmCustomer`, {deleteRes})
      }
    }

    if (tbmProductId === null) {
      const currentMid = item.latestFormData.Mid_TbmRouteGroup_TbmProduct?.id
      if (currentMid) {
        const deleteRes = await fetchUniversalAPI(`mid_TbmRouteGroup_TbmProduct`, `delete`, {where: {id: currentMid}})
        console.log(`Mid_TbmRouteGroup_TbmProduct`, {deleteRes})
      }
    }

    const res = await fetchUniversalAPI(`tbmRouteGroup`, `upsert`, {
      where: {id: id},
      create: {
        code,
        name,
        tbmBaseId,
        Mid_TbmRouteGroup_TbmCustomer: tbmCustomerId ? {create: {tbmCustomerId}} : undefined,
        Mid_TbmRouteGroup_TbmProduct: tbmProductId ? {create: {tbmProductId}} : undefined,
      },
      update: {
        code,
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

    return res
  },
}
