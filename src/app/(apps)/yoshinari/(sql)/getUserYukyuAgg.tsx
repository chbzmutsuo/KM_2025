import {sql} from '@class/SqlBuilder/SqlBuilder'
import {useRawSql} from '@class/SqlBuilder/useRawSql'
import {fetchUniversalAPI} from '@lib/methods/api-fetcher'

type yukyuGrantRecord = {
  userId: number
  mins: number
  grantedAt: Date
  expiresAt: Date
}

type yukyuConsumeRecord = {
  userId: number
  startTime: string
  endTime: string
  totalConsumedMinutes: number
  consumedDate: Date
  usedPayedLeaveGrant?: any
}

export type userYukyuAgg = {
  userName: string
  userId: number
  totalGrantedMinutes: number
  remainingGrantedMinutes: number
  totalConsumedMinutes: number
  totalRemainingMinutes: number

  consumeList: yukyuConsumeRecord[]
  grantList: yukyuGrantRecord[]
}

export const getUserYukyuAgg = async () => {
  const {yukyuConsumeRecords} = await getYukyuConsumedRecords()
  const {yukyuGrantRecords} = await getYukyuGainedRecords()

  const yukyuGroupedBy = await calculateRemainingLeave(yukyuGrantRecords, yukyuConsumeRecords)

  return {yukyuGroupedBy}
}

export const calculateRemainingLeave = async (
  yukyuGrantRecords: yukyuGrantRecord[],
  yukyuConsumeRecords: yukyuConsumeRecord[]
) => {
  const {result: allUsers} = await fetchUniversalAPI(`user`, `findMany`, {})

  // 1. userIdごとにyukyuGrantRecordsをグループ化し、expiresAtで昇順に並べる
  const grantRecordsByUser: {[userId: number]: yukyuGrantRecord[]} = allUsers.reduce((acc, user) => {
    const userId = user.id
    const grant = yukyuGrantRecords.filter(d => d.userId === userId)
    if (!acc[userId]) acc[userId] = []
    acc[userId] = [...acc[userId], ...grant]

    return acc
  }, {})

  // 2. userIdごとにyukyuConsumeRecordsをグループ化し、consumedDateで昇順に並べる
  const consumeRecordsByUser = yukyuConsumeRecords.reduce((acc, consume) => {
    if (!acc[consume.userId]) acc[consume.userId] = []
    acc[consume.userId].push(consume)
    return acc
  }, {})

  // 3. 各ユーザーごとに有給を消費して残りを計算

  let remainingLeaveByUser = Object.keys(grantRecordsByUser).map(userId => {
    const grants = grantRecordsByUser[userId].sort(
      (a, b) => a.expiresAt - b.expiresAt // expiresAtで昇順
    )

    const consumes = (consumeRecordsByUser[userId] || []).sort(
      (a, b) => a.consumedDate - b.consumedDate // consumedDateで昇順
    )

    const remainingGrants = [...grants] // 残りの有給データを保持
    let totalConsumed = 0

    // 4. 消費データを順に処理
    const consumesWithUsedPayedLeaveGrant = consumes.map(consume => {
      const usedPayedLeaveGrant: any[] = []
      let remainingToConsume = parseFloat(consume.totalConsumedMinutes ?? 0)

      // 古い付与データから順に消費する
      for (let i = 0; i < remainingGrants.length; i++) {
        const grant = remainingGrants[i]
        let grantMins = grant.mins ?? 0

        // 消費日が付与データの有効期限内か確認
        if (new Date(consume.consumedDate) <= new Date(grant.expiresAt)) {
          // まだ残りの付与時間があるなら、そこから消費
          if (grantMins > 0) {
            const consumable = Math.min(remainingToConsume ?? 0, grantMins)

            grantMins -= consumable // 付与データから消費分を引く
            remainingToConsume -= consumable // 消費データの残り分を減らす
            totalConsumed += consumable // 全体の消費に加算
            usedPayedLeaveGrant.push({grantedAt: grant.grantedAt, consumedMins: consumable})

            // 消費分がまだ残っている場合、次のgrantに進む
            if (remainingToConsume <= 0) {
              break // すべて消費できたらループを抜ける
            }
          }
        }
      }

      return {...consume, usedPayedLeaveGrant}
    })

    // 5. 合計消費、合計残存を計算
    const totalGranted = grants.reduce((acc, grant) => acc + (grant.mins ?? 0), 0) // 付与合計合計

    const remainingGranted = grants
      .filter(
        grant => new Date(grant.expiresAt) >= new Date() // 有効期限が切れていないものだけを合計
      )
      .reduce((acc, grant) => acc + grant.mins, 0)

    const totalRemaining = remainingGranted - totalConsumed
    // 残っている有給時間

    const result = {
      userId: parseInt(userId),
      totalGrantedMinutes: totalGranted,
      remainingGrantedMinutes: remainingGranted,
      totalConsumedMinutes: totalConsumed,
      totalRemainingMinutes: totalRemaining,
      consumeList: consumesWithUsedPayedLeaveGrant,
      grantList: grants,
    }

    return result
  })

  remainingLeaveByUser = remainingLeaveByUser.map(d => {
    const {userId} = d
    const user = allUsers.find(d => d.id === userId)
    return {...d, userName: user?.name}
  })

  return remainingLeaveByUser as userYukyuAgg[]
}

