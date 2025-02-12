'use client'

import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

const coachStudentConverter = async (modelName, recordId) => {
  const {result: dataById} = await fetchUniversalAPI(`user`, `findUnique`, {where: {id: Number(recordId)}})
  const displayName = dataById?.name ?? '詳細'
  return {dataById, displayName}
}

export class ModelBuilder {
  static breadCrumbDisplayMethods = {
    coach: coachStudentConverter,
    student: coachStudentConverter,
  }
}
