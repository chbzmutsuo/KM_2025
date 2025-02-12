import {DH} from '@class/DH'
import {PrismaModelNames} from '@cm/types/prisma-types'
import {fetchTransactionAPI, fetchUniversalAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {toast} from 'react-toastify'

export const handleOnNippoSubmit = async ({totalCostState, TheNippo, materialGroups, formData}) => {
  const restructureTsMaterial = () => {
    let result: any[] = []
    materialGroups.forEach(group => {
      const {id} = group
      const tsMaterial = formData[id]

      result = [...result, ...tsMaterial]
    })
    return result
  }

  const tsMaterial = restructureTsMaterial()
  const {tsRegularSubcontractor = [], tsSubcontractor = [], tsMachinery = [], user = [], tsWorkContent = []} = formData

  const pushToQueryFromClient = (props: {sourceList: any[]; modelName: PrismaModelNames}) => {
    const {sourceList, modelName} = props

    const relationalKey = DH.capitalizeFirstLetter(modelName)
    const midTablePrismaName = `MidTsNippo${relationalKey}` as PrismaModelNames
    const relationalId = `${modelName}Id`
    const uniqueWhereKey = `unique_tsNippoId_${modelName}Id`

    sourceList.forEach((source, i) => {
      if (!source.value) return
      const payload = {
        tsNippoId: TheNippo.id,
        [relationalId]: source.value,
        count: source.count ?? 0,
        price: source.price,
      }

      if (source.trashed) {
        transactionQueryList.push({
          model: midTablePrismaName,
          method: `delete`,
          queryObject: {
            where: {
              id: Number(source.id ?? 0),
            },
          },
        })
      } else {
        transactionQueryList.push({
          model: midTablePrismaName,
          method: `upsert`,
          queryObject: {
            where: {
              id: Number(source.id ?? 0),
            },
            create: payload,
            update: payload,
          },
        })
      }
    })
  }
  // const pushToQueryFromClient = (props: {sourceList: any[]; modelName: PrismaModelNames}) => {
  //   const {sourceList, modelName} = props

  //   const relationalKey = DH.capitalizeFirstLetter(modelName)
  //   const midTablePrismaName = `MidTsNippo${relationalKey}` as PrismaModelNames
  //   const relationalId = `${modelName}Id`
  //   const uniqueWhereKey = `unique_tsNippoId_${modelName}Id`

  //   sourceList.forEach((source, i) => {
  //     if (!source.value) return
  //     const payload = {
  //       tsNippoId: TheNippo.id,
  //       [relationalId]: source.value,
  //       count: source.count ?? 0,
  //       price: source.price,
  //     }

  //     if (source.trashed) {
  //       transactionQueryList.push({
  //         model: midTablePrismaName,
  //         method: `delete`,
  //         queryObject: {
  //           where: {
  //             [uniqueWhereKey]: {
  //               tsNippoId: TheNippo.id,
  //               [relationalId]: Number(source.value),
  //             },
  //           },
  //         },
  //       })
  //     } else {
  //       transactionQueryList.push({
  //         model: midTablePrismaName,
  //         method: `upsert`,
  //         queryObject: {
  //           where: {
  //             [uniqueWhereKey]: {
  //               tsNippoId: TheNippo.id,
  //               [relationalId]: Number(source.value),
  //             },
  //           },
  //           create: payload,
  //           update: payload,
  //         },
  //       })
  //     }
  //   })
  // }

  const transactionQueryList: transactionQuery[] = []
  pushToQueryFromClient({sourceList: user, modelName: `user`})
  pushToQueryFromClient({sourceList: tsRegularSubcontractor, modelName: `tsRegularSubcontractor`})
  pushToQueryFromClient({sourceList: tsSubcontractor, modelName: `tsSubcontractor`})
  pushToQueryFromClient({sourceList: tsMachinery, modelName: `tsMachinery`})
  pushToQueryFromClient({sourceList: tsMaterial, modelName: `tsMaterial`})
  pushToQueryFromClient({sourceList: tsWorkContent, modelName: `tsWorkContent`})

  const updateTotalCostRes = await fetchUniversalAPI(`tsNippo`, `update`, {
    where: {id: TheNippo.id},
    totalCost: totalCostState ?? undefined,
  })

  const res = await fetchTransactionAPI({transactionQueryList})

  if (res.success) {
    toast.success(`日報データを更新しました。`)
  }

  return res
}
