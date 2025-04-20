import prisma from '@lib/prisma'
import {NextRequest, NextResponse} from 'next/server'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const lastLog = await prisma.appLog.findFirst({
    orderBy: {timestamp: 'desc'},
  })
  const diffTimeMilliSec = new Date().getTime() - new Date(lastLog?.timestamp ?? new Date()).getTime()

  const {
    userId,
    pageName,
    pageUrl,
    pageParams,
    dataLogComponent,
    functionName,
    functionArgs,
    functionReturnValue,
    actionType,
    pageLoadTime,
    errorMessage,
    sessionDuration,
  } = body

  // サーバーサイドで取得できるフィールド
  const userAgent = req.headers.get('user-agent') || null
  const referrerUrl = req.headers.get(`referer`) || null
  const data = {
    userId,
    diffTime: diffTimeMilliSec / 1000,
    pageName,
    userAgent,
    referrerUrl,
    pageUrl,
    pageParams,
    dataLogComponent,
    functionName,
    // functionArgs,
    // functionReturnValue,
    actionType,
    pageLoadTime,
    errorMessage,
    sessionDuration,
  }

  try {
    // データベースにログを保存
    const logEntry = await prisma.appLog.create({data})
    return NextResponse.json({success: true, result: logEntry, message: 'Log saved successfully'}, {status: 200})
  } catch (error) {
    console.error('Error saving log:', error)
    NextResponse.json({success: false, result: null, message: 'Error saving log'}, {status: 500})
  }
}
