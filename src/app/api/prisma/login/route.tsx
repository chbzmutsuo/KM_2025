import {SessionFaker} from 'src/non-common/SessionFaker'
import prisma from 'src/cm/lib/prisma'
import chalk from 'chalk'
import {NextRequest, NextResponse} from 'next/server'
import {verifyPassword} from 'src/cm/lib/crypt'

export const POST = async (req: NextRequest) => {
  const {email: authId, password: authPw} = await req.json()

  const targetModels = SessionFaker.getTargetModels()

  const users = await Promise.all(
    targetModels.map(async data => {
      const {name, id_pw} = data
      const authKey = {
        id: id_pw?.id ?? 'email',
        pw: id_pw?.pw ?? 'password',
      }
      const PrismaClient = prisma?.[name] as any
      return {
        name,
        authKey,
        userData: await PrismaClient?.findUnique({
          where: {[authKey.id]: authId},
        }),
      }
    })
  )

  const foundUser = users.find(user => user.userData)

  chalk.red('ログインを確認')

  if (foundUser) {
    const {userData, authKey} = foundUser
    let match = false

    match = String(userData?.[authKey.pw]) === String(authPw)
    if (!match) {
      const hasedMatch = await verifyPassword(authPw, userData?.[authKey.pw])
      match = hasedMatch
    }

    if (match) {
      const {name, email, role, type} = userData ?? {}
      console.info('login successed', {name, email, role, type})
      return NextResponse.json({...foundUser.userData})
    }
  }

  console.info('ログイン失敗', {foundUser: null})
  return NextResponse.json(null)
}
