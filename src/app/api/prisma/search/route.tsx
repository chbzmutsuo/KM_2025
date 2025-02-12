import {isRouteAccessAllowed} from '@app/api/prisma/isAllowed'

import {handlePrismaError} from '@cm/lib/prisma'
import {searchByQuery} from '@lib/server-actions/common-server-actions/SerachByQuery/SerachByQuery'

import {NextRequest, NextResponse} from 'next/server'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  if (await isRouteAccessAllowed(req)) {
    try {
      const {modelName, where, include, orderBy, skip, take, select} = body

      const {records, totalCount} = await searchByQuery({
        modelName: modelName,
        where,
        include,
        orderBy,
        skip,
        take,
        select,
      })

      const result = {records, totalCount}
      return NextResponse.json(result)
    } catch (error) {
      const errorMessage = handlePrismaError(error)
      console.error({error})
      console.error({errorMessage})

      return NextResponse.json({success: false, message: errorMessage, error: error.message}, {status: 500})
    }
  } else {
    return NextResponse.json({success: false, message: 'アクセスが禁止されています', result: null}, {status: 500})
  }
}