const getYukyuGainedRecords = async () => {
  const yukyuGrantRecordsSql = sql`
  SELECT
    u."name" AS "userName",
    pg."userId",
    pg."mins",
    pg."expiresAt",
    pg."grantedAt"
  FROM
    "PaidLeaveGrant" pg
  JOIN "User" u ON pg."userId" = u."id"
  `

  const yukyuGrantRecords: any[] = (await useRawSql({sql: yukyuGrantRecordsSql})).rows

  // const foo = yukyuGrantRecords
  //   .filter(d => d.userName.includes(`馬上`))
  //   .map(d => {
  //     delete d.userName
  //     delete d.expiresAt
  //     delete d.grantedAt

  //     return d
  //   })
  // console.log({foo})

  return {yukyuGrantRecords}
}

const getYukyuConsumedRecords = async () => {
  const workHoursSq = sql`
  SELECT
    history.from,
    history."userId",
    workType."workMins"
    from "UserWorkTimeHistoryMidTable" history
    left join "WorkType" workType
    on history."workTypeId" = workType."id"
  `

  const yukyuConsumeRecordsSql = sql`
  WITH "workHours" AS ( ${workHoursSq})


  SELECT

      "user"."name" AS "userName",
      "sender"."userId",
      "startTime"."string" AS "startTime",
      "endTime"."string" AS "endTime",
      CAST(
        CASE
          WHEN "fieldVal"."string" = '有給（時間給）'
            THEN EXTRACT(EPOCH FROM (("endTime"."string")::time - ("startTime"."string")::time)) / 60

          WHEN "fieldVal"."string" = '有給休暇（1日休）'
            THEN (
                    SELECT "workMins" FROM "workHours"
                    WHERE "userId" = "sender"."userId"
                    AND "workHours"."from" <= "dateFieldValue"."date"
                    order by "from" desc
                    limit 1
                )
          ELSE 0
        END AS INT
    ) as "totalConsumedMinutes",
      "dateFieldValue"."date" AS "consumedDate"

    FROM
      "ApRequest" "req"
    INNER JOIN
      "ApSender" "sender" ON "req"."apSenderId" = "sender"."id"
    INNER JOIN
      "User" "user" ON "sender"."userId" = "user"."id"
    INNER JOIN
      "ApCustomFieldValue" "fieldVal" ON "req"."id" = "fieldVal"."approvalRequestId"
    INNER JOIN
      "ApCustomField" "customField" ON "fieldVal"."customFieldId" = "customField"."id"

      --ー開始時間、終了時間、日付のApCustomFieldValueを取得
    LEFT JOIN
      "ApCustomFieldValue" "startTime"
        ON "req"."id" = "startTime"."approvalRequestId"
        AND "startTime"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '開始時刻' AND "id" = "startTime"."customFieldId")
    LEFT JOIN
      "ApCustomFieldValue" "endTime"
        ON "req"."id" = "endTime"."approvalRequestId"
        AND "endTime"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '終了時刻' AND "id" = "endTime"."customFieldId")
    LEFT JOIN
      "ApCustomFieldValue" "dateFieldValue"
        ON "req"."id" = "dateFieldValue"."approvalRequestId"
        AND "dateFieldValue"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '日付' AND "id" = "dateFieldValue"."customFieldId")

    WHERE 1=1
      AND "req"."forceApproved" = true
      AND "req"."status" = '確定'
      AND "fieldVal"."string" IN ('有給（時間給）', '有給休暇（1日休）')

  `

  const yukyuConsumeRecords: yukyuConsumeRecord[] = (await useRawSql({sql: yukyuConsumeRecordsSql})).rows

  return {yukyuConsumeRecords}
}

