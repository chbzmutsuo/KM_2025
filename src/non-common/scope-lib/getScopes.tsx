import {anyObject} from '@cm/types/types'
import {Arr} from '@class/Arr'
import {judgeIsAdmin, roleIs, typeIs} from 'src/non-common/scope-lib/judgeIsAdmin'

type GroupieScopeType = {
  schoolId?: number
  teacherId?: number
  classroomId?: number
  isSchoolLeader: boolean
}

type AdvantageScopeType = {
  isCoach: boolean
  isStudent: boolean
}

type getScopeOptionsProps = {query?: anyObject; roles?: any[]}

export const getScopes = (session: anyObject, options: getScopeOptionsProps) => {
  const {query, roles} = options ?? {}

  const login = session?.id ? true : false
  const id = session?.id

  const {admin, globalUserId, getGlobalUserId} = judgeIsAdmin(session, query)

  const getGroupieScopes = () => {
    const schoolId = !admin ? session?.schoolId : Number(query?.g_schoolId ?? 0)
    const teacherId = !admin ? session?.id : Number(query?.g_teacherId ?? 0)
    const isSchoolLeader = typeIs(['責任者'], session)

    let result: GroupieScopeType = {
      schoolId,
      teacherId,
      isSchoolLeader,
    }

    result = addAdminToRoles(result, session) as GroupieScopeType
    return result
  }

  const getYoshinariScopes = () => {
    const roleNames = (roles ?? []).map(d => d.name)

    const isSuperUser = !!Arr.findCommonValues([`総務管理者`], roleNames) || admin
    const isApprover = !!Arr.findCommonValues([`一般承認者`], roleNames)
    return {isSuperUser, isApprover}
  }
  const getTsukurungerScopes = () => {
    const roleNames = (roles ?? []).map(d => d.name)

    const adminRole = !!Arr.findCommonValues([`管理者`], roleNames) || admin
    const subConRole = !!Arr.findCommonValues([`下請`], roleNames)

    // const adminRole = typeIs(['管理者'], session) || admin
    // const subConRole = typeIs(['下請'], session)
    // const isTsukurungerMember = login && !subConRole

    return {subConRole, adminRole}
  }

  const getAdvantageProps = () => {
    const isCoach = session?.membershipName === 'コーチ' && login
    const isStudent = session?.membershipName === '生徒' && login

    const result: AdvantageScopeType = {isCoach, isStudent}
    // addAdminToRoles(result, session)
    return result
  }

  const getTbmScopes = () => {
    const userId = !admin ? session?.id : Number(query?.g_userId ?? session?.id ?? 0)
    const tbmBaseId = !admin ? session?.tbmBaseId : Number(query?.g_tbmBaseId ?? session?.tbmBaseId ?? 0)
    return {userId, tbmBaseId}
  }

  const result = {
    id,
    session,
    login,
    admin,
    getGlobalUserId,
    getGroupieScopes,
    getAdvantageProps,
    getAquepotScopes: () => ({
      aqCustomerId: !admin ? session?.aqCustomerId : Number(query?.g_aqCustomerId ?? 0),
    }),
    getTbmScopes,
    getYoshinariScopes,
    getTsukurungerScopes,
  }
  addAdminToRoles
  return result
}

const addAdminToRoles: (targetObject: any, session: anyObject) => anyObject = (targetObject, session) => {
  // const result: anyObject = {...targetObject}
  Object.keys(targetObject).forEach(key => {
    const value = targetObject[key]
    targetObject[key] = value

    if (typeof targetObject[key] !== 'object' && roleIs(['管理者'], session) && targetObject[key] === false) {
      targetObject[key] = true
    }
  })

  return targetObject
}

export const getAqLoginType = ({session}) => {
  const {customerNumber, email} = session
  const asCustomer = customerNumber && email
  const asUser = session && !asCustomer
  return {asCustomer, asUser}
}
