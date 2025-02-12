'use server'

import prisma from '@lib/prisma'

export const copyNippo = async ({date, sourceNippo}) => {
  const newNippo = await prisma.tsNippo.create({
    data: {
      date,
      tsConstructionId: sourceNippo.tsConstructionId,
      MidTsNippoUser: {
        create: sourceNippo.MidTsNippoUser.map(user => ({
          count: user.count,
          price: user.price,
          userId: user.userId,
        })),
      },
      MidTsNippoTsRegularSubcontractor: {
        create: sourceNippo.MidTsNippoTsRegularSubcontractor.map(subcontractor => ({
          sortOrder: subcontractor.sortOrder,
          count: subcontractor.count,
          price: subcontractor.price,
          tsRegularSubcontractorId: subcontractor.tsRegularSubcontractorId,
        })),
      },
      MidTsNippoTsMachinery: {
        create: sourceNippo.MidTsNippoTsMachinery.map(machinery => ({
          count: machinery.count,
          price: machinery.price,
          tsMachineryId: machinery.tsMachineryId,
        })),
      },
      MidTsNippoTsWorkContent: {
        create: sourceNippo.MidTsNippoTsWorkContent.map(workContent => ({
          count: workContent.count,
          price: workContent.price,
          tsWorkContentId: workContent.tsWorkContentId,
        })),
      },
      MidTsNippoTsMaterial: {
        create: sourceNippo.MidTsNippoTsMaterial.map(material => ({
          count: material.count,
          price: material.price,
          tsMaterialId: material.tsMaterialId,
        })),
      },
    },
  })

  return newNippo
}
