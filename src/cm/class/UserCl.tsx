import {userRoleType} from '@hooks/useUserRole'
import {Family, User} from '@prisma/client'
import {getScopes} from 'src/non-common/scope-lib/getScopes'

export type userClData = User & {
  avatar?: string | null
  roles: userRoleType[]
  scopes: ReturnType<typeof getScopes>
  Parent?: User[]
  Child?: User[]
  Family?: Family
}

export class UserCl {
  data: userClData
  constructor(props: {user: User; roles: userRoleType[]; scopes: ReturnType<typeof getScopes>}) {
    this.data = {
      ...props.user,
      scopes: props.scopes,
      roles: props.roles,
    }
  }
}
