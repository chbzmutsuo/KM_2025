// middleware.ts
import {getToken} from 'next-auth/jwt'
import {NextRequest, NextResponse} from 'next/server'

const defaultPathValidateConfig = {
  isValid: session => session?.email,
  redirect: (origin, rootPath) => `${origin}/not-found?rootPath=${rootPath}`,
}
type rootPath = {
  rootPath: string
  paths: {
    matcher: string
    isValid: (session: any) => boolean
    redirect: (origin: string, rootPath: string) => string
  }[]
}

const getFreePathsMathcer = (rootPath, pathArray) => {
  const defaultFreePaths = [`/.*api`, `/seeder`]
  return `/${rootPath}(?!${[...defaultFreePaths, ...pathArray].join(`|`)})/.+`
}

export const rootPaths: rootPath[] = [
  {paths: [{matcher: getFreePathsMathcer(`Advantage`, []), ...defaultPathValidateConfig}], rootPath: 'Advantage'},
  {paths: [{matcher: getFreePathsMathcer(`Grouping`, [`/game/main`]), ...defaultPathValidateConfig}], rootPath: 'Grouping'},
  {paths: [{matcher: getFreePathsMathcer(`estimate`, []), ...defaultPathValidateConfig}], rootPath: `estimate`},
  {paths: [{matcher: getFreePathsMathcer(`marutoyo`, []), ...defaultPathValidateConfig}], rootPath: `marutoyo`},
  {paths: [{matcher: getFreePathsMathcer(`sankosha`, []), ...defaultPathValidateConfig}], rootPath: `sankosha`},
  {paths: [{matcher: getFreePathsMathcer(`tsukurunger`, []), ...defaultPathValidateConfig}], rootPath: 'tsukurunger'},
  {paths: [{matcher: getFreePathsMathcer(`yoshinari`, []), ...defaultPathValidateConfig}], rootPath: `yoshinari`},
  {paths: [{matcher: getFreePathsMathcer(`aquapot`, []), ...defaultPathValidateConfig}], rootPath: `aquapot`},
  {paths: [{matcher: getFreePathsMathcer(`sohken`, []), ...defaultPathValidateConfig}], rootPath: `sohken`},
]

export async function middleware(req: NextRequest) {
  // get session from next auth
  const session = await getToken({req})

  /**必要情報 */
  const {pathname, origin, search, href} = req.nextUrl

  const isTargetPath = rootPaths.find(d => {
    const reg = new RegExp(`^/${d.rootPath}`)
    return reg.test(pathname)
  })

  if (isTargetPath) {
    const match = isTargetPath.paths.length > 0 && isTargetPath.paths.find(d => new RegExp(d.matcher).test(pathname))
    if (match && !match.isValid(session)) {
      return NextResponse.redirect(match.redirect(origin, isTargetPath.rootPath))
    }
  }

  return NextResponse.next()
}

const config = {
  matcher: [...rootPaths.map(path => `/${path}(.*)`), '/((?!api|_next/static|favicon.ico|manifest|next-js-icon).*)'],
}

export default middleware
