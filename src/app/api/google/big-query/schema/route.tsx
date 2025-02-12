export {}
// // import {getSchema} from '@app/api/google/big-query/big-query-methods'
// import {DH} from '@class/DH'
// import {NextRequest, NextResponse} from 'next/server'

// export const POST = async (req: NextRequest) => {
//   return NextResponse.json({req: await req.json()})
//   const body = await req.json()

//   const {datasetId = 'Orders', tableId = 'Orders_Base', where = {}, limit = 1} = body
//   // const schema = await getSchema({datasetId, tableId})
//   const {table, dataset, fields} = schema

//   const TYPES = {}
//   fields.forEach(field => {
//     DH.makeObjectOriginIfUndefined(TYPES, field.type, [])
//     TYPES[field.type].push(field.name)
//   })

//   return NextResponse.json({fields, table, dataset, TYPES})
// }
