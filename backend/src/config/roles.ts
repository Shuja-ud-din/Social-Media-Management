const permissions: Record<string, string[]> = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
}

export enum Roles {
  USER = 'user',
  ADMIN = 'admin',
}

export const roleRights: Map<string, string[]> = new Map(Object.entries(permissions))