// const getyukyuGroupedBy = async ({minutePerDay}) => {
//   const query = sql`
//   -- 有給付与の合計を個別に計算
//   SELECT
//     "gl"."userId",
//     CAST(SUM("gl"."totalGrantedMinutes") AS INT) AS "totalGrantedMinutes", -- 有給付与の合計
//     CAST(SUM(COALESCE("cl"."totalConsumedMinutes", 0)) AS INT) AS "totalConsumedMinutes", -- 消費された分
//     CAST(SUM("gl"."totalGrantedMinutes" - COALESCE("cl"."totalConsumedMinutes", 0)) AS INT) AS "totalRemainingMinutes" -- 残存有給
//   FROM (
//     -- 有給付与の集計
//     SELECT
//       "userId",
//       SUM("mins") AS "totalGrantedMinutes"
//     FROM
//       "PaidLeaveGrant"
//     GROUP BY
//       "userId"
//   ) AS "gl"
//   LEFT JOIN (
//     -- 有給消費の集計
//     SELECT
//       "sender"."userId",
//       SUM(CASE
//           WHEN "fieldVal"."string" = '有給（時間給）' THEN
//               EXTRACT(EPOCH FROM (("endTime"."string")::time - ("startTime"."string")::time)) / 60
//           WHEN "fieldVal"."string" = '有給休暇（1日休）' THEN ${minutePerDay}
//           ELSE 0
//       END) AS "totalConsumedMinutes",
//       "dateFieldValue"."date" AS "consumedDate"
//     FROM
//       "ApRequest" "req"
//     INNER JOIN
//       "ApSender" "sender" ON "req"."apSenderId" = "sender"."id"
//     INNER JOIN
//       "ApCustomFieldValue" "fieldVal" ON "req"."id" = "fieldVal"."approvalRequestId"
//     INNER JOIN
//       "ApCustomField" "customField" ON "fieldVal"."customFieldId" = "customField"."id"
//     LEFT JOIN
//       "ApCustomFieldValue" "startTime"
//         ON "req"."id" = "startTime"."approvalRequestId"
//         AND "startTime"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '開始時刻' AND "id" = "startTime"."customFieldId")
//     LEFT JOIN
//       "ApCustomFieldValue" "endTime"
//         ON "req"."id" = "endTime"."approvalRequestId"
//         AND "endTime"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '終了時刻' AND "id" = "endTime"."customFieldId")
//     LEFT JOIN
//       "ApCustomFieldValue" "dateFieldValue"
//         ON "req"."id" = "dateFieldValue"."approvalRequestId"
//         AND "dateFieldValue"."customFieldId" = (SELECT "id" FROM "ApCustomField" WHERE "name" = '日付' AND "id" = "dateFieldValue"."customFieldId")
//     WHERE
//       "req"."forceApproved" = true
//       AND "fieldVal"."string" IN ('有給（時間給）', '有給休暇（1日休）')
//     GROUP BY
//       "sender"."userId", "dateFieldValue"."date"
//   ) AS "cl"
//   ON "gl"."userId" = "cl"."userId"
//   GROUP BY
//     "gl"."userId";
// `

//   const yukyuGroupedBy: userYukyuAgg[] = await useRawSql({sql: query})
//   return {yukyuGroupedBy}
// }
