import {DH} from '@class/DH'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {fetchAlt, fetchTransactionAPI} from '@lib/methods/api-fetcher'
import prisma from '@cm/lib/prisma'

import {NextRequest, NextResponse} from 'next/server'
export const dynamic = 'auto'

export const POST = async (req: NextRequest) => {
  const deleteMode = req.nextUrl.searchParams.get('delete') === 'true'
  await upsertUsers()

  const createdLessons: any = await getBigCategories()

  if (deleteMode) {
    // await prisma.user.deleteMany({
    //   where: {
    //     email: {in: students.map(u => u.email)},
    //   },
    // })
    await prisma.bigCategory.deleteMany()
    return NextResponse.json({success: true, message: 'データを削除しました'})
  }

  // const createBigAndMiddle: transactionQuery[] = []

  // bigcategories.forEach(bc => {
  //   const {MiddleCategory} = bc

  //   const queryObject = {
  //     where: {name: bc.name},
  //     create: {
  //       name: bc.name,
  //       MiddleCategory: {
  //         createMany: {
  //           data: [
  //             ...MiddleCategory.map(mc => {
  //               return {
  //                 name: mc.name,
  //               }
  //             }),
  //           ],
  //         },
  //       },
  //     },
  //     update: {
  //       name: bc.name,
  //       // MiddleCategory: {m
  //       //   createMany: {
  //       //     data: [
  //       //       ...MiddleCategory.map(mc => {
  //       //         return {
  //       //           name: mc.name,
  //       //         }
  //       //       }),
  //       //     ],
  //       //   },
  //       // },
  //     },
  //   }

  //   const query: queryFromClientType = {
  //     model: 'bigCategory',
  //     method: 'upsert',
  //     queryObject: queryObject,
  //   }
  //   createBigAndMiddle.push(query)
  // })

  // await fetchTransactionAPI({
  //   transactionQueryList: createBigAndMiddle,
  // })

  // const middleCategories = await prisma.middleCategory.findMany()
  // await fetchTransactionAPI({
  //   transactionQueryList: middleCategories.map(mc => {
  //     return {
  //       model: 'middleCategory',
  //       method: 'update',
  //       queryObject: {
  //         where: {id: mc.id},
  //         data: {
  //           Lesson: {
  //             createMany: {data: mc.Lesson},
  //           },
  //         },
  //       },
  //     }
  //   }),
  // })

  return NextResponse.json({success: true, message: 'seeded', createdLessons})
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

const getBigCategories = async () => {
  const doPostUrl = `https://script.google.com/macros/s/AKfycbwFxMkh3EVgmGotNWm3uYS0losGhL767t6JAuJvXHTXougH63uoLLXdM7ZNTXGZESZx4A/exec`

  const data = await fetchAlt(`${doPostUrl}`, {
    action: `getLessons`,
  })

  const BCs = {}
  const MCs = {}
  const Lessons = {}

  data.result.forEach(d => {
    const {BC, MC, Lesson, title, description} = d
    DH.makeObjectOriginIfUndefined(BCs, BC, {name: BC, MiddleCategory: []})
    DH.makeObjectOriginIfUndefined(MCs, MC, {name: MC, Lesson: []})
    DH.makeObjectOriginIfUndefined(Lessons, Lesson, {name: Lesson, LessonImage: []})
    Lessons[Lesson].LessonImage.push({title, description})
  })

  data.result.forEach(d => {
    const {BC, MC, Lesson} = d
    MCs[MC].Lesson.push(Lessons[Lesson])
  })

  data.result.forEach(d => {
    const {BC, MC} = d
    BCs[BC].MiddleCategory.push(MCs[MC])
  })

  const bigCategories = Object.values(BCs)

  // const BigCategoryQueries: transactionQuery[] = Object.values(BCs).map((bc: any) => {
  //   return {
  //     model: 'bigCategory',
  //     method: 'upsert',
  //     queryObject: {
  //       where: {name: bc.name},
  //       create: {name: bc.name},
  //       update: {name: bc.name},
  //     },
  //   }
  // })

  const {result: createdBigCategories} = await fetchTransactionAPI({
    transactionQueryList: Object.values(BCs).map((bc: any) => {
      return {
        model: 'bigCategory',
        method: 'upsert',
        queryObject: {
          where: {name: bc.name},
          create: {name: bc.name},
          update: {name: bc.name},
        },
      }
    }),
  })
  const {result: createdMiddleCategories} = await fetchTransactionAPI({
    transactionQueryList: Object.values(MCs).map((bc: any) => {
      const bigCategoryId = createdBigCategories.find(bc => bc.name === bc.name).id
      return {
        model: 'middleCategory',
        method: 'upsert',
        queryObject: {
          where: {
            unique_bigCategoryId_name: {
              bigCategoryId,
              name: bc.name,
            },
          },
          create: {name: bc.name, bigCategoryId},
          update: {name: bc.name, bigCategoryId},
        },
      }
    }),
  })

  const {result: createdLessons} = await fetchTransactionAPI({
    transactionQueryList: Object.values(Lessons).map((l: any) => {
      const mcFromData = data.result.find(d => d.Lesson === l.name)
      const middleCategoryId = createdMiddleCategories.find(mc => mc.name === mcFromData.MC).id
      return {
        model: 'lesson',
        method: 'upsert',
        queryObject: {
          where: {
            unique_middleCategoryId_name: {
              middleCategoryId,
              name: l.name,
            },
          },
          create: {name: l.name, middleCategoryId},
          update: {name: l.name, middleCategoryId},
        },
      }
    }),
  })

  const createdLessonImages = await fetchTransactionAPI({
    transactionQueryList: data.result.map((d: any) => {
      const lessonId = createdLessons.find(l => l.name === d.Lesson).id

      return {
        model: 'lessonImage',
        method: 'upsert',
        queryObject: {
          where: {
            unique_lessonId_name: {
              lessonId,
              name: d.name,
            },
          },
          create: {name: d.name, description: d.description, lessonId},
          update: {name: d.name, description: d.description, lessonId},
        },
      }
    }),
  })

  return {createdBigCategories, createdMiddleCategories, createdLessons, createdLessonImages}

  // [
  //   {
  //     name: 'フォアハンド',
  //     MiddleCategory: [
  //       {name: 'クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
  //       {name: '逆クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
  //     ],
  //   },
  //   {
  //     name: 'バックハンド',
  //     MiddleCategory: [
  //       {name: 'クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
  //       {name: '逆クロス', Lesson: [{name: 'ロックと解放'}, {name: '重心・踏み込み'}]},
  //     ],
  //   },
  //   {
  //     name: 'サーブ',
  //     MiddleCategory: [
  //       {name: 'ファーストサーブ', Lesson: []},
  //       {name: 'セカンドサーブ', Lesson: []},
  //     ],
  //   },
  // ]
}
