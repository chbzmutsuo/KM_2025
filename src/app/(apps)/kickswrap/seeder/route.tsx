import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {fetchTransactionAPI} from '@lib/methods/api-fetcher'
import prisma from '@cm/lib/prisma'
import {Prisma} from '@prisma/client'

import {NextRequest, NextResponse} from 'next/server'
export const dynamic = 'auto'

export const GET = async (req: NextRequest) => {
  const deleteMode = req.nextUrl.searchParams.get('delete') === 'true'
  await upsertUsers()

  const bigcategories = [
    {
      name: 'フォアハンド',
      MiddleCategory: [
        {name: 'クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
        {name: '逆クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
      ],
    },
    {
      name: 'バックハンド',
      MiddleCategory: [
        {name: 'クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
        {name: '逆クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
      ],
    },
    {
      name: 'サーブ',
      MiddleCategory: [
        {name: 'ファーストサーブ', Lesson: []},
        {name: 'セカンドサーブ', Lesson: []},
      ],
    },
  ]

  if (deleteMode) {
    // await prisma.user.deleteMany({
    //   where: {
    //     email: {in: students.map(u => u.email)},
    //   },
    // })
    await prisma.bigCategory.deleteMany()
    return NextResponse.json({success: true, message: 'データを削除しました'})
  }

  const createBigAndMiddle: transactionQuery[] = []

  bigcategories.forEach(bc => {
    const {MiddleCategory} = bc
    const queryObject: Prisma.BigCategoryUpsertArgs = {
      where: {name: bc.name},
      create: {
        name: bc.name,
        MiddleCategory: {
          createMany: {
            data: [
              ...MiddleCategory.map(mc => {
                return {
                  name: mc.name,
                }
              }),
            ],
          },
        },
      },
      update: {
        name: bc.name,
        // MiddleCategory: {
        //   createMany: {
        //     data: [
        //       ...MiddleCategory.map(mc => {
        //         return {
        //           name: mc.name,
        //         }
        //       }),
        //     ],
        //   },
        // },
      },
    }

    const query: transactionQuery = {
      model: 'bigCategory',
      method: 'upsert',
      queryObject: queryObject,
    }
    createBigAndMiddle.push(query)
  })

  await fetchTransactionAPI({
    transactionQueryList: createBigAndMiddle,
  })

  const middleCategories = await prisma.middleCategory.findMany()
  await fetchTransactionAPI({
    transactionQueryList: middleCategories.map(mc => {
      return {
        model: 'middleCategory',
        method: 'update',
        queryObject: {
          where: {id: mc.id},
          data: {
            Lesson: {
              createMany: {data: [{name: 'STEP1'}, {name: 'STEP2'}, {name: 'STEP3'}]},
            },
          },
        },
      }
    }),
  })

  return NextResponse.json({success: true, message: 'seeded'})
}

const upsertUsers = async () => {
  const student_coach_quereis: transactionQuery[] = []
  const coaches = [
    {
      name: `山田さん`,
      email: `yamada@gmail.com`,
      password: 'yamada',
      membershipName: 'コーチ',
    },
    {
      name: `山岡さん`,
      email: `yamaoka@gmail.com`,
      password: 'yamaoka',
      membershipName: 'コーチ',
    },
    {
      name: `吉市`,
      email: `yoshiichi@gmail.com`,
      password: 'yoshiichi',
      membershipName: 'コーチ',
    },
  ]
  const students = new Array(10).fill('').map((_, i) => {
    const key = `Advantage_${i}`
    return {
      name: key,
      email: `${key}@gmail.com`,
      password: key,
      membershipName: '生徒',
    }
  })

  const users = [...students, ...coaches]
  users.map((student, i) => {
    student_coach_quereis.push({
      model: 'user',
      method: 'upsert',
      queryObject: {
        where: {email: student.email},
        create: student,
        update: student,
      },
    })
  })
  await fetchTransactionAPI({transactionQueryList: student_coach_quereis})
}
