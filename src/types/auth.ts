export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | string
  createdAt: string
  updatedAt: string
}

export type AuthCredentials = {
  email: string
  password: string
}

export type AuthRegisterInput = AuthCredentials & {
  name: string
}

export type AuthWithToken = {
  user: AuthUser
  token: string
}
