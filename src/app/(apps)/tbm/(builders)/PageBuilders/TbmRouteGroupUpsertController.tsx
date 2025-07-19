import {doStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export const TbmRouteGroupUpsertController = {
  executeUpdate: async item => {
    const {
      id = 0,
      tbmCustomerId,
      tbmProductId,
      name,
      routeName,
      pickupTime,
      vehicleType,
      seikyuKbn,
      tbmBaseId,
      code,

      ...rest
    } = item.latestFormData

    const basezPayload = {
      code,
      name,
      tbmBaseId,
      routeName,
      pickupTime,
      vehicleType,
      seikyuKbn,
    }

    const {Mid_TbmRouteGroup_TbmCustomer} = item.latestFormData

    if (tbmCustomerId === null) {
      const currentMid = item.latestFormData.Mid_TbmRouteGroup_TbmCustomer?.id

      if (currentMid) {
        const deleteRes = await doStandardPrisma(`mid_TbmRouteGroup_TbmCustomer`, `delete`, {where: {id: currentMid}})
        console.log(`mid_TbmRouteGroup_TbmCustomer`, {deleteRes})
      }
    }

    const res = await doStandardPrisma(`tbmRouteGroup`, `upsert`, {
      where: {id: id},
      create: {
        ...basezPayload,
        Mid_TbmRouteGroup_TbmCustomer: tbmCustomerId ? {create: {tbmCustomerId}} : undefined,
      },
      update: {
        ...basezPayload,
        Mid_TbmRouteGroup_TbmCustomer: tbmCustomerId
          ? {
              upsert: {
                where: {id: Mid_TbmRouteGroup_TbmCustomer?.id ?? 0},
                create: {tbmCustomerId},
                update: {tbmCustomerId},
              },
            }
          : undefined,
      },
    })

    return res
  },
}
