import {updateAlgorithm} from '@app/(apps)/stock/api/jquants-server-actions/jquants-getter'
import {toUtc} from '@class/Days/date-utils/calculations'
import {NextRequest, NextResponse} from 'next/server'

export const GET = async (req: NextRequest) => {
  const params = await req.nextUrl.searchParams
  const date = toUtc(params.get('date') ?? new Date())
  const data = await updateAlgorithm({date})
  return NextResponse.json({data})
}
